/* Talking to the server part (worker/) from the form. */

/** What people can send in stage 1. All three belong to the Names layer. */
export type ContributionKind = 'name' | 'say' | 'correction';

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
}

/** True when the server has stored it. */
export async function sendContribution(c: Contribution): Promise<boolean> {
  try {
    const r = await fetch('/api/contributions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(c) });
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
