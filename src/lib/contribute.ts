/* Talking to the server part (worker/) from the form. */

/** What people can send. The first three belong to the Names layer. The rest are for layers that are not on
    the map yet: they are collected now, checked, and kept for when each layer opens. */
export type ContributionKind = 'name' | 'say' | 'correction' | 'voice' | 'crops' | 'food' | 'music' | 'landmarks';

/** A recording made in the form. At most ten seconds. */
export interface Recorded { blob: Blob; mime: string; seconds: number }

export interface ContribConfig {
  /** False until the database and the bot check are set up. The cards then keep their email buttons. */
  open: boolean;
  /** Public key for the bot check widget. */
  siteKey: string | null;
}

const CLOSED: ContribConfig = { open: false, siteKey: null };
let config: Promise<ContribConfig> | null = null;

/** Asks the server once whether contributions are open. Any failure counts as "not open". */
export function loadContribConfig(): Promise<ContribConfig> {
  config ??= fetch('/api/config', { headers: { accept: 'application/json' } })
    .then(r => (r.ok ? r.json() : CLOSED))
    .then((c: Partial<ContribConfig>) => (c && c.open && c.siteKey ? { open: true, siteKey: c.siteKey } : CLOSED))
    .catch(() => CLOSED);
  return config;
}

export interface Contribution {
  placeId: string;
  kind: ContributionKind;
  value: string;
  how: string;
  name: string;
  consent: boolean;
  /** From the bot check. */
  token: string;
  /** For kind "voice". */
  recording?: Recorded | null;
}

const toBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
  r.onerror = () => reject(r.error);
  r.readAsDataURL(blob);
});

/** True when the server has stored it. */
export async function sendContribution(c: Contribution): Promise<boolean> {
  try {
    const { recording, ...rest } = c;
    const audio = recording ? { mime: recording.mime, seconds: recording.seconds, data: await toBase64(recording.blob) } : undefined;
    const r = await fetch('/api/contributions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...rest, audio }) });
    return r.ok && (await r.json()).ok === true;
  } catch {
    return false;
  }
}

/* ---------- The bot check (Cloudflare Turnstile). Its script is fetched only when the form opens. ---------- */

interface Turnstile {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(id?: string): void;
  remove(id?: string): void;
}
declare global { interface Window { turnstile?: Turnstile } }

let script: Promise<Turnstile> | null = null;
export function loadTurnstile(): Promise<Turnstile> {
  script ??= new Promise<Turnstile>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('bot check did not load')));
    s.onerror = () => { script = null; reject(new Error('bot check did not load')); };
    document.head.appendChild(s);
  });
  return script;
}
