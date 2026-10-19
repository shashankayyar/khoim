/* Search beyond place names (phase 4, B5): feasts and zatras, parishes, landmarks and rivers. Each result says what
   it is and where ("Lairai jatra, feast in Sirigao, Bicholim"), and opens its village, or for a river the taluka it
   runs through most. Feasts, parishes and landmarks come from the village facts (data/credited/), so they join the
   results once those have loaded; rivers from the map's lines (OpenStreetMap's names). */
import { allVillages, factsOf, fold, getPlace } from '../data/khoim';
import type { MapLines } from '../data/geo';

export interface Thing { key: string; name: string; what: string; where: string; open: string; rank: number }

// TODO(copy): the words for what a result is: "feast", "parish", "landmark", "river", and "{what} in {where}"
const WHAT: Record<string, string> = { zatra: 'feast', feast: 'feast', festival: 'feast', parish: 'parish', landmark: 'landmark' };

export function searchThings(q: string, lines: MapLines | null): Thing[] {
  const f = fold(q.trim());
  if (f.length < 2) return [];
  const out: Thing[] = [], seen = new Set<string>();
  /* spaces do not count: "Dudhsagar" finds "Dudh Sagar" */
  const g = f.replace(/\s+/g, '');
  const rank = (s: string) => { const i = fold(s).replace(/\s+/g, '').indexOf(g); return i < 0 ? -1 : i === 0 ? 0 : 1; };
  for (const v of allVillages()) {
    const items = factsOf(v.id)?.knownFor;
    if (!items) continue;
    const taluka = getPlace(v.parent)?.official;
    for (const it of items) {
      const what = WHAT[it.kind];
      if (!what) continue;
      const r = rank(it.title);
      const key = v.id + '|' + fold(it.title);
      if (r < 0 || seen.has(key)) continue;
      seen.add(key);
      out.push({ key, name: it.title, what, where: `${v.official}${taluka ? ', ' + taluka : ''}`, open: v.id, rank: r });
    }
  }
  for (const r of lines?.rivers ?? []) {
    const k = rank(r.n);
    if (k < 0 || !r.ts?.length) continue;
    const names = r.ts.map(t => getPlace(t)?.official).filter(Boolean) as string[];
    out.push({ key: 'river|' + r.n, name: r.n, what: 'river', where: names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0], open: r.ts[0], rank: k });
  }
  return out.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}
