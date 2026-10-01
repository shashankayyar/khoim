export type Level = 'state' | 'district' | 'taluka' | 'village';
/** pending = official name only; no reliable Konkani name yet. reviewed = a village name signed off by a reviewer (none yet). */
export type Status = 'agree' | 'differ' | 'pending' | 'reviewed';
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

/** Future recordings. Always credited by name and village. */
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
