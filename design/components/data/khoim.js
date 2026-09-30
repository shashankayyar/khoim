import { PLACES, HOUSE_OF } from './places.js';
import { VILLAGES, TALUKA_SHAPES, DISTRICT_SHAPES } from './goaGeo.js';

/* Khoim site identity. खंय confirmed by the team, 30 Sept 2026. */
export const SITE = { romi: 'Khoim', deva: 'खंय', meaning: 'Where' };

const byId = {};
PLACES.forEach(p => { byId[p.id] = p; });
const villagePlaces = VILLAGES.map(v => ({
  id: 'v' + v.id, level: 'village', parent: v.t, lgd: /^n/.test(v.id) ? null : v.id.split('-')[0],
  official: v.n, deva: null, romi: null, say: null, status: 'pending', house: HOUSE_OF[v.t], town: !!v.town, boundarySource: v.src, lp: v.lp
}));
villagePlaces.forEach(p => { byId[p.id] = p; });

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
export const STATUS_TEXT = { agree: 'Sources agree', differ: 'Sources differ', pending: 'Official name only' };
export function houseOf(p) { const k = p ? (p.house || HOUSE_OF[p.parent] || 'neel') : 'neel'; return { key: k, bg: `var(--house-${k})`, on: `var(--house-${k}-on)`, dim: `var(--map-${k}-dim)` }; }
export function shapeOf(id) { return TALUKA_SHAPES[id] || DISTRICT_SHAPES[id] || null; }
export function sayParts(say) { return say ? say.split(/-|\s+/).filter(Boolean).map(s => ({ text: s, stressed: s === s.toUpperCase() && /[A-Z]/.test(s) })) : []; }

const fold = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
export function searchPlaces(q, limit = 20) {
  const f = fold(q.trim()); if (!f) return [];
  const res = [];
  for (const p of PLACES.concat(villagePlaces)) {
    const fields = [['deva', p.deva], ['romi', p.romi], ['official', p.official], ['alsoWritten', p.alsoWritten && p.alsoWritten.join(' ')], ['marathi', p.marathi]];
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
export const KhoimData = { SITE, PLACES, VILLAGES: villagePlaces, LAYERS, STATUS_TEXT, getPlace, childrenOf, trailOf, levelLabel, whereLabel, nameIn, spokenName, houseOf, shapeOf, sayParts, searchPlaces };
