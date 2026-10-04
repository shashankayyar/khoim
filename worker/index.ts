/* The small server part of Khoim. It runs only for addresses that start with /api/. Every page, the map and
   the fonts are plain files served without it.

   What it does:
   - takes contributions from the form on a place's card (text, or a recording of up to ten seconds), runs
     automatic checks, and puts them in a queue
   - lets the scheduled Claude job read the queue and attach a note to each item (it cannot decide anything)
   - lets a signed-in reviewer allow, reject or remove an item
   - hands the site what has been allowed for the layers other than Names (recordings, crops, food, music,
     landmarks), so that these show on khoim.in within a few minutes of a reviewer allowing them

   What it never does: change a name on the site. An allowed name, say-it guide or correction reaches khoim.in
   only through a pull request. */
import placesJson from '../src/data/generated/places.json';
import villagesJson from '../src/data/generated/villages.json';
import { hasQueueKey, reviewerFor } from './access';
import type { AudioRow, ClipRow, Ctx, D1, Env, Kind, Row, Status } from './types';

/* ---------- Places: a contribution must be about a place that exists ---------- */

interface KnownPlace { official: string; where: string; lgd: string | null; /** a village's taluka */ taluka: string | null }
const PLACES = new Map<string, KnownPlace>();
{
  const named = placesJson as unknown as { id: string; level: string; parent: string | null; official: string; lgd: string | null }[];
  const officialOf = new Map(named.map(p => [p.id, p.official]));
  const label: Record<string, string> = { state: 'State', district: 'District', taluka: 'Taluka' };
  for (const p of named) PLACES.set(p.id, { official: p.official, lgd: p.lgd, taluka: null, where: label[p.level] + (p.parent && p.parent !== 'goa' ? ' in ' + officialOf.get(p.parent) : '') });
  for (const v of villagesJson as unknown as { id: string; t: string; n: string; lgd: string | null }[]) PLACES.set(v.id, { official: v.n, lgd: v.lgd, taluka: v.t, where: 'Village in ' + officialOf.get(v.t) });
}

const KINDS: Kind[] = ['name', 'say', 'correction', 'voice', 'crops', 'food', 'music', 'landmarks'];
/* Typed things that show on khoim.in as soon as they are allowed. (A recording does too, once its clip is made.) */
const LIVE_TEXT: Kind[] = ['crops', 'food', 'music', 'landmarks'];
const STATUSES: Status[] = ['waiting', 'allowed', 'rejected', 'removed'];
const LIMITS = { value: 200, how: 500, name: 80, body: 10_000, waiting: 2000, values: 6 };
/* A recording: ten seconds at most (a little slack for the browser's clock), about 600 KB at most, which is
   800,000 characters once written as text. Waiting recordings are capped so the free database cannot fill up. */
const AUDIO = { seconds: 11, minSeconds: 0.4, chars: 800_000, body: 900_000, waiting: 300 };
const AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/ogg'];
/* A reviewer may keep only part of a recording (the name, without the silence or the talk around it). The
   recording itself is never cut here: the part to keep is written down as "Clip 0.85-2.40" (seconds) in the
   item's final_value, the way an edited spelling is. The part that plays on khoim.in is cut by the reviewer's
   browser when they allow it (src/admin/ClipEditor.tsx) and arrives here as a small WAV file, which every phone
   can play. Nothing wider than the marks is ever public. */
const CLIP_MIN_SECONDS = 0.3;
function clipText(clip: unknown): string | null | false {
  if (clip == null) return null;
  const c = clip as Record<string, unknown>;
  const start = Math.round(Number(c.start) * 100) / 100, end = Math.round(Number(c.end) * 100) / 100;
  if (!(start >= 0 && end <= AUDIO.seconds && end - start >= CLIP_MIN_SECONDS)) return false;
  return `Clip ${start.toFixed(2)}-${end.toFixed(2)}`;
}
/* The cut part: mono, 16 bit, 24,000 samples a second at most, so the longest recording (eleven seconds with the
   slack) is 528 KB, about 704,000 characters as text. */
const CLIP = { mime: 'audio/wav', chars: 720_000, body: 780_000 };
function clipAudio(audio: unknown): { seconds: number; data: string } | null | false {
  if (audio == null) return null;
  const a = audio as Record<string, unknown>;
  const seconds = Math.round(Number(a.seconds) * 100) / 100, data = typeof a.data === 'string' ? a.data : '';
  if (a.mime !== CLIP.mime || !(seconds >= CLIP_MIN_SECONDS && seconds <= AUDIO.seconds)) return false;
  if (!data || data.length > CLIP.chars || !/^[A-Za-z0-9+/]+={0,2}$/.test(data) || !looksLikeWav(data)) return false;
  return { seconds, data };
}
/** Rejected and removed items are deleted after this many days (well inside the 90 the privacy notice promises). */
const KEEP_UNUSED_DAYS = 60;

/* ---------- Helpers ---------- */

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (status: number, error: string) => json({ ok: false, error }, status);

/** Trims, joins broken lines, drops invisible control characters, and settles accents into one form. */
const tidy = (s: unknown, max: number) => (typeof s === 'string' ? s : '').normalize('NFC').replace(/[\u0000-\u001f\u007f\u200b\u2028\u2029]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();

function scriptOf(s: string): 'deva' | 'latin' | 'mixed' | 'other' {
  const deva = /[\u0900-\u097f]/.test(s), latin = /[a-z]/i.test(s);
  return deva && latin ? 'mixed' : deva ? 'deva' : latin ? 'latin' : 'other';
}

/** Automatic checks. These are notes for the reviewer; none of them decides anything. */
function flagsFor(kind: Kind, value: string, how: string, place: KnownPlace): string[] {
  const flags: string[] = [];
  if (/https?:\/\/|www\./i.test(value + ' ' + how)) flags.push('Contains a link');
  if (value.length < 2) flags.push('Very short');
  if (scriptOf(value) === 'other') flags.push('Not in Devanagari or Roman letters');
  if (kind === 'name' && fold(value) === fold(place.official)) flags.push('Same as the official name');
  return flags;
}

/** A recording must really be one: the first bytes of a WebM, MP4 or Ogg file. */
function looksLikeAudio(base64: string): boolean {
  let head: string;
  try { head = atob(base64.slice(0, 16)); } catch { return false; }
  const b = (i: number) => head.charCodeAt(i);
  const webm = b(0) === 0x1a && b(1) === 0x45 && b(2) === 0xdf && b(3) === 0xa3;
  return webm || head.slice(4, 8) === 'ftyp' || head.slice(0, 4) === 'OggS';
}

function looksLikeWav(base64: string): boolean {
  let head: string;
  try { head = atob(base64.slice(0, 16)); } catch { return false; }
  return head.slice(0, 4) === 'RIFF' && head.slice(8, 12) === 'WAVE';
}

const bytesOf = (base64: string) => {
  const text = atob(base64), bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
  return bytes;
};

let schemaReady = false;
async function ensureSchema(db: D1): Promise<void> {
  if (schemaReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS contributions (
      id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
      place_id TEXT NOT NULL, place_official TEXT NOT NULL, place_where TEXT NOT NULL, place_lgd TEXT,
      kind TEXT NOT NULL, value TEXT NOT NULL, how_known TEXT NOT NULL, credit_name TEXT,
      script TEXT NOT NULL, flags TEXT NOT NULL DEFAULT '[]', repeats INTEGER NOT NULL DEFAULT 1,
      claude_note TEXT, claude_suggestion TEXT, claude_at TEXT,
      status TEXT NOT NULL DEFAULT 'waiting', final_value TEXT, decided_by TEXT, decided_at TEXT, reject_reason TEXT,
      incorporated_at TEXT)`),
    db.prepare('CREATE INDEX IF NOT EXISTS contributions_status ON contributions (status, created_at)'),
    db.prepare('CREATE TABLE IF NOT EXISTS recordings (id TEXT PRIMARY KEY, mime TEXT NOT NULL, seconds REAL NOT NULL, data TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS clips (id TEXT PRIMARY KEY, mime TEXT NOT NULL, seconds REAL NOT NULL, made_at TEXT NOT NULL, data TEXT NOT NULL)')
  ]);
  schemaReady = true;
}

async function turnstileOk(token: string, env: Env): Promise<boolean> {
  if (!token || !env.TURNSTILE_SECRET) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token })
  });
  if (!res.ok) return false;
  return ((await res.json()) as { success: boolean }).success === true;
}

async function readBody(request: Request, max = LIMITS.body): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > max) return null;
  try { const v = JSON.parse(text); return v && typeof v === 'object' ? v as Record<string, unknown> : null; } catch { return null; }
}

/** A form may only be sent from our own pages. */
const sameSite = (request: Request) => {
  const origin = request.headers.get('Origin');
  return !origin || new URL(origin).host === new URL(request.url).host;
};

const ready = (env: Env): env is Env & { DB: D1 } => !!(env.DB && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET);

/* ---------- The form ---------- */

async function contribute(request: Request, env: Env): Promise<Response> {
  if (!ready(env)) return fail(503, 'not-open');
  if (!sameSite(request)) return fail(403, 'wrong-site');
  const body = await readBody(request, AUDIO.body);
  if (!body) return fail(400, 'bad-request');

  const placeId = String(body.placeId ?? '');
  const place = PLACES.get(placeId);
  const how = tidy(body.how, LIMITS.how), village = tidy(body.village, LIMITS.name), name = tidy(body.name, LIMITS.name);
  if (!place || body.consent !== true) return fail(400, 'incomplete');

  /* One send can hold several kinds of thing, and several things of each kind (a name, two crops, a dance,
     a recording). Each thing becomes its own item, so a reviewer can allow one and reject another.
     An older page still open in someone's browser sends one kind at a time; that shape is read too. */
  const sent: unknown[] = Array.isArray(body.items) ? body.items : [{ kind: body.kind, values: Array.isArray(body.values) ? body.values : [body.value] }];
  const wanted = new Map<string, { kind: Kind; value: string }>();
  let voice = false;
  for (const raw of sent.slice(0, KINDS.length)) {
    const item = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const kind = KINDS.find(k => k === item.kind);
    if (!kind) return fail(400, 'incomplete');
    if (kind === 'voice') { voice = true; continue; }
    const typed = Array.isArray(item.values) ? item.values : [];
    for (const value of [...new Set(typed.map(v => tidy(v, LIMITS.value)).filter(Boolean))].slice(0, LIMITS.values)) wanted.set(kind + '\n' + value, { kind, value });
  }
  if (!wanted.size && !voice) return fail(400, 'incomplete');
  if (wanted.size && !how) return fail(400, 'incomplete');
  /* with a recording, "how they know" is where the speaker is from */
  const voiceHow = village || how;
  if (voice && !voiceHow) return fail(400, 'incomplete');

  let audio: { mime: string; seconds: number; data: string } | null = null;
  if (voice) {
    const a = (body.audio && typeof body.audio === 'object' ? body.audio : {}) as Record<string, unknown>;
    const mime = AUDIO_TYPES.find(t => t === a.mime), seconds = Number(a.seconds), data = typeof a.data === 'string' ? a.data : '';
    if (!mime || !(seconds >= AUDIO.minSeconds && seconds <= AUDIO.seconds)) return fail(400, 'bad-recording');
    if (!data || data.length > AUDIO.chars || !/^[A-Za-z0-9+/]+={0,2}$/.test(data) || !looksLikeAudio(data)) return fail(400, 'bad-recording');
    audio = { mime, seconds, data };
  } else if (JSON.stringify(body).length > LIMITS.body) {
    return fail(400, 'bad-request');
  }
  if (!(await turnstileOk(String(body.token ?? ''), env))) return fail(403, 'bot-check');

  await ensureSchema(env.DB);
  /* Two reads and one write, however many things were sent: the free plan allows few database calls per request. */
  const waiting = await env.DB.prepare("SELECT COUNT(*) AS n, SUM(kind = 'voice') AS voices FROM contributions WHERE status = 'waiting'").first<{ n: number; voices: number | null }>();
  const here = wanted.size
    ? (await env.DB.prepare("SELECT id, kind, value FROM contributions WHERE place_id = ? AND status = 'waiting'").bind(placeId).all<{ id: string; kind: Kind; value: string }>()).results
    : [];
  const already = new Map(here.map(r => [r.kind + '\n' + r.value, r.id]));
  const fresh = [...wanted.values()].filter(w => !already.has(w.kind + '\n' + w.value));
  if ((waiting?.n ?? 0) + fresh.length + (voice ? 1 : 0) > LIMITS.waiting || (voice && (waiting?.voices ?? 0) >= AUDIO.waiting)) return fail(503, 'queue-full');

  /* Written in as few statements as possible: several rows to an INSERT (the database takes 100 values per
     statement, a row has 12), and one UPDATE for everything that was sent before. */
  const now = new Date().toISOString();
  const rowOf = (id: string, kind: Kind, value: string, howKnown: string) =>
    [id, now, placeId, place.official, place.where, place.lgd, kind, value, howKnown, name || null, scriptOf(value), JSON.stringify(flagsFor(kind, value, howKnown, place))];
  const rows = fresh.map(w => rowOf(crypto.randomUUID(), w.kind, w.value, how));
  const writes = [];
  /* The same thing sent again for the same place is counted, not stored twice. */
  const repeated = [...wanted.values()].map(w => already.get(w.kind + '\n' + w.value)).filter((id): id is string => !!id);
  if (repeated.length) writes.push(env.DB.prepare(`UPDATE contributions SET repeats = repeats + 1 WHERE id IN (${repeated.map(() => '?').join(', ')})`).bind(...repeated));
  if (audio) {
    /* a recording has no text of its own; the list shows this word in its place */
    const id = crypto.randomUUID();
    rows.push(rowOf(id, 'voice', 'Recording', voiceHow));
    writes.push(env.DB.prepare('INSERT INTO recordings (id, mime, seconds, data) VALUES (?, ?, ?, ?)').bind(id, audio.mime, audio.seconds, audio.data));
  }
  for (let i = 0; i < rows.length; i += 8) {
    const some = rows.slice(i, i + 8);
    writes.push(env.DB.prepare(`INSERT INTO contributions (id, created_at, place_id, place_official, place_where, place_lgd, kind, value, how_known, credit_name, script, flags)
      VALUES ${some.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}`).bind(...some.flat()));
  }
  await env.DB.batch(writes);
  return json({ ok: true });
}

/* ---------- The admin page ---------- */

/* `live`: on khoim.in now. A typed thing for one of the other layers is, from the moment it is allowed; a
   recording is, once its clip has been made. Names come in through a pull request (incorporated_at). */
const present = (r: Row & { has_clip?: number | null }) => {
  const { has_clip, ...row } = r;
  return { ...row, flags: JSON.parse(r.flags || '[]') as string[], live: r.status === 'allowed' && (LIVE_TEXT.includes(r.kind) || (r.kind === 'voice' && !!has_clip)) };
};

async function adminItems(request: Request, env: Env): Promise<Response> {
  const me = await reviewerFor(request, env);
  if (!me) return fail(401, 'not-signed-in');
  if (!env.DB) return fail(503, 'not-open');
  await ensureSchema(env.DB);
  /* The privacy notice promises that contributions we do not use are deleted within 90 days. */
  const cutoff = new Date(Date.now() - KEEP_UNUSED_DAYS * 86_400_000).toISOString();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM recordings WHERE id IN (SELECT id FROM contributions WHERE status IN ('rejected', 'removed') AND decided_at < ?)").bind(cutoff),
    env.DB.prepare("DELETE FROM clips WHERE id IN (SELECT id FROM contributions WHERE status IN ('rejected', 'removed') AND decided_at < ?)").bind(cutoff),
    env.DB.prepare("DELETE FROM contributions WHERE status IN ('rejected', 'removed') AND decided_at < ?").bind(cutoff)
  ]);
  const status = STATUSES.find(s => s === new URL(request.url).searchParams.get('status')) ?? 'waiting';
  const items = await env.DB.prepare('SELECT c.*, (SELECT 1 FROM clips k WHERE k.id = c.id) AS has_clip FROM contributions c WHERE c.status = ? ORDER BY c.created_at DESC LIMIT 200').bind(status).all<Row & { has_clip: number | null }>();
  const counts = await env.DB.prepare('SELECT status, COUNT(*) AS n FROM contributions GROUP BY status').all<{ status: Status; n: number }>();
  return json({ ok: true, me: { name: me.name, konkani: me.konkani }, counts: Object.fromEntries(counts.results.map(c => [c.status, c.n])), items: items.results.map(present) });
}

/** A reviewer listens to a recording. Nobody else can. */
async function adminAudio(request: Request, env: Env): Promise<Response> {
  const me = await reviewerFor(request, env);
  if (!me) return fail(401, 'not-signed-in');
  if (!env.DB) return fail(503, 'not-open');
  await ensureSchema(env.DB);
  const row = await env.DB.prepare('SELECT * FROM recordings WHERE id = ?').bind(new URL(request.url).searchParams.get('id') ?? '').first<AudioRow>();
  if (!row) return fail(404, 'not-found');
  return new Response(bytesOf(row.data), { headers: { 'content-type': row.mime, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}

async function adminDecide(request: Request, env: Env): Promise<Response> {
  const me = await reviewerFor(request, env);
  if (!me) return fail(401, 'not-signed-in');
  if (!env.DB) return fail(503, 'not-open');
  if (!sameSite(request)) return fail(403, 'wrong-site');
  const body = await readBody(request, CLIP.body);
  const action = body && ['allow', 'clip', 'reject', 'remove'].find(a => a === body.action);
  if (!body || !action) return fail(400, 'bad-request');
  await ensureSchema(env.DB);
  const row = await env.DB.prepare('SELECT * FROM contributions WHERE id = ?').bind(String(body.id ?? '')).first<Row>();
  if (!row) return fail(404, 'not-found');
  const now = new Date().toISOString(), who = `${me.name} <${me.email}>`;

  /* A recording goes onto khoim.in as the part the reviewer kept, cut by their browser. */
  const putClip = (audio: { seconds: number; data: string }) =>
    env.DB!.prepare('INSERT OR REPLACE INTO clips (id, mime, seconds, made_at, data) VALUES (?, ?, ?, ?, ?)').bind(row.id, CLIP.mime, audio.seconds, now, audio.data);

  if (action === 'allow') {
    /* Only someone who reads Konkani may allow a name, a say-it guide or a correction to one. */
    if (!me.konkani) return fail(403, 'needs-konkani-reviewer');
    if (row.status !== 'waiting') return fail(409, 'already-decided');
    if (row.kind === 'voice') {
      const clip = clipText(body.clip), audio = clipAudio(body.audio);
      if (clip === false || audio === false) return fail(400, 'bad-clip');
      if (!audio) return fail(400, 'needs-clip');
      await env.DB.batch([
        env.DB.prepare("UPDATE contributions SET status = 'allowed', final_value = ?, decided_by = ?, decided_at = ?, incorporated_at = ? WHERE id = ?").bind(clip ?? row.value, who, now, now, row.id),
        putClip(audio)
      ]);
    } else {
      const final = tidy(body.value ?? row.value, LIMITS.value);
      if (!final) return fail(400, 'incomplete');
      /* crops, food, music and landmarks are on the site from this moment; a name waits for its pull request */
      await env.DB.prepare("UPDATE contributions SET status = 'allowed', final_value = ?, decided_by = ?, decided_at = ?, incorporated_at = ? WHERE id = ?")
        .bind(final, who, now, LIVE_TEXT.includes(row.kind) ? now : null, row.id).run();
    }
  } else if (action === 'clip') {
    /* Changing the part to keep of a recording that is already allowed, or putting on the site one that was
       allowed before recordings went live. No clip means the whole recording. */
    if (!me.konkani) return fail(403, 'needs-konkani-reviewer');
    if (row.kind !== 'voice' || row.status !== 'allowed') return fail(409, 'already-decided');
    const clip = clipText(body.clip), audio = clipAudio(body.audio);
    if (clip === false || audio === false) return fail(400, 'bad-clip');
    if (!audio) return fail(400, 'needs-clip');
    await env.DB.batch([
      env.DB.prepare('UPDATE contributions SET final_value = ?, incorporated_at = COALESCE(incorporated_at, ?) WHERE id = ?').bind(clip ?? row.value, now, row.id),
      putClip(audio)
    ]);
  } else if (action === 'reject') {
    if (row.status !== 'waiting') return fail(409, 'already-decided');
    await env.DB.prepare("UPDATE contributions SET status = 'rejected', reject_reason = ?, decided_by = ?, decided_at = ? WHERE id = ?").bind(tidy(body.reason, LIMITS.how) || null, who, now, row.id).run();
  } else {
    /* Remove: for a withdrawal. What the person sent (a recording and its clip too), and their name, are wiped; the
       row stays as a record that something was removed. It is off khoim.in within a few minutes. */
    await env.DB.batch([
      env.DB.prepare('DELETE FROM recordings WHERE id = ?').bind(row.id),
      env.DB.prepare('DELETE FROM clips WHERE id = ?').bind(row.id),
      env.DB.prepare("UPDATE contributions SET status = 'removed', value = '', final_value = NULL, how_known = '', credit_name = NULL, claude_note = NULL, decided_by = ?, decided_at = ? WHERE id = ?").bind(who, now, row.id)
    ]);
  }
  /* the next visitor served from this Cloudflare site gets the new list straight away; elsewhere, within a minute */
  await store()?.delete(new URL('/api/live', request.url).href).catch(() => false);
  return json({ ok: true });
}

/* ---------- What is on the site: the layers other than Names ---------- */

/* Anyone can ask for these, so Cloudflare keeps a copy of each answer for a short while: however many people
   visit, the database is asked about once a minute, which keeps the free daily allowance safe. */
const LIVE_SECONDS = 60, CLIP_SECONDS = 3600;
const store = () => (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;

interface LiveRow { id: string; place_id: string; kind: Kind; value: string; final_value: string | null; how_known: string; credit_name: string | null; seconds: number | null; made_at: string | null }

/** Everything allowed for the layers other than Names, for the whole of Goa. Small: a line or two per item.
    Only what the person agreed to make public: what they sent, their name if they gave one, and for a
    recording the village they said they are from. Never "how do you know", never the recording itself. */
async function live(request: Request, env: Env, ctx: Ctx): Promise<Response> {
  const key = new URL('/api/live', request.url).href, kept = await store()?.match(key).catch(() => undefined);
  if (kept) return kept;
  let items: unknown[] = [];
  if (env.DB) {
    await ensureSchema(env.DB);
    const rows = await env.DB.prepare(`SELECT c.id, c.place_id, c.kind, c.value, c.final_value, c.how_known, c.credit_name, k.seconds, k.made_at
      FROM contributions c LEFT JOIN clips k ON k.id = c.id
      WHERE c.status = 'allowed' AND (c.kind IN (${LIVE_TEXT.map(k => `'${k}'`).join(', ')}) OR (c.kind = 'voice' AND k.id IS NOT NULL))
      ORDER BY c.decided_at LIMIT 5000`).all<LiveRow>();
    items = rows.results.flatMap((r): unknown[] => {
      const place = PLACES.get(r.place_id);
      if (!place) return [];
      const base = { id: r.id, place: r.place_id, taluka: place.taluka, kind: r.kind, by: r.credit_name };
      if (r.kind === 'voice') return [{ ...base, from: r.how_known, seconds: r.seconds, v: Date.parse(r.made_at ?? '').toString(36) }];
      const text = r.final_value || r.value;
      return [{ ...base, text, script: scriptOf(text) }];
    });
  }
  const res = json({ ok: true, items });
  res.headers.set('cache-control', `public, max-age=${LIVE_SECONDS}`);
  const cache = store();
  if (cache) ctx.waitUntil(cache.put(key, res.clone()).catch(() => undefined));
  return res;
}

/** The clip of one allowed recording. Phones ask for a sound file in pieces ("Range"), so pieces are answered. */
async function liveAudio(request: Request, env: Env, ctx: Ctx): Promise<Response> {
  const url = new URL(request.url), id = url.searchParams.get('id') ?? '';
  const cache = store(), kept = await cache?.match(request).catch(() => undefined);
  if (kept) return kept;
  if (!env.DB || !/^[0-9a-f-]{36}$/.test(id)) return fail(404, 'not-found');
  await ensureSchema(env.DB);
  const row = await env.DB.prepare("SELECT k.mime, k.data FROM clips k JOIN contributions c ON c.id = k.id WHERE k.id = ? AND c.status = 'allowed' AND c.kind = 'voice'").bind(id).first<Pick<ClipRow, 'mime' | 'data'>>();
  if (!row) return fail(404, 'not-found');
  const bytes = bytesOf(row.data);
  const headers = { 'content-type': row.mime, 'cache-control': `public, max-age=${CLIP_SECONDS}`, 'accept-ranges': 'bytes', 'x-content-type-options': 'nosniff' };
  if (cache) ctx.waitUntil(cache.put(url.href, new Response(bytes, { headers: { ...headers, 'content-length': String(bytes.length) } })).catch(() => undefined));
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') ?? '');
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, bytes.length - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
    if (start > end) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${bytes.length}` } });
    return new Response(bytes.slice(start, end + 1), { status: 206, headers: { ...headers, 'content-range': `bytes ${start}-${end}/${bytes.length}` } });
  }
  return new Response(bytes, { headers });
}

/* ---------- The scheduled Claude job ---------- */

async function queue(request: Request, env: Env, path: string): Promise<Response> {
  if (!hasQueueKey(request, env)) return fail(401, 'no-key');
  if (!env.DB) return fail(503, 'not-open');
  await ensureSchema(env.DB);

  if (request.method === 'GET' && path === '/api/queue') {
    const p = new URL(request.url).searchParams;
    const status = STATUSES.find(s => s === p.get('status')) ?? 'waiting';
    /* unread=1: waiting items Claude has not written a note on. new=1: allowed items not yet brought into the site. */
    const extra = p.get('unread') === '1' ? ' AND claude_at IS NULL' : p.get('new') === '1' ? ' AND incorporated_at IS NULL' : '';
    const items = await env.DB.prepare(`SELECT * FROM contributions WHERE status = ?${extra} ORDER BY created_at LIMIT 200`).bind(status).all<Row>();
    return json({ ok: true, items: items.results.map(present) });
  }
  const body = request.method === 'POST' ? await readBody(request) : null;
  if (!body) return fail(400, 'bad-request');
  const now = new Date().toISOString();

  if (path === '/api/queue/note') {
    /* Claude's first read: a few plain lines and a suggestion. Advice only; the status does not change. */
    const suggestion = ['looks fine', 'needs a speaker', 'reject'].find(s => s === body.suggestion);
    const note = tidy(body.note, 1000);
    if (!suggestion || !note) return fail(400, 'incomplete');
    await env.DB.prepare("UPDATE contributions SET claude_note = ?, claude_suggestion = ?, claude_at = ? WHERE id = ? AND status = 'waiting'").bind(note, suggestion, now, String(body.id ?? '')).run();
    return json({ ok: true });
  }
  if (path === '/api/queue/incorporated') {
    /* Called after a pull request with these items has been merged. */
    const ids = Array.isArray(body.ids) ? body.ids.map(String).slice(0, 200) : [];
    for (const id of ids) await env.DB.prepare("UPDATE contributions SET incorporated_at = ? WHERE id = ? AND status = 'allowed'").bind(now, id).run();
    return json({ ok: true, marked: ids.length });
  }
  return fail(404, 'not-found');
}

/* ---------- Router ---------- */

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (pathname === '/api/config' && request.method === 'GET') {
        /* Asked once per visit. The browser may keep the answer for ten minutes, to spare the free daily allowance. */
        const res = json({ ok: true, open: ready(env), siteKey: ready(env) ? env.TURNSTILE_SITE_KEY : null });
        res.headers.set('cache-control', 'public, max-age=600');
        return res;
      }
      if (pathname === '/api/live' && request.method === 'GET') return await live(request, env, ctx);
      if (pathname === '/api/live/audio' && request.method === 'GET') return await liveAudio(request, env, ctx);
      if (pathname === '/api/contributions' && request.method === 'POST') return await contribute(request, env);
      if (pathname === '/api/admin/items' && request.method === 'GET') return await adminItems(request, env);
      if (pathname === '/api/admin/audio' && request.method === 'GET') return await adminAudio(request, env);
      if (pathname === '/api/admin/decide' && request.method === 'POST') return await adminDecide(request, env);
      if (pathname.startsWith('/api/queue')) return await queue(request, env, pathname);
      return fail(404, 'not-found');
    } catch {
      /* Nothing about the request is logged: it may hold what someone typed. */
      return fail(500, 'server-error');
    }
  }
};
