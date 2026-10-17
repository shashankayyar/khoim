/* Where each village's name sits on the type map (phase 3, step 1). Ported from docs/prototypes/build_labels.py.
   Run by scripts/build-data.mjs on every build; the results go into src/data/generated/villages.json.

   For each village outline:
   - a: the angle of the outline's long axis, in degrees, from its spread of points. Kept between -55 and 55, so no
     name reads steeply up or down; under 8 it is snapped to 0, so near-level names sit level.
   - fs: a font size, in map units, that fits the name along the long axis (a letter is about half a font size wide
     at the map's narrow width) and across the short one. Between 1.4 and 16.
   - b: the outline's box [x0, y0, x1, y1], for zooming to it and drawing it on its own.
   Label points (lp) come from the outline file itself (design/components/data/goaGeo.js).

   And for all of them together:
   - nb: neighbours, the villages whose outlines share at least two boundary points (points rounded to whole map
     units), most shared first, ten at most. Across taluka lines too.

   Nothing here touches a name: the name's length is the only thing read. */

/** Every [x, y] pair in an SVG path. */
const pointsOf = d => [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);
const r1 = v => Math.round(v * 10) / 10;
const r2 = v => Math.round(v * 100) / 100;
/* Python's round(): halves go to the even number. The prototype rounds this way, so the neighbours match it. */
const roundEven = v => { const f = Math.floor(v), diff = v - f; return diff > 0.5 || (diff === 0.5 && f % 2 !== 0) ? f + 1 : diff === 0.5 ? f : Math.round(v); };

/** Angle, font size and box for one outline (the part the label sits on) and one name. */
export function labelFor(d, name) {
  const p = pointsOf(d), n = p.length;
  const cx = p.reduce((s, [x]) => s + x, 0) / n, cy = p.reduce((s, [, y]) => s + y, 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of p) { sxx += (x - cx) ** 2; syy += (y - cy) ** 2; sxy += (x - cx) * (y - cy); }
  sxx /= n; syy /= n; sxy /= n;
  let deg = 0.5 * Math.atan2(2 * sxy, sxx - syy) * 180 / Math.PI;
  if (deg > 90) deg -= 180;
  if (deg < -90) deg += 180;
  if (Math.abs(deg) > 55) deg = deg > 0 ? deg - 90 : deg + 90;
  if (Math.abs(deg) < 8) deg = 0;
  const a = deg * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a);
  const along = p.map(([x, y]) => (x - cx) * ux + (y - cy) * uy), across = p.map(([x, y]) => -(x - cx) * uy + (y - cy) * ux);
  const L = Math.max(...along) - Math.min(...along), W = Math.max(...across) - Math.min(...across);
  let fs = Math.min(L * 0.8 / (0.5 * Math.max(name.length, 3)), W * 0.5);
  fs = Math.max(1.4, Math.min(fs, 16));
  const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
  return { a: r1(deg) || 0, fs: r2(fs), b: [r1(Math.min(...xs)), r1(Math.min(...ys)), r1(Math.max(...xs)), r1(Math.max(...ys))] };
}

/** Neighbours of every village: [{ id, d }] (d = the whole outline, every part) to { id: [ids] }. */
export function neighboursOf(outlines) {
  const at = new Map();
  for (const { id, d } of outlines) {
    for (const k of new Set(pointsOf(d).map(([x, y]) => roundEven(x) + ',' + roundEven(y)))) {
      (at.get(k) ?? at.set(k, new Set()).get(k)).add(id);
    }
  }
  const shared = new Map(outlines.map(o => [o.id, new Map()]));
  for (const ids of at.values()) {
    if (ids.size < 2) continue;
    for (const i of ids) for (const j of ids) if (i !== j) shared.get(i).set(j, (shared.get(i).get(j) ?? 0) + 1);
  }
  /* most shared points first; a tie keeps the order the outlines came in, as the prototype does */
  const order = new Map(outlines.map((o, i) => [o.id, i]));
  return Object.fromEntries([...shared].map(([id, m]) => [id,
    [...m].filter(([, c]) => c >= 2).sort((x, y) => y[1] - x[1] || order.get(x[0]) - order.get(y[0])).slice(0, 10).map(([j]) => j)]));
}
