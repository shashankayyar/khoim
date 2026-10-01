/* Who is allowed into the admin page.

   On khoim.in the admin page sits behind Cloudflare Access: a person types their email, gets a one-time code,
   and Cloudflare adds a signed pass (a JWT) to every request. This file checks that pass. It is checked here,
   not just at Cloudflare's door, because the same Worker also answers on its workers.dev address, where
   there is no door. Without a valid pass the answer is always no. */
import type { Env, Reviewer } from './types';

interface Jwk { kid: string; kty: string; n: string; e: string; alg?: string }

let certs: { at: number; team: string; keys: Jwk[] } | null = null;

const b64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));

async function keysFor(team: string): Promise<Jwk[]> {
  if (certs && certs.team === team && Date.now() - certs.at < 3600_000) return certs.keys;
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('could not fetch Access keys');
  const data = await res.json() as { keys: Jwk[] };
  certs = { at: Date.now(), team, keys: data.keys };
  return data.keys;
}

/** The email on a valid Access pass, or null. */
async function emailFromAccess(request: Request, env: Env): Promise<string | null> {
  const team = env.ACCESS_TEAM, aud = env.ACCESS_AUD;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!team || !aud || !token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(new TextDecoder().decode(b64url(parts[0]))) as { kid: string; alg: string };
    const payload = JSON.parse(new TextDecoder().decode(b64url(parts[1]))) as { aud: string | string[]; exp: number; iss: string; email?: string };
    if (header.alg !== 'RS256') return null;
    const jwk = (await keysFor(team)).find(k => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!ok) return null;
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(aud)) return null;
    if (payload.iss !== `https://${team}.cloudflareaccess.com`) return null;
    if (!payload.exp || payload.exp * 1000 < Date.now()) return null;
    return payload.email ? payload.email.toLowerCase() : null;
  } catch {
    return null;
  }
}

/* REVIEWERS is set in Cloudflare's settings, never in the code, because it holds email addresses:
     amit@example.com | Amit Naik | konkani ; priya@example.com | Priya D'Souza
   Someone marked "konkani" may allow names and say-it guides. Anyone else on the list is a helper:
   they can reject spam and remove things, but cannot allow a name. */
function reviewers(env: Env): Reviewer[] {
  return (env.REVIEWERS || '').split(';').map(row => row.split('|').map(s => s.trim())).filter(r => r[0])
    .map(([email, name, role]) => ({ email: email.toLowerCase(), name: name || email.split('@')[0], konkani: (role || '').toLowerCase() === 'konkani' }));
}

/** The reviewer making this request, or null if they are not signed in or not on the list. */
export async function reviewerFor(request: Request, env: Env): Promise<Reviewer | null> {
  const host = new URL(request.url).hostname;
  /* Local testing only: wrangler dev on this computer, with DEV_ADMIN set in .dev.vars. */
  if (env.DEV_ADMIN && (host === 'localhost' || host === '127.0.0.1')) return { email: 'dev@localhost', name: env.DEV_ADMIN, konkani: true };
  const email = await emailFromAccess(request, env);
  if (!email) return null;
  return reviewers(env).find(r => r.email === email) ?? null;
}

/** The scheduled Claude job proves itself with a key kept in Cloudflare's settings. */
export function hasQueueKey(request: Request, env: Env): boolean {
  const key = env.QUEUE_KEY, given = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!key || key.length < 24 || given.length !== key.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
