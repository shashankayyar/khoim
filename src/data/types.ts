export type Level = 'state' | 'district' | 'taluka' | 'village';
/** pending = official name only; no reliable Konkani name yet. reviewed = a village name signed off by a reviewer.
    review = a Konkani form exists in a source (the Gazetteer) but nobody has checked it; village sheet only. */
export type Status = 'agree' | 'differ' | 'pending' | 'reviewed' | 'review';
export type Script = 'official' | 'deva' | 'romi';
export type HouseKey = 'haldi' | 'kokum' | 'rose' | 'green' | 'oxide' | 'lilac' | 'sky' | 'neel' | 'mustard';
export type Point = [number, number];
/** [x0, y0, x1, y1] on the 1000 x 1419.2 map plane. */
export type Box = [number, number, number, number];

export interface Place {
  id: string;
  level: Level;
  parent: string | null;
  /** LGD code. Null for outlines that are not in the LGD list. */
  lgd: string | null;
  official: string;
  deva: string | null;
  romi: string | null;
  /** Say-it guide. Stressed syllable in capitals. */
  say: string | null;
  sayNote?: string | null;
  status: Status;
  house: HouseKey;
  /** False until a Konkani speaker signs off the say-it guide. */
  reviewed: boolean;
  alsoWritten?: string[];
  marathi?: string;
  officialNote?: string;
  sourceNote?: string;
  pendingNote?: string;
  hq?: string;
  facts?: string[];
  sources?: string;
  /** Last part of the page address. Empty for Goa. */
  slug: string;
  /** Talukas: villages drawn on the map inside it. */
  villageCount?: number;

  /* Villages only */
  town?: boolean;
  /** Where the outline comes from. Null when there is no outline yet. */
  boundarySource?: 'LGD' | 'SOI' | null;
  /** Label point on the map. Null when there is no outline yet. */
  lp?: Point | null;
  reviewer?: string;
  reviewedOn?: string;
  /** Who sent the name in, if they gave their name for credit. */
  contributor?: string;
  /** Straight-line km to Panaji and to Margao from the label point. Null for the town itself; missing without an outline. */
  km?: [number | null, number | null];
}

/** A village as written by scripts/build-data.mjs (short keys, to keep the file small). */
export interface RawVillage {
  id: string;
  t: string;
  n: string;
  lgd: string | null;
  slug: string;
  town?: boolean;
  src?: 'LGD' | 'SOI';
  lp?: Point;
  deva?: string;
  romi?: string;
  say?: string;
  reviewer?: string;
  reviewedOn?: string;
  /** Who sent the name in, if they gave their name for credit. */
  by?: string;
  /** Straight-line km to Panaji and to Margao. */
  km?: [number | null, number | null];
}

/* ---------- Phase 2: what a village's sheet shows beyond its names (scripts/village-facts.mjs) ---------- */

/** A feast date as a rule: a fixed day, the nth Saturday after Easter, or a lunar date (months only, never a day). */
export type FeastWhen = { month: number; day: number } | { easterSaturday: number } | { lunar: true; months: number[] };
export interface Reading { text: string; hedge: string | null; credit: string; url: string | null }
export interface KnownForItem {
  kind: 'parish' | 'zatra' | 'festival' | 'gi' | 'monument';
  icon: string;
  title: string;
  detail?: string | null;
  when?: FeastWhen;
  whenText?: string;
  source: string;
  url: string | null;
}
export interface Spelling { form: string; source: string; lang?: string; note?: string }
export interface VillageFacts {
  meaning?: { differ: boolean; readings: Reading[] };
  vaddos?: { source: string; url: string | null; items: string[] };
  knownFor?: KnownForItem[];
  spellings?: { items: Spelling[]; page: string | null };
  /** Videos about the village, credited to the channel. The still is kept on khoim.in: /video-thumbs/{id}.jpg. */
  videos?: { id: string; title: string; channel: string; channelUrl: string; url: string; uploaded: string }[];
  /** The Gazetteer's Devanagari, 1979. Unreviewed: shown on the village sheet only, labelled (phase 2 rule 6). */
  gazetteerDeva?: string;
  sources: { title: string; url: string | null }[];
}

export interface TalukaShape {
  district: string;
  d: string;
  b: Box;
  lp: Point;
  /** Box to zoom to inside the taluka, when some of its villages are drawn outside its outline. */
  view?: Box;
}
export interface DistrictShape { d: string; b: Box; lp: Point }
export interface GeoBase {
  size: Point;
  districts: Record<string, DistrictShape>;
  talukas: Record<string, TalukaShape>;
}

/** A recording of a place's name. Credited by name and village, or as "A speaker from" the village (then `village` is empty). */
export interface Recording { speaker: string; village: string; src: string; duration?: string }

export interface Layer {
  id: string;
  label: string;
  icon: 'languages' | 'mic' | 'wheat' | 'soup' | 'music' | 'landmark';
  status: 'live' | 'next' | 'planned';
  note: string;
}

export interface NameForm { text: string; kind: Script; fallback: boolean }
export interface House { key: HouseKey; bg: string; on: string; dim: string }
export interface SearchHit { place: Place; field: 'deva' | 'romi' | 'official' | 'alsoWritten' | 'marathi'; rank: number }

/** Written by scripts/pages.mjs: which pages search engines may index, and the day each page's data last changed. */
export interface PageIndex {
  places: Record<string, {
    index: boolean;
    lastmod: string | null;
    /** [latitude, longitude] of the label point inside the place's outline. */
    geo?: [number, number];
    /** Wikidata item, for Goa, the districts and the talukas. */
    qid?: string;
  }>;
  other: Record<string, string | null>;
}
