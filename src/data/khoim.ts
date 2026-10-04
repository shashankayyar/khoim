/* Khoim data: one place for names, fallbacks, search, spoken labels and page addresses.
   Ported from design/components/data/khoim.js. The JSON it reads is written by scripts/build-data.mjs. */
import placesJson from './generated/places.json';
import type { House, HouseKey, Layer, NameForm, Place, RawVillage, Script, SearchHit, Status } from './types';

export { SITE, CONTACT_EMAIL } from './site';

/** Goa, the 3 districts and the 12 talukas. Always available. */
export const PLACES = placesJson as unknown as Place[];

const byId = new Map<string, Place>(PLACES.map(p => [p.id, p]));
const houseOfId = (id: string): HouseKey => byId.get(id)?.house ?? 'neel';

/* ---------- Villages: loaded after the first screen, because search and the taluka view need them but the Goa view does not ---------- */

let villages: Place[] = [];
let villagesLoaded = false;
let loading: Promise<void> | null = null;

function toPlace(v: RawVillage): Place {
  return {
    id: v.id,
    level: 'village',
    parent: v.t,
    lgd: v.lgd,
    official: v.n,
    deva: v.deva ?? null,
    romi: v.romi ?? null,
    say: v.say ?? null,
    /* a name in either script, signed by a reviewer */
    status: v.deva || v.romi ? 'reviewed' : 'pending',
    house: houseOfId(v.t),
    reviewed: !!v.reviewer,
    slug: v.slug,
    town: !!v.town,
    boundarySource: v.src ?? null,
    lp: v.lp ?? null,
    reviewer: v.reviewer,
    reviewedOn: v.reviewedOn,
    contributor: v.by
  };
}

export function registerVillages(raw: RawVillage[]): void {
  if (villagesLoaded) return;
  villages = raw.map(toPlace);
  for (const v of villages) byId.set(v.id, v);
  villagesLoaded = true;
}

/** Makes one village known before the full list arrives: the one a village page opens on. */
export function registerVillage(raw: RawVillage): void {
  if (!byId.has(raw.id)) byId.set(raw.id, toPlace(raw));
}

export function villagesReady(): boolean { return villagesLoaded; }

/** Fetches the village list once. Safe to call many times. */
export function loadVillages(): Promise<void> {
  if (villagesLoaded) return Promise.resolve();
  loading ??= import('./generated/villages.json').then(m => registerVillages(m.default as unknown as RawVillage[]));
  return loading;
}

/* ---------- Lookups ---------- */

export function getPlace(id: string | null | undefined): Place | null {
  return (id && byId.get(id)) || null;
}

/** What the strip and the map show inside a place. For a taluka: the villages that have an outline. */
export function childrenOf(id: string | null | undefined): Place[] {
  if (!id || id === 'goa') return PLACES.filter(p => p.level === 'district');
  const p = byId.get(id);
  if (!p) return [];
  if (p.level === 'district') return PLACES.filter(x => x.parent === id && x.level === 'taluka');
  if (p.level === 'taluka') return villages.filter(v => v.parent === id && v.boundarySource).sort((a, b) => a.official.localeCompare(b.official));
  return [];
}

/** Every village filed under a taluka, with or without an outline. */
export function allVillagesOf(talukaId: string): Place[] {
  return villages.filter(v => v.parent === talukaId).sort((a, b) => a.official.localeCompare(b.official));
}

export function allVillages(): Place[] { return villages; }

/** How many places are inside, without needing the village list. */
export function childCount(p: Place): number {
  if (p.level === 'taluka') return p.villageCount ?? 0;
  if (p.level === 'village') return 0;
  return childrenOf(p.id).length;
}

/** Goa first, the place last. */
export function trailOf(id: string | null | undefined): Place[] {
  const out: Place[] = [];
  let p = getPlace(id);
  while (p) { out.unshift(p); p = p.parent ? getPlace(p.parent) : null; }
  const goa = byId.get('goa')!;
  if (!out.length || out[0].id !== 'goa') out.unshift(goa);
  return out;
}

const LEVEL_LABEL = { state: 'State', district: 'District', taluka: 'Taluka', village: 'Village' } as const;
export function levelLabel(p: Place | null): string { return p ? LEVEL_LABEL[p.level] : ''; }

export function whereLabel(p: Place | null): string {
  if (!p) return '';
  const par = p.parent && p.parent !== 'goa' ? getPlace(p.parent) : null;
  return levelLabel(p) + (par ? ' in ' + par.official : '');
}

/** The name in the chosen script. A missing form falls back to the official spelling. Never invents one. */
export function nameIn(p: Place | null, script: Script): NameForm {
  if (!p) return { text: '', kind: 'official', fallback: false };
  if (script === 'deva') return p.deva ? { text: p.deva, kind: 'deva', fallback: false } : { text: p.official, kind: 'official', fallback: true };
  if (script === 'romi') return p.romi ? { text: p.romi, kind: 'romi', fallback: false } : { text: p.official, kind: 'official', fallback: true };
  return { text: p.official, kind: 'official', fallback: false };
}

/* "reviewed": a village name that came from a contributor and was allowed by a Konkani reviewer. The words are
   the ones the say-it note already uses (settled 4 October 2026, in docs/copy.md). */
export const STATUS_TEXT: Record<Status, string> = { agree: 'Sources agree', differ: 'Sources differ', pending: 'Official name only', reviewed: 'Checked by a speaker' };

/** One sentence for screen readers: "Canacona. Konkani काणकोण, Romi Kannkonn. Taluka in Kushavati. Sources agree." */
export function spokenName(p: Place | null): string {
  if (!p) return '';
  const bits = [p.official + '.'];
  if (p.deva) bits.push('Konkani ' + p.deva + (p.romi ? ', Romi ' + p.romi : '') + '.');
  else if (p.romi) bits.push('Romi ' + p.romi + '.');
  bits.push(whereLabel(p) + '.');
  if (STATUS_TEXT[p.status]) bits.push(STATUS_TEXT[p.status] + '.');
  return bits.join(' ');
}

export function houseOf(p: Place | null): House {
  const k: HouseKey = p ? p.house : 'neel';
  return { key: k, bg: `var(--house-${k})`, on: `var(--house-${k}-on)`, dim: `var(--map-${k}-dim)` };
}

/** "KAAN-kon" becomes two beats, the first stressed. Stressed = written in capitals in the data. */
export function sayParts(say: string | null | undefined): { text: string; stressed: boolean }[] {
  return say ? say.split(/-|\s+/).filter(Boolean).map(s => ({ text: s, stressed: s === s.toUpperCase() && /[A-Z]/.test(s) })) : [];
}

/* ---------- Search ---------- */

/** Latin is folded to strip accents (ã = a). Devanagari matches as typed. */
export function fold(s: string | null | undefined): string {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
}

/** Prefix before substring, districts and talukas before villages. Villages are included once loaded. */
export function searchPlaces(q: string, limit = Infinity): SearchHit[] {
  const f = fold(q.trim());
  if (!f) return [];
  const res: SearchHit[] = [];
  for (const p of PLACES.concat(villages)) {
    const fields: [SearchHit['field'], string | null | undefined][] = [
      ['deva', p.deva], ['romi', p.romi], ['official', p.official],
      ['alsoWritten', p.alsoWritten && p.alsoWritten.join(' ')], ['marathi', p.marathi]
    ];
    let hit: SearchHit['field'] | null = null, rank = 9;
    for (const [k, v] of fields) {
      if (!v) continue;
      const i = fold(v).indexOf(f);
      if (i >= 0) { const r = (i === 0 ? 0 : 1) + (p.level === 'village' ? 2 : 0); if (r < rank) { rank = r; hit = k; } }
    }
    if (hit) res.push({ place: p, field: hit, rank });
  }
  res.sort((a, b) => a.rank - b.rank || a.place.official.localeCompare(b.place.official));
  return limit === Infinity ? res : res.slice(0, limit);
}

/* ---------- Page addresses ---------- */

/** "/", "/south-goa/", "/south-goa/salcete/", "/south-goa/salcete/raia/" */
export function pathOf(p: Place | null): string {
  if (!p || p.level === 'state') return '/';
  return '/' + trailOf(p.id).slice(1).map(x => x.slug).join('/') + '/';
}

/** The place a page address points to, or null. Village addresses need the village list. */
export function placeAtPath(pathname: string): Place | null {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return byId.get('goa')!;
  if (parts.length > 3) return null;
  const district = byId.get(parts[0]);
  if (!district || district.level !== 'district') return null;
  if (parts.length === 1) return district;
  const taluka = byId.get(parts[1]);
  if (!taluka || taluka.level !== 'taluka' || taluka.parent !== district.id) return null;
  if (parts.length === 2) return taluka;
  return villages.find(v => v.parent === taluka.id && v.slug === parts[2]) ?? null;
}

/* ---------- Layers ---------- */

/** Khoim's layers. Names is part of the site itself. The others fill in from what people send and a reviewer
    allows (src/lib/live.ts): live since 4 October 2026. */
export const LAYERS: Layer[] = [
  { id: 'names', label: 'Names', icon: 'languages', status: 'live', note: 'Districts and talukas now. Village names in Konkani next.' },
  { id: 'voices', label: 'Voices', icon: 'mic', status: 'live', note: 'People from each taluka saying the names of the places near them.' },
  { id: 'crops', label: 'Crops', icon: 'wheat', status: 'live', note: 'Khazan paddy, cashew, coconut and areca, on the villages that grow them.' },
  { id: 'food', label: 'Food', icon: 'soup', status: 'live', note: 'Dishes tied to one village or feast, under their Konkani names.' },
  { id: 'music', label: 'Music', icon: 'music', status: 'live', note: 'Where mando, dulpod, deknni and fugdi are sung and danced.' },
  { id: 'landmarks', label: 'Landmarks', icon: 'landmark', status: 'live', note: 'Temples, churches, mosques and springs, by the names people nearby call them.' }
];
