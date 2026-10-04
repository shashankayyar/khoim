/* What reviewers have allowed for the layers other than Names: recordings, crops, food, music, landmarks.
   Asked for once per visit from the server part (worker/, "/api/live"). These show on khoim.in within a few
   minutes of being allowed; names still come in through a pull request.

   If the answer does not come (no connection, the server part not set up), the site is exactly as it is
   without it: the cards show their names and "No recordings yet." */
import { LAYERS, getPlace } from '../data/khoim';
import type { Layer, Recording } from '../data/types';

export type LiveKind = 'voice' | 'crops' | 'food' | 'music' | 'landmarks';

export interface LiveItem {
  id: string;
  /** The place it is about: a district, a taluka or a village. */
  place: string;
  /** For a village: its taluka. */
  taluka: string | null;
  kind: LiveKind;
  /** The contributor's name, if they gave one. */
  by: string | null;
  /** Typed things: what was allowed, and the script it is in. */
  text?: string;
  script?: 'deva' | 'latin' | 'mixed' | 'other';
  /** Recordings: where the speaker is from, how long the clip is, and a stamp that changes when the clip does. */
  from?: string;
  seconds?: number;
  v?: string;
}

/** Which kind of thing each layer shows. Names has none: its data is part of the site itself. */
const KIND_OF: Record<string, LiveKind> = { voices: 'voice', crops: 'crops', food: 'food', music: 'music', landmarks: 'landmarks' };
export const kindOfLayer = (layerId: string): LiveKind | null => KIND_OF[layerId] ?? null;
/** The layers whose content comes from contributions, in roadmap order. */
export const LIVE_LAYERS: Layer[] = LAYERS.filter(l => KIND_OF[l.id]);
/** The layers shown on the card as a list of notes (everything but recordings). */
export const NOTE_LAYERS: Layer[] = LIVE_LAYERS.filter(l => l.id !== 'voices');

export interface Live {
  /** What was sent about this very place. */
  at: (placeId: string | null | undefined) => LiveItem[];
  /** For one layer: how many things each place holds, counting the places inside it. */
  marks: (layerId: string) => Record<string, number>;
  /** For one layer: how many things there are in all of Goa. */
  total: (layerId: string) => number;
}

const NONE: LiveItem[] = [];
export const NO_LIVE: Live = { at: () => NONE, marks: () => ({}), total: () => 0 };

function build(items: LiveItem[]): Live {
  const byPlace = new Map<string, LiveItem[]>();
  const marks: Record<string, Record<string, number>> = {}, totals: Record<string, number> = {};
  for (const it of items) {
    byPlace.set(it.place, [...(byPlace.get(it.place) ?? []), it]);
    /* the place itself, then the taluka and the district it is in */
    const up = [it.place];
    for (let p = getPlace(it.taluka ?? getPlace(it.place)?.parent); p && p.level !== 'state'; p = getPlace(p.parent)) up.push(p.id);
    const m = (marks[it.kind] ??= {});
    for (const id of up) m[id] = (m[id] ?? 0) + 1;
    totals[it.kind] = (totals[it.kind] ?? 0) + 1;
  }
  const kind = (layerId: string) => KIND_OF[layerId] ?? '';
  return { at: id => (id && byPlace.get(id)) || NONE, marks: l => marks[kind(l)] ?? {}, total: l => totals[kind(l)] ?? 0 };
}

const KINDS = new Set<string>(Object.values(KIND_OF));
const usable = (it: Partial<LiveItem>): it is LiveItem =>
  !!it && typeof it.id === 'string' && typeof it.place === 'string' && KINDS.has(String(it.kind)) && (it.kind === 'voice' ? typeof it.from === 'string' : typeof it.text === 'string' && !!it.text);

let asked: Promise<Live | null> | null = null;
/** Null when the answer did not come: nothing is known, which is not the same as "nothing yet". */
export function loadLive(): Promise<Live | null> {
  asked ??= fetch('/api/live', { headers: { accept: 'application/json' } })
    .then(r => (r.ok ? r.json() : null))
    .then((d: { ok?: boolean; items?: Partial<LiveItem>[] } | null) => (d && d.ok && Array.isArray(d.items) ? build(d.items.filter(usable)) : null))
    .catch(() => null);
  return asked;
}

const length = (seconds: number | undefined) => (seconds ? '0:' + String(Math.max(1, Math.round(seconds))).padStart(2, '0') : undefined);

/** The recordings among a place's items, as the card's player wants them: credited by name and village, or as
    "A speaker from" the village when no name was given (the wording the speaker agreed to). */
export function recordingsOf(items: LiveItem[]): Recording[] {
  return items.filter(i => i.kind === 'voice').map(i => ({
    speaker: i.by || 'A speaker from ' + i.from,
    village: i.by ? i.from ?? '' : '',
    src: '/api/live/audio?id=' + encodeURIComponent(i.id) + (i.v ? '&v=' + encodeURIComponent(i.v) : ''),
    duration: length(i.seconds)
  }));
}
