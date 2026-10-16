/* What the map draws inside a taluka beyond the village outlines (phase 2, village-level map):
   - neighbours: villages that share a stretch of boundary, worked out from our own outlines (points closer than
     2.5 map units, as in design/components/data/neighbours.js). Across taluka lines too.
   - rivers and railway from OpenStreetMap (data/raw/osm_lines_ODbL.geojson, ODbL, kept separate and credited on
     the map), cut to the taluka's view and simplified;
   - railway stations from data/credited/stations_wikidata.csv (Wikidata, CC0), in the taluka they stand in.
   Written to src/data/generated/map-extra/{taluka}.json, loaded with the taluka's village outlines. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/csv.mjs';
import { openProjection } from './lib/projection.mjs';

const TOLERANCE = 2.5, SIMPLIFY = 0.6;
const r1 = v => Math.round(v * 10) / 10;

/** Every [x, y] pair in an SVG path made of M, L and Z. */
const pointsOf = d => { const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number), out = []; for (let i = 0; i < n.length - 1; i += 2) out.push([n[i], n[i + 1]]); return out; };
const boxOf = pts => pts.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity]);

/** Villages that share at least two boundary points (within the tolerance). */
function neighbours(paths) {
  const ids = Object.keys(paths), pts = {}, box = {};
  for (const id of ids) { pts[id] = pointsOf(paths[id]); box[id] = boxOf(pts[id]); }
  const grid = id => { const g = new Map(); for (const [x, y] of pts[id]) { const k = Math.floor(x / TOLERANCE) + ',' + Math.floor(y / TOLERANCE); (g.get(k) ?? g.set(k, []).get(k)).push([x, y]); } return g; };
  const grids = Object.fromEntries(ids.map(id => [id, grid(id)]));
  const near = (g, [x, y]) => {
    const cx = Math.floor(x / TOLERANCE), cy = Math.floor(y / TOLERANCE);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const [a, b] of g.get((cx + i) + ',' + (cy + j)) ?? []) if (Math.hypot(a - x, b - y) <= TOLERANCE) return true;
    return false;
  };
  const out = Object.fromEntries(ids.map(id => [id, []]));
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = ids[i], b = ids[j], A = box[a], B = box[b];
    if (A[0] > B[2] + TOLERANCE || B[0] > A[2] + TOLERANCE || A[1] > B[3] + TOLERANCE || B[1] > A[3] + TOLERANCE) continue;
    let shared = 0;
    for (const p of pts[a]) if (near(grids[b], p) && ++shared >= 2) break;
    if (shared >= 2) { out[a].push(b); out[b].push(a); }
  }
  return { out, box };
}

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

/** The parts of a line inside a box, each with one point either side so it runs to the edge. */
function clip(pts, [x0, y0, x1, y1]) {
  const inside = ([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1, parts = [];
  let cur = null;
  pts.forEach((p, i) => {
    if (inside(p)) { if (!cur) { cur = i > 0 ? [pts[i - 1]] : []; parts.push(cur); } cur.push(p); }
    else if (cur) { cur.push(p); cur = null; }
  });
  return parts.filter(p => p.length > 1);
}
const pathOf = pts => 'M' + pts.map(([x, y]) => r1(x) + ',' + r1(y)).join('L');

function inPolygon([x, y], rings) {
  let inside = false;
  for (const ring of rings) for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function mapExtra(root, { talukas, paths, viewOf, check }) {
  const { toMap, talukaFeatures } = openProjection(root);
  const all = Object.assign({}, ...Object.values(paths));
  const { out: nb, box } = neighbours(all);

  const osm = JSON.parse(readFileSync(join(root, 'data/raw/osm_lines_ODbL.geojson'), 'utf8'));
  const lines = osm.features.map(f => ({ kind: f.properties.kind, name: f.properties.name, pts: f.geometry.coordinates.map(toMap) }));

  /* stations: the taluka they stand in, from the LGD outlines */
  const idOf = name => talukas.find(t => t.official === (name === 'Satari' ? 'Sattari' : name))?.id;
  const stations = readCsv(join(root, 'data/credited/stations_wikidata.csv')).map(s => {
    const at = [+s.lon, +s.lat];
    const f = talukaFeatures.find(f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).some(p => inPolygon(at, p)));
    const t = f && idOf(f.properties.taluka);
    check(!!t, `data/credited/stations_wikidata.csv: ${s.name} (${s.code}) is not inside any taluka outline.`);
    return { t, n: s.name, code: s.code, at: toMap(at).map(r1) };
  });

  const result = {};
  for (const t of talukas) {
    const own = Object.keys(paths[t.id] ?? {});
    const [x0, y0, x1, y1] = viewOf(t.id), pad = Math.max(x1 - x0, y1 - y0) * 0.1, view = [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
    const outside = new Set(own.flatMap(id => nb[id]).filter(id => !own.includes(id)));
    const ls = [];
    for (const l of lines) for (const part of clip(l.pts, view)) { const s = simplify(part, SIMPLIFY); if (s.length > 1) ls.push({ k: l.kind, n: l.name, d: pathOf(s) }); }
    result[t.id] = {
      nb: Object.fromEntries(own.map(id => [id, nb[id]])),
      box: Object.fromEntries([...own, ...outside].map(id => [id, box[id].map(r1)])),
      lines: ls,
      stations: stations.filter(s => s.t === t.id).map(({ n, code, at }) => ({ n, code, at }))
    };
  }
  return result;
}
