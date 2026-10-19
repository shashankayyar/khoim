/* Khoim map check. A testing aid, not part of the site (phase 4, B1 and B2).

   - overlaps(): every name showing on the map (village and taluka names, river names, stations), and how many
     pairs of them overlap on screen. A name counts as showing when it is at least 15% opaque.
   - cover(): the things that sit over the map (the header, panels, banner, hint, credit, zoom buttons, the sheet),
     and how many of them cover land. Checked on a grid of points inside each one, against Goa's own outline.
   - whole(): whether all of Goa is inside the map's free space.

   How to run: as for contrast-audit.js, copy into dist/ as __map-audit.js, or inject it, then in the console
     (await import('/__map-audit.js')).overlaps()   and   .cover()   and   .whole()
   Empty "pairs" and "covering" lists mean it passes. */

const shown = el => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') return false; let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= Number(getComputedStyle(e).opacity); return o >= 0.15; };

/** The four corners of an element on screen, rotation included. */
function corners(el) {
  if (el instanceof SVGGraphicsElement) {
    const b = el.getBBox(), m = el.getScreenCTM(); if (!m || !b.width) return null;
    const pad = Math.min(b.height * 0.08, 2);
    return [[b.x + pad, b.y + pad], [b.x + b.width - pad, b.y + pad], [b.x + b.width - pad, b.y + b.height - pad], [b.x + pad, b.y + b.height - pad]]
      .map(([x, y]) => { const p = new DOMPoint(x, y).matrixTransform(m); return [p.x, p.y]; });
  }
  const r = el.getBoundingClientRect(); if (!r.width) return null;
  return [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]];
}
/* separating axis test for two convex quadrilaterals */
function hit(a, b) {
  for (const poly of [a, b]) for (let i = 0; i < 4; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % 4], nx = y2 - y1, ny = x1 - x2;
    const pa = a.map(([x, y]) => x * nx + y * ny), pb = b.map(([x, y]) => x * nx + y * ny);
    if (Math.max(...pa) <= Math.min(...pb) + 0.5 || Math.max(...pb) <= Math.min(...pa) + 0.5) return false;
  }
  return true;
}

export function overlaps() {
  const map = document.querySelector('.k-tmap'); if (!map) return { error: 'no map' };
  const vw = innerWidth, vh = innerHeight;
  const items = [...map.querySelectorAll('.k-tmap__name, .k-tmap__taluka, .k-tmap__river-name, .k-tmap__station')]
    .filter(shown).map(el => ({ el, c: corners(el), t: el.textContent.trim() }))
    .filter(i => i.c && i.c.some(([x, y]) => x > 0 && y > 0 && x < vw && y < vh));
  const pairs = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) if (hit(items[i].c, items[j].c)) pairs.push(items[i].t + ' / ' + items[j].t);
  return { names: items.length, pairs };
}

/** Is this screen point on land? Goa's taluka outlines, through the map's own transform. */
function landAt(x, y) {
  const world = document.querySelector('.k-tmap__svg > g'); if (!world) return false;
  const m = world.getScreenCTM(); if (!m) return false;
  const p = new DOMPoint(x, y).matrixTransform(m.inverse());
  return [...document.querySelectorAll('.k-tmap__base')].some(path => path.isPointInFill(p));
}

const CHROME = ['.k-phone-header', '.k-phone-bar', '.k-desktop-panel', '.k-desktop-dock', '.k-desktop-credit', '.k-draft-banner', '.k-hint', '.k-tmap__credit', '.k-tmap__zoom', '.k-sheet', '.k-legend'];
export function cover() {
  const covering = [];
  for (const sel of CHROME) for (const el of document.querySelectorAll(sel)) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let land = 0, n = 0;
    for (let x = r.left + 2; x < r.right - 1; x += 8) for (let y = r.top + 2; y < r.bottom - 1; y += 8) { n++; if (landAt(x, y)) land++; }
    if (land) covering.push(`${sel}: ${land} of ${n} points on land`);
  }
  return { covering };
}

/** Every point of Goa's outline that is off screen or under the chrome. */
export function whole() {
  const outside = [];
  for (const path of document.querySelectorAll('.k-tmap__base')) {
    const m = path.getScreenCTM(), len = path.getTotalLength();
    for (let s = 0; s < len; s += len / 60) {
      const q = path.getPointAtLength(s), p = new DOMPoint(q.x, q.y).matrixTransform(m);
      if (p.x < 0 || p.y < 0 || p.x > innerWidth || p.y > innerHeight) { outside.push('off screen'); continue; }
      const top = document.elementFromPoint(p.x, p.y);
      if (top && top.closest(CHROME.join(','))) outside.push((top.closest(CHROME.join(',')).className || '').toString().split(' ')[0]);
    }
  }
  const counts = {}; for (const o of outside) counts[o] = (counts[o] || 0) + 1;
  return { hidden: counts };
}
