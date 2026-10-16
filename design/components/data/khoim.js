import { PLACES, HOUSE_OF } from './places.js';
import { VILLAGES, TALUKA_SHAPES, DISTRICT_SHAPES } from './goaGeo.js';
import { VILLAGE_FACTS, UNMATCHED, EXTRA_VILLAGES, LINES, CENSUS, KM_PER_UNIT } from './villageFacts.js';
import { NEIGHBOURS } from './neighbours.js';

/* Khoim site identity. खंय confirmed by the team, 30 Sept 2026. */
export const SITE = { romi: 'Khoim', deva: 'खंय', meaning: 'Where' };

const byId = {};
PLACES.forEach(p => { byId[p.id] = p; });
const villagePlaces = VILLAGES.map(v => ({
  id: 'v' + v.id, level: 'village', parent: v.t, lgd: /^n/.test(v.id) ? null : v.id.split('-')[0],
  official: v.n, deva: null, romi: null, say: null, status: 'pending', house: HOUSE_OF[v.t], town: !!v.town, boundarySource: v.src, lp: v.lp
}));
villagePlaces.forEach(p => {
  byId[p.id] = p;
  const f = VILLAGE_FACTS[p.id];
  if (f) { p.facts2 = f; if (f.deva) { p.devaSource = f.devaSource; if (f.devaReviewed) { p.deva = f.deva; p.status = 'agree'; } else { p.devaUnreviewed = f.deva; p.status = 'review'; } } }
  p.census = CENSUS[p.id] || null;
});
/* RULE: p.deva and p.romi hold reviewed names only. Unreviewed forms live in p.devaUnreviewed and appear only inside the village sheet's name block, labelled "Needs review". */
EXTRA_VILLAGES.forEach(x => { const p = { id: x.id, level: 'village', parent: x.taluka, lgd: x.lgd, official: x.official, alsoKnownAs: x.alsoKnownAs, deva: null, romi: null, say: null, status: 'pending', house: HOUSE_OF[x.taluka], lp: x.lp, noShape: true, facts2: x.facts, census: null }; villagePlaces.push(p); byId[p.id] = p; });

export function getPlace(id) { return byId[id] || null; }
export function childrenOf(id) {
  if (!id || id === 'goa') return PLACES.filter(p => p.level === 'district');
  const p = byId[id]; if (!p) return [];
  if (p.level === 'district') return PLACES.filter(x => x.parent === id && x.level === 'taluka');
  if (p.level === 'taluka') return villagePlaces.filter(v => v.parent === id).sort((a, b) => a.official.localeCompare(b.official));
  return [];
}
export function trailOf(id) {
  const out = []; let p = byId[id];
  while (p) { out.unshift(p); p = p.parent ? byId[p.parent] : null; }
  if (!out.length || out[0].id !== 'goa') out.unshift(byId.goa);
  return out;
}
export function levelLabel(p) { return p ? { state: 'State', district: 'District', taluka: 'Taluka', village: 'Village' }[p.level] : ''; }
export function whereLabel(p) {
  if (!p) return '';
  const par = p.parent && p.parent !== 'goa' ? byId[p.parent] : null;
  return levelLabel(p) + (par ? ' in ' + par.official : '');
}
export function nameIn(p, script) {
  if (!p) return { text: '', kind: 'official', fallback: false };
  if (script === 'deva') return p.deva ? { text: p.deva, kind: 'deva', fallback: false } : { text: p.official, kind: 'official', fallback: true };
  if (script === 'romi') return p.romi ? { text: p.romi, kind: 'romi', fallback: false } : { text: p.official, kind: 'official', fallback: true };
  return { text: p.official, kind: 'official', fallback: false };
}
/* one sentence for screen readers: "Canacona. Konkani काणकोण, Romi Kannkonn. Taluka in Kushavati. Sources agree." */
export function spokenName(p) {
  if (!p) return '';
  const bits = [p.official + '.'];
  if (p.deva) bits.push('Konkani ' + p.deva + (p.romi ? ', Romi ' + p.romi : '') + '.');
  bits.push(whereLabel(p) + '.');
  bits.push(STATUS_TEXT[p.status] + '.');
  return bits.join(' ');
}
export const STATUS_TEXT = { agree: 'Sources agree', differ: 'Sources differ', pending: 'Official name only', review: 'Needs review' };
export function houseOf(p) { const k = p ? (p.house || HOUSE_OF[p.parent] || 'neel') : 'neel'; return { key: k, bg: `var(--house-${k})`, on: `var(--house-${k}-on)`, dim: `var(--map-${k}-dim)` }; }
export function shapeOf(id) { return TALUKA_SHAPES[id] || DISTRICT_SHAPES[id] || null; }
export function sayParts(say) { return say ? say.split(/-|\s+/).filter(Boolean).map(s => ({ text: s, stressed: s === s.toUpperCase() && /[A-Z]/.test(s) })) : []; }

const fold = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
export function searchPlaces(q, limit = 20) {
  const f = fold(q.trim()); if (!f) return [];
  const res = [];
  for (const p of PLACES.concat(villagePlaces)) {
    const fields = [['deva', p.deva], ['devaUnreviewed', p.devaUnreviewed], ['alsoKnownAs', p.alsoKnownAs], ['romi', p.romi], ['official', p.official], ['alsoWritten', p.alsoWritten && p.alsoWritten.join(' ')], ['marathi', p.marathi]];
    let hit = null, rank = 9;
    for (const [k, v] of fields) {
      if (!v) continue; const i = fold(v).indexOf(f);
      if (i >= 0) { const r = (i === 0 ? 0 : 1) + (p.level === 'village' ? 2 : 0); if (r < rank) { rank = r; hit = k; } }
    }
    if (hit) res.push({ place: p, field: hit, rank });
  }
  return res.sort((a, b) => a.rank - b.rank || a.place.official.localeCompare(b.place.official)).slice(0, limit);
}
/* Layers planned for Khoim. status: live | next | planned */
export const LAYERS = [
  { id: 'names', label: 'Names', icon: 'languages', status: 'live', note: 'Districts and talukas now. Village names in Konkani next.' },
  { id: 'voices', label: 'Voices', icon: 'mic', status: 'next', note: 'People from each taluka saying the names of the places near them.' },
  { id: 'crops', label: 'Crops', icon: 'wheat', status: 'planned', note: 'Khazan paddy, cashew, coconut and areca, on the villages that grow them.' },
  { id: 'food', label: 'Food', icon: 'soup', status: 'planned', note: 'Dishes tied to one village or feast, under their Konkani names.' },
  { id: 'music', label: 'Music', icon: 'music', status: 'planned', note: 'Where mando, dulpod, deknni and fugdi are sung and danced.' },
  { id: 'landmarks', label: 'Landmarks', icon: 'landmark', status: 'planned', note: 'Temples, churches, mosques and springs, by the names people nearby call them.' }
];
/* ---------- phase 2 ---------- */
export function neighboursOf(id) { return (NEIGHBOURS[String(id).replace(/^v/, '')] || []).map(n => byId['v' + n]).filter(Boolean); }
export function villageFacts(p) { return p && p.facts2 ? p.facts2 : null; }
/* PLACEHOLDER: measured on the map with an approximate scale. Replace with lat/long great-circle distance at build. */
export const DISTANCE_IS_PLACEHOLDER = true;
export function distanceKm(p, toId) {
  const t = byId[toId]; if (!p || !p.lp || !t || !t.lp) return null;
  return Math.round(Math.hypot(p.lp[0] - t.lp[0], p.lp[1] - t.lp[1]) * KM_PER_UNIT);
}
export const PANAJI = 'v803243';
export const MARGAO = 'v803249';
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
    h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
    month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}
/* Date of a feast in a given year, or null for lunar feasts (their months are in when.months). */
export function feastDate(when, year) {
  if (!when || when.lunar) return null;
  if (when.month) return new Date(year, when.month - 1, when.day);
  if (when.easterSaturday) { const e = easter(year); const d = new Date(e); d.setDate(e.getDate() + (6 - e.getDay() || 7) + 7 * (when.easterSaturday - 1)); return d; }
  return null;
}
export function feastMonths(when, year) { if (!when) return []; if (when.lunar) return when.months; const d = feastDate(when, year); return d ? [d.getMonth() + 1] : []; }
/* The next time a feast happens on or after today (this year's date if still to come, else next year's). */
export function nextFeastDate(when, today = new Date()) { const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()); const d = feastDate(when, t.getFullYear()); if (!d) return null; return d >= t ? d : feastDate(when, t.getFullYear() + 1); }
export function upcomingMonths(when, today = new Date()) { if (!when) return []; if (when.lunar) return when.months; const d = nextFeastDate(when, today); return d ? [d.getMonth() + 1] : []; }
/* Every dated item across Goa: [{ place (or null), name, item }] */
export function allFeasts() {
  const out = [];
  villagePlaces.forEach(p => (p.facts2 && p.facts2.knownFor || []).forEach(it => { if (it.when) out.push({ place: p, name: p.official, item: it }); }));
  UNMATCHED.forEach(u => u.knownFor.forEach(it => out.push({ place: null, name: u.name, taluka: u.taluka, item: it })));
  return out;
}
export function glyphsFor(p) { return p && p.facts2 && p.facts2.knownFor ? p.facts2.knownFor : []; }
export function linesFor(talukaId) { return LINES.filter(l => l.taluka === talukaId); }
/* Name parts, matched on official spellings. TODO(source): what each part means. */
export const NAME_PARTS = [
  { id: 'em', label: '-em', test: n => /em$/i.test(n) },
  { id: 'im', label: '-im', test: n => /im$/i.test(n) },
  { id: 'gao', label: '-gao', test: n => /gaon?$/i.test(n) },
  { id: 'ona', label: '-ona', test: n => /ona$/i.test(n) },
  { id: 'ora', label: '-ora', test: n => /ora$/i.test(n) }
].map(x => ({ ...x, count: villagePlaces.filter(v => x.test(v.official)).length }));
export const MAP_LAYERS = [
  { id: 'names', label: 'Names', icon: 'languages' },
  { id: 'parts', label: 'Name parts', icon: 'puzzle' },
  { id: 'feasts', label: 'Feasts and zatras', icon: 'calendar-days' },
  { id: 'need', label: 'Names we need', icon: 'circle-dashed' },
  { id: 'population', label: 'Population', icon: 'users' }
];
const hash = s => { let h = 7; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };
/* PLACEHOLDER until Census 2011 loads: a stable fake step 1..5 per village, only for drawing the population layer. */
export function populationStep(p) { return p.census ? p.census.step : 1 + (hash(p.id) % 5); }
/* How a village is drawn under a map layer: 'lit' | 'dim' | 'review' | 'outline' | 'step1'..'step5' */
export function layerState(p, layer, year) {
  if (!layer || layer.id === 'names') return 'lit';
  if (layer.id === 'parts') { const part = NAME_PARTS.find(x => x.id === layer.part); return part && part.test(p.official) ? 'lit' : 'dim'; }
  if (layer.id === 'feasts') return glyphsFor(p).some(it => upcomingMonths(it.when).includes(layer.month)) ? 'lit' : 'dim';
  if (layer.id === 'need') return p.deva ? 'lit' : p.devaUnreviewed ? 'review' : 'outline';
  if (layer.id === 'population') return 'step' + populationStep(p);
  return 'lit';
}
export function layerUrl(place, layer) {
  const base = 'https://khoim.in/' + (place ? trailOf(place.id).slice(1).map(x => x.official.toLowerCase().replace(/[^a-z0-9]+/g, '-')).join('/') : '');
  if (!layer || layer.id === 'names') return base;
  const q = layer.id === 'parts' ? '?layer=parts&part=' + layer.part : layer.id === 'feasts' ? '?layer=feasts&month=' + layer.month : '?layer=' + layer.id;
  return base + q;
}
export const KhoimData = { SITE, PLACES, VILLAGES: villagePlaces, LAYERS, MAP_LAYERS, NAME_PARTS, LINES, STATUS_TEXT, PANAJI, MARGAO, getPlace, childrenOf, trailOf, levelLabel, whereLabel, nameIn, spokenName, houseOf, shapeOf, sayParts, searchPlaces,
  neighboursOf, villageFacts, distanceKm, easter, feastDate, feastMonths, nextFeastDate, upcomingMonths, allFeasts, glyphsFor, linesFor, layerState, populationStep, layerUrl };
