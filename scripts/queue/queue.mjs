#!/usr/bin/env node
/* Claude's side of the contribution queue (see docs/collaboration-plan.md and worker/index.ts).

   The queue key is never typed into a chat, a file in this folder or a command. It lives in this Mac's Keychain
   under the name "khoim-queue-key", and this script is the only thing that reads it. Nothing here prints it.

     node scripts/queue/queue.mjs save-key          take the key from the clipboard, store it, test it, clear the clipboard
     node scripts/queue/queue.mjs check             is there a key, does khoim.in accept it, how many items are unread
     node scripts/queue/queue.mjs unread            waiting items that have no note from Claude yet (JSON)
     node scripts/queue/queue.mjs notes <file>      post notes from a JSON file: [{ "id", "suggestion", "note" }, ...]
     node scripts/queue/queue.mjs allowed           allowed items that are not on the site yet (JSON)
     node scripts/queue/queue.mjs incorporated <id> [<id> ...]   mark allowed items as brought into the site

   A note is advice for the reviewer. It cannot allow, reject or change a contribution: the server does not let it. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { userInfo } from 'node:os';

const SITE = process.env.KHOIM_SITE || 'https://khoim.in';
const SERVICE = 'khoim-queue-key';
const SUGGESTIONS = ['looks fine', 'needs a speaker', 'reject'];

const stop = message => { console.error(message); process.exit(1); };

function storedKey() {
  if (process.env.KHOIM_QUEUE_KEY) return process.env.KHOIM_QUEUE_KEY.trim();
  try {
    return execFileSync('security', ['find-generic-password', '-a', userInfo().username, '-s', SERVICE, '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

async function call(key, path, body) {
  let r;
  try {
    r = await fetch(SITE + path, {
      method: body ? 'POST' : 'GET',
      headers: { authorization: 'Bearer ' + key, ...(body ? { 'content-type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    stop('Could not reach ' + SITE + '. Check the internet connection and try again.');
  }
  if (r.status === 401) stop('khoim.in did not accept the key. The key stored on this Mac is not the QUEUE_KEY that Cloudflare has.');
  if (r.status === 503) stop('Contributions are not open on khoim.in (the database or the bot check is not set up).');
  const data = await r.json().catch(() => null);
  if (!r.ok || !data?.ok) stop('khoim.in answered ' + r.status + (data?.error ? ' (' + data.error + ')' : '') + '.');
  return data;
}

function needKey() {
  const key = storedKey();
  if (!key) stop('No queue key is stored on this Mac yet. Copy the QUEUE_KEY, then run: node scripts/queue/queue.mjs save-key');
  return key;
}

const [command, ...rest] = process.argv.slice(2);

if (command === 'save-key') {
  const key = execFileSync('pbpaste', { encoding: 'utf8' }).trim();
  if (key.length < 40 || /\s/.test(key)) stop('The clipboard does not hold a queue key (it should be one line, 40 characters or more, no spaces). Copy the QUEUE_KEY and run this again.');
  await call(key, '/api/queue?unread=1');
  execFileSync('security', ['add-generic-password', '-U', '-a', userInfo().username, '-s', SERVICE, '-w', key], { stdio: 'ignore' });
  execFileSync('pbcopy', { input: '' });
  console.log('Saved. khoim.in accepts the key, and it is now in this Mac\'s Keychain as "' + SERVICE + '". The clipboard has been cleared.');
} else if (command === 'check') {
  const data = await call(needKey(), '/api/queue?unread=1');
  console.log('The key works. Waiting items with no note from Claude yet: ' + data.items.length + '.');
} else if (command === 'unread') {
  const data = await call(needKey(), '/api/queue?unread=1');
  console.log(JSON.stringify(data.items, null, 2));
} else if (command === 'allowed') {
  const data = await call(needKey(), '/api/queue?status=allowed&new=1');
  console.log(JSON.stringify(data.items, null, 2));
} else if (command === 'notes') {
  if (!rest[0]) stop('Give the path of a JSON file: [{ "id", "suggestion", "note" }, ...]');
  let notes;
  try { notes = JSON.parse(readFileSync(rest[0], 'utf8')); } catch { stop('Could not read ' + rest[0] + ' as JSON.'); }
  if (!Array.isArray(notes) || !notes.length) stop('The file has no notes in it.');
  for (const n of notes) {
    if (!n || typeof n.id !== 'string' || !SUGGESTIONS.includes(n.suggestion) || typeof n.note !== 'string' || !n.note.trim()) {
      stop('Nothing was posted. Each note needs an id, a note, and a suggestion that is one of: ' + SUGGESTIONS.join(', ') + '.');
    }
  }
  const key = needKey();
  for (const n of notes) await call(key, '/api/queue/note', { id: n.id, suggestion: n.suggestion, note: n.note });
  console.log('Posted ' + notes.length + (notes.length === 1 ? ' note.' : ' notes.'));
} else if (command === 'incorporated') {
  if (!rest.length) stop('Give the ids of the allowed items that are now on the site.');
  const data = await call(needKey(), '/api/queue/incorporated', { ids: rest });
  console.log('Marked ' + data.marked + ' as on the site.');
} else {
  stop('Commands: save-key, check, unread, notes <file>, allowed, incorporated <id> ...');
}
