/* The pieces of Cloudflare this Worker uses, described just enough to type-check without extra packages. */

export interface D1Result<T = Record<string, unknown>> { results: T[]; success: boolean }
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
export interface D1 {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<D1Result[]>;
}

export interface Env {
  /** The built site (dist/). */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** The queue. Missing until the database exists; the form then stays switched off. */
  DB?: D1;
  /** Bot check. The site key is public; the secret is kept in Cloudflare's settings. */
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET?: string;
  /** Lets the scheduled Claude job read the queue and add its notes. Kept in Cloudflare's settings. */
  QUEUE_KEY?: string;
  /** Cloudflare Access: the team name (the part before .cloudflareaccess.com) and the application's audience tag. */
  ACCESS_TEAM?: string;
  ACCESS_AUD?: string;
  /** Who may review, and who reads Konkani. Kept in Cloudflare's settings because it holds email addresses. */
  REVIEWERS?: string;
  /** Local testing only. */
  DEV_ADMIN?: string;
}

/** Lets work carry on after the answer has been sent (here: keeping a copy of a public answer). */
export interface Ctx { waitUntil(promise: Promise<unknown>): void }

export interface Reviewer { email: string; name: string; konkani: boolean }

/** What people can send. The first three belong to the Names layer and reach the site through a pull request.
    The rest belong to the other layers and show on khoim.in as soon as a reviewer allows them.
    "voice" comes with a recording. */
export type Kind = 'name' | 'say' | 'correction' | 'voice' | 'crops' | 'food' | 'music' | 'landmarks';
export type Status = 'waiting' | 'allowed' | 'rejected' | 'removed';

export interface Row {
  id: string;
  created_at: string;
  place_id: string;
  place_official: string;
  place_where: string;
  place_lgd: string | null;
  kind: Kind;
  value: string;
  how_known: string;
  credit_name: string | null;
  script: string;
  flags: string;
  repeats: number;
  claude_note: string | null;
  claude_suggestion: string | null;
  claude_at: string | null;
  status: Status;
  final_value: string | null;
  decided_by: string | null;
  decided_at: string | null;
  reject_reason: string | null;
  incorporated_at: string | null;
}

/** A recording, kept apart from its contribution so that lists stay small. `data` is base64. */
export interface AudioRow { id: string; mime: string; seconds: number; data: string }

/** The part of an allowed recording that plays on khoim.in: cut by the reviewer's browser, a WAV file as base64.
    The recording it was cut from stays whole in `recordings`. */
export interface ClipRow { id: string; mime: string; seconds: number; made_at: string; data: string }
