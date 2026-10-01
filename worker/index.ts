/* The small server part of Khoim. It runs only for addresses that start with /api/. Every page, the map and
   the fonts are plain files served without it.

   What it does:
   - takes contributions from the form on a place's card, runs automatic checks, and puts them in a queue
   - lets the scheduled Claude job read the queue and attach a note to each item (it cannot decide anything)
   - lets a signed-in reviewer allow, reject or remove an item

   What it never does: change a name on the site. An allowed item reaches khoim.in only through a pull request. */
import placesJson from '../src/data/generated/places.json';
import villagesJson from '../src/data/generated/villages.json';
import { hasQueueKey, reviewerFor } from './access';
import type { D1, Env, Kind, Row, Status } from './types';

/* ---------- Places: a contribution must be about a place that exists ---------- */

interface KnownPlace { official: string; where: string; lgd: string | null }
const PLACES = new Map<string, KnownPlace>();
{
  const named = placesJson as unknown as { id: string; level: string; parent: string | null; official: string; lgd: string | null }[];
  const officialOf = new Map(named.map(p => [p.id, p.official]));
  const label: Record<string, string> = { state: 'State', district: 'District', taluka: 'Taluka' };
  for (const p of named) PLACES.set(p.id, { official: p.official, lgd: p.lgd, where: label[p.level] + (p.parent && p.parent !== 'goa' ? ' in ' + officialOf.get(p.parent) : '') });
  for (const v of villagesJson as unknown as { id: string; t: string; n: string; lgd: string | null }[]) PLACES.set(v.id, { official: v.n, lgd: v.lgd, where: 'Village in ' + officialOf.get(v.t) });
}

const KINDS: Kind[] = ['name', 'say', 'correction'];
const STATUSES: Status[] = ['waiting', 'allowed', 'rejected', 'removed'];
const LIMITS = { value: 200, how: 500, name: 80, body: 10_000, waiting: 2000 };
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
    db.prepare('CREATE INDEX IF NOT EXISTS contributions_status ON contributions (status, created_at)')
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

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > LIMITS.body) return null;
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
  const body = await readBody(request);
  if (!body) return fail(400, 'bad-request');

  const place = PLACES.get(String(body.placeId ?? ''));
  const kind = KINDS.find(k => k === body.kind);
  const value = tidy(body.value, LIMITS.value), how = tidy(body.how, LIMITS.how), name = tidy(body.name, LIMITS.name);
  if (!place || !kind || !value || !how || body.consent !== true) return fail(400, 'incomplete');
  if (!(await turnstileOk(String(body.token ?? ''), env))) return fail(403, 'bot-check');

  await ensureSchema(env.DB);
  /* The same thing sent again for the same place is counted, not stored twice. */
  const same = await env.DB.prepare("SELECT id FROM contributions WHERE place_id = ? AND kind = ? AND value = ? AND status = 'waiting'").bind(String(body.placeId), kind, value).first<{ id: string }>();
  if (same) {
    await env.DB.prepare('UPDATE contributions SET repeats = repeats + 1 WHERE id = ?').bind(same.id).run();
    return json({ ok: true });
  }
  const waiting = await env.DB.prepare("SELECT COUNT(*) AS n FROM contributions WHERE status = 'waiting'").first<{ n: number }>();
  if ((waiting?.n ?? 0) >= LIMITS.waiting) return fail(503, 'queue-full');

  await env.DB.prepare(`INSERT INTO contributions (id, created_at, place_id, place_official, place_where, place_lgd, kind, value, how_known, credit_name, script, flags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), new Date().toISOString(), String(body.placeId), place.official, place.where, place.lgd, kind, value, how, name || null, scriptOf(value), JSON.stringify(flagsFor(kind, value, how, place)))
    .run();
  return json({ ok: true });
}

/* ---------- The admin page ---------- */

const present = (r: Row) => ({ ...r, flags: JSON.parse(r.flags || '[]') as string[] });

async function adminItems(request: Request, env: Env): Promise<Response> {
  const me = await reviewerFor(request, env);
  if (!me) return fail(401, 'not-signed-in');
  if (!env.DB) return fail(503, 'not-open');
  await ensureSchema(env.DB);
  /* The privacy notice promises that contributions we do not use are deleted within 90 days. */
  const cutoff = new Date(Date.now() - KEEP_UNUSED_DAYS * 86_400_000).toISOString();
  await env.DB.prepare("DELETE FROM contributions WHERE status IN ('rejected', 'removed') AND decided_at < ?").bind(cutoff).run();
  const status = STATUSES.find(s => s === new URL(request.url).searchParams.get('status')) ?? 'waiting';
  const items = await env.DB.prepare('SELECT * FROM contributions WHERE status = ? ORDER BY created_at DESC LIMIT 200').bind(status).all<Row>();
  const counts = await env.DB.prepare('SELECT status, COUNT(*) AS n FROM contributions GROUP BY status').all<{ status: Status; n: number }>();
  return json({ ok: true, me: { name: me.name, konkani: me.konkani }, counts: Object.fromEntries(counts.results.map(c => [c.status, c.n])), items: items.results.map(present) });
}

async function adminDecide(request: Request, env: Env): Promise<Response> {
  const me = await reviewerFor(request, env);
  if (!me) return fail(401, 'not-signed-in');
  if (!env.DB) return fail(503, 'not-open');
  if (!sameSite(request)) return fail(403, 'wrong-site');
  const body = await readBody(request);
  const action = body && ['allow', 'reject', 'remove'].find(a => a === body.action);
  if (!body || !action) return fail(400, 'bad-request');
  await ensureSchema(env.DB);
  const row = await env.DB.prepare('SELECT * FROM contributions WHERE id = ?').bind(String(body.id ?? '')).first<Row>();
  if (!row) return fail(404, 'not-found');
  const now = new Date().toISOString(), who = `${me.name} <${me.email}>`;

  if (action === 'allow') {
    /* Only someone who reads Konkani may allow a name, a say-it guide or a correction to one. */
    if (!me.konkani) return fail(403, 'needs-konkani-reviewer');
    if (row.status !== 'waiting') return fail(409, 'already-decided');
    const final = tidy(body.value ?? row.value, LIMITS.value);
    if (!final) return fail(400, 'incomplete');
    await env.DB.prepare("UPDATE contributions SET status = 'allowed', final_value = ?, decided_by = ?, decided_at = ? WHERE id = ?").bind(final, who, now, row.id).run();
  } else if (action === 'reject') {
    if (row.status !== 'waiting') return fail(409, 'already-decided');
    await env.DB.prepare("UPDATE contributions SET status = 'rejected', reject_reason = ?, decided_by = ?, decided_at = ? WHERE id = ?").bind(tidy(body.reason, LIMITS.how) || null, who, now, row.id).run();
  } else {
    /* Remove: for a withdrawal. What the person sent, and their name, are wiped; the row stays as a record that something was removed. */
    await env.DB.prepare("UPDATE contributions SET status = 'removed', value = '', final_value = NULL, how_known = '', credit_name = NULL, claude_note = NULL, decided_by = ?, decided_at = ? WHERE id = ?").bind(who, now, row.id).run();
  }
  return json({ ok: true });
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
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (!pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (pathname === '/api/config' && request.method === 'GET') {
        /* Asked once per visit. The browser may keep the answer for ten minutes, to spare the free daily allowance. */
        const res = json({ ok: true, open: ready(env), siteKey: ready(env) ? env.TURNSTILE_SITE_KEY : null });
        res.headers.set('cache-control', 'public, max-age=600');
        return res;
      }
      if (pathname === '/api/contributions' && request.method === 'POST') return await contribute(request, env);
      if (pathname === '/api/admin/items' && request.method === 'GET') return await adminItems(request, env);
      if (pathname === '/api/admin/decide' && request.method === 'POST') return await adminDecide(request, env);
      if (pathname.startsWith('/api/queue')) return await queue(request, env, pathname);
      return fail(404, 'not-found');
    } catch {
      /* Nothing about the request is logged: it may hold what someone typed. */
      return fail(500, 'server-error');
    }
  }
};
