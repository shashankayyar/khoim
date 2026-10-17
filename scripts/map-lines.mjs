/* Rivers, railway and stations for the type map (phase 3, docs/phase3-brief.md step 4).
   - Rivers: only the named main rivers below, from OpenStreetMap (data/raw/osm_lines_ODbL.geojson, ODbL, kept
     separate and credited on the map). Unnamed and minor streams are left out. Each keeps the name OpenStreetMap
     gives it: no invented Konkani river names. The weights are the prototype's (docs/prototypes/rivers-proto.json):
     heavier for the Mandovi and the Zuari.
   - Railway: every main line, as one set of lines. Sidings and loops are left out.
   - Stations: data/credited/stations_wikidata.csv (Wikidata, CC0).
   All on the map plane, simplified. The map clips them to Goa's outline. Written to src/data/generated/map-lines.json. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/csv.mjs';
import { openProjection } from './lib/projection.mjs';

export const RIVERS = {
  Mandovi: 3, Zuari: 3, Chapora: 2.4, Terekhol: 2.2, Sal: 2, Mhadei: 2, Talpona: 1.8,
  Kushavati: 1.6, Galgibaga: 1.6, 'Valvanti River': 1.4, Dudhsagar: 1.3, 'Mapusa River': 1.3
};
const SIMPLIFY = 0.6;
const r1 = v => Math.round(v * 10) / 10;

/** Douglas-Peucker, on map units. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let best = 0, at = -1;
    const [x1, y1] = pts[a], [x2, y2] = pts[b], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len; if (d > best) { best = d; at = i; } }
    if (best > tol) { keep[at] = 1; stack.push([a, at], [at, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const pathOf = pts => 'M' + pts.map(([x, y]) => r1(x) + ',' + r1(y)).join('L');
const length = pts => pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

export function mapLines(root, { check }) {
  const { toMap } = openProjection(root);
  const osm = JSON.parse(readFileSync(join(root, 'data/raw/osm_lines_ODbL.geojson'), 'utf8'));
  const rivers = [];
  for (const [name, w] of Object.entries(RIVERS)) {
    const parts = osm.features.filter(f => f.properties.kind === 'river' && f.properties.name === name)
      .map(f => simplify(f.geometry.coordinates.map(toMap), SIMPLIFY)).filter(p => p.length > 1);
    check(parts.length > 0, `data/raw/osm_lines_ODbL.geojson has no river named "${name}".`);
    if (!parts.length) continue;
    /* the name runs along the longest part, left to right so it never reads upside down */
    const longest = parts.reduce((a, b) => (length(b) > length(a) ? b : a));
    const label = longest[0][0] > longest[longest.length - 1][0] ? [...longest].reverse() : longest;
    rivers.push({ n: name, w, d: parts.map(pathOf), label: pathOf(label) });
  }
  const rail = osm.features.filter(f => f.properties.kind === 'rail' && f.properties.usage === 'main')
    .map(f => simplify(f.geometry.coordinates.map(toMap), SIMPLIFY)).filter(p => p.length > 1).map(pathOf);
  const stations = readCsv(join(root, 'data/credited/stations_wikidata.csv')).map(s => ({ n: s.name, code: s.code, at: toMap([+s.lon, +s.lat]).map(r1) }));
  return { rivers, rail, stations };
}
