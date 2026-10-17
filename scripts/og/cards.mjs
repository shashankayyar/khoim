/* Link-preview images: one 1200 x 630 PNG per place, made when the site is built (phase 2 brief, A7) and
   written into dist/og/ after Astro has built the pages. Layout from design/components/share/ShareCard.jsx
   (format "og"): the place's house colour, a trim frame, the place's own outline, a where-line, the
   Devanagari and Romi names at the same size and the official spelling smaller, then the wordmark and
   khoim.in. A missing script is left out. A place with no Konkani name shows its official name and
   "Konkani name: help us check it" when a source gives a form nobody has checked yet (the Gazetteer's), or
   "Konkani name: help us find it" when none does. The unchecked form itself never appears (phase 2 rule 6).
   Text is shaped by HarfBuzz (shape.mjs) and drawn as outlines; resvg turns the SVG into a PNG.
   The address of each image matches ogImagePath() in src/data/seo.ts. */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { baselineIn, shapeLine } from './shape.mjs';
import { twoTonePng } from './png.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gen = join(root, 'src/data/generated');
const read = f => JSON.parse(readFileSync(join(gen, f), 'utf8'));
const FONTS = join(root, 'scripts/og/fonts');
const DEVA = join(FONTS, 'AnekDevanagari-devanagari-600.ttf');
const LATIN = { 500: join(FONTS, 'AnekLatin-latin-500.ttf'), 600: join(FONTS, 'AnekLatin-latin-600.ttf') };
const SITE = { deva: 'खंय', romi: 'Khoim' }; // src/data/site.ts
const FIND = 'Konkani name: help us find it', CHECK = 'Konkani name: help us check it';

/* ---------- Data ---------- */

const places = read('places.json'), villages = read('villages.json'), geo = read('geo-base.json'), facts = read('village-facts.json');
const byId = new Map(places.map(p => [p.id, p]));
const villagePaths = Object.assign({}, ...readdirSync(join(gen, 'village-paths')).map(f => read('village-paths/' + f)));

/* House colours, light theme, from the tokens the site uses. */
const tokens = {};
for (const m of readFileSync(join(root, 'src/styles/tokens/base.css'), 'utf8').matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) tokens[m[1]] = m[2].trim();
const colour = name => { let v = tokens[name]; for (let i = 0; v && v.startsWith('var(') && i < 5; i++) v = tokens[v.slice(6, -1)]; return v; };

const all = [
  ...places.map(p => ({ id: p.id, level: p.level, parent: p.parent, official: p.official, deva: p.deva, romi: p.romi, house: p.house, slug: p.slug })),
  ...villages.map(v => ({ id: v.id, level: 'village', parent: v.t, official: v.n, deva: v.deva, romi: v.romi, house: byId.get(v.t).house, slug: v.slug }))
];
const parentOf = p => p.parent && (byId.get(p.parent) ?? null);
const pathOf = p => { const t = []; for (let q = p; q && q.level !== 'state'; q = parentOf(q)) t.unshift(q.slug); return t.length ? '/' + t.join('/') + '/' : '/'; };
/* /og/south-goa/salcete.png, /og/square/south-goa/salcete.png, /og/tall/south-goa/salcete.png */
const imagePath = (p, format = 'og') => '/og' + (format === 'og' ? '' : format === 'square' ? '/square' : '/tall') + (p.level === 'state' ? '/goa' : pathOf(p).slice(0, -1)) + '.png';
const LEVEL = { district: 'District', taluka: 'Taluka', village: 'Village' };
const whereLine = p => { const par = parentOf(p); return LEVEL[p.level] + (par && par.level !== 'state' ? ' in ' + par.official : '') + ', Goa'; };
const outlineOf = p => p.level === 'state' ? Object.values(geo.districts).map(d => d.d).join('')
  : p.level === 'district' ? geo.districts[p.id]?.d : p.level === 'taluka' ? geo.talukas[p.id]?.d : villagePaths[p.id];

/* ---------- Layout (ShareCard) ---------- */

/* The formats of design/components/share/ShareCard.jsx. Only the link preview (og) is made here; the square and
   tall images the share sheet saves are drawn in the visitor's browser when chosen (src/lib/shareImage.ts, same
   numbers), which keeps the build to one image per place. */
const FORMATS = {
  og: { W: 1200, H: 630, pad: 24, frame: 5, radius: 36, px: 48, py: 36, name: 112, where: 30, official: 44, ask: 34, mark: 40, url: 36, rowGap: 36 },
  square: { W: 1080, H: 1080, pad: 36, frame: 6, radius: 48, px: 60, py: 56, name: 130, where: 40, official: 56, ask: 44, mark: 52, url: 46, rowGap: 36 },
  story: { W: 1080, H: 1920, pad: 36, frame: 6, radius: 48, px: 64, py: 72, name: 150, where: 40, official: 56, ask: 44, mark: 52, url: 46, rowGap: 56 }
};
const SHAPE_W = 300, GAP = 56;

function shapeSvg(d, x, y, w, h, align = 'center') {
  if (!d || w <= 0 || h <= 0) return '';
  const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  let b = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n.length - 1; i += 2) { b[0] = Math.min(b[0], n[i]); b[1] = Math.min(b[1], n[i + 1]); b[2] = Math.max(b[2], n[i]); b[3] = Math.max(b[3], n[i + 1]); }
  b = [b[0] - 4, b[1] - 4, b[2] + 4, b[3] + 4];
  const s = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1]));
  const tx = x + (align === 'start' ? 0 : (w - (b[2] - b[0]) * s) / 2) - b[0] * s, ty = y + (h - (b[3] - b[1]) * s) / 2 - b[1] * s;
  return `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})" d="${d}" stroke="currentColor" stroke-width="${(1 / s).toFixed(3)}" stroke-linejoin="round"/>`;
}

const heightOf = (lines, gap) => lines.reduce((t, l) => t + l.size * l.lh, 0) + gap * (lines.length - 1);
/** Lines stacked in a column from `top`. */
function stack(lines, x, top, gap) {
  let y = top, out = '';
  for (const l of lines) {
    const base = y + baselineIn(l.font, l.size, l.lh);
    out += `<g transform="translate(${x.toFixed(2)} ${base.toFixed(2)})">${shapeLine(l.font, l.text, l.size).svg}</g>`;
    y += l.size * l.lh + gap;
  }
  return out;
}

function card(p, format = 'og') {
  const F = FORMATS[format], og = format === 'og';
  const box = { x: F.pad + F.frame + F.px, y: F.pad + F.frame + F.py };
  box.w = F.W - 2 * box.x; box.h = F.H - 2 * box.y;
  const footH = F.mark * 1.5, gap = og ? 4 : 10;
  /* og: the outline on the left, the names beside it. square and tall: the outline above, the names below it. */
  const namesX = og ? box.x + SHAPE_W + GAP : box.x, namesW = og ? box.w - SHAPE_W - GAP : box.w;
  const room = og ? box.h - footH - F.rowGap : box.h - footH - 2 * F.rowGap;

  const named = !!(p.deva || p.romi);
  const NO_NAME = facts[p.id]?.gazetteerDeva ? CHECK : FIND;
  const fitWidth = (font, text, size) => Math.min(size, size * namesW / shapeLine(font, text, size).width);
  const big = [p.deva && [DEVA, p.deva], p.romi && [LATIN[600], p.romi], !named && [LATIN[600], p.official]].filter(Boolean);
  let nameSize = Math.min(F.name, ...big.map(([f, t]) => fitWidth(f, t, F.name)));
  const linesAt = size => [
    p.level !== 'state' && { font: LATIN[600], text: whereLine(p), size: Math.min(F.where, fitWidth(LATIN[600], whereLine(p), F.where)), lh: 1.3 },
    p.deva && { font: DEVA, text: p.deva, size, lh: 1.5 },
    p.romi && { font: LATIN[600], text: p.romi, size, lh: 1.2 },
    named ? { font: LATIN[500], text: p.official, size: Math.min(F.official, fitWidth(LATIN[500], p.official, F.official)), lh: 1.3 }
      : { font: LATIN[600], text: p.official, size, lh: 1.2 },
    !named && { font: LATIN[600], text: NO_NAME, size: Math.min(F.ask, fitWidth(LATIN[600], NO_NAME, F.ask)), lh: 1.35 }
  ].filter(Boolean);
  /* og: every line must fit the row. square and tall: leave the outline at least a quarter of the height. */
  const limit = og ? room : room - box.h / 4;
  for (let i = 0; i < 40 && heightOf(linesAt(nameSize), gap) > limit; i++) nameSize -= 2;
  const lines = linesAt(nameSize), namesH = heightOf(lines, gap);

  let body;
  if (og) {
    body = shapeSvg(outlineOf(p), box.x, box.y, SHAPE_W, room) + stack(lines, namesX, box.y + (room - namesH) / 2, gap);
  } else {
    const shapeH = room - namesH;
    body = (format === 'square'
      ? shapeSvg(outlineOf(p), box.x, box.y, box.w * 0.44, shapeH, 'start')
      : shapeSvg(outlineOf(p), box.x + 80, box.y + 40, box.w - 160, shapeH - 80))
      + stack(lines, namesX, box.y + shapeH + F.rowGap, gap);
  }

  /* Footer: the wordmark on the left, khoim.in on the right, on one baseline. */
  const base = box.y + box.h - footH + baselineIn(DEVA, F.mark, 1.5);
  const deva = shapeLine(DEVA, SITE.deva, F.mark), romi = shapeLine(LATIN[600], SITE.romi, F.mark), url = shapeLine(LATIN[600], 'khoim.in', F.url);
  const foot = `<g transform="translate(${box.x} ${base.toFixed(2)})">${deva.svg}</g>` +
    `<g transform="translate(${(box.x + deva.width + F.mark * 0.3).toFixed(2)} ${base.toFixed(2)})">${romi.svg}</g>` +
    `<g transform="translate(${(box.x + box.w - url.width).toFixed(2)} ${base.toFixed(2)})">${url.svg}</g>`;

  const bg = colour('house-' + p.house), on = colour('house-' + p.house + '-on');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${F.W}" height="${F.H}" viewBox="0 0 ${F.W} ${F.H}" color="${on}">` +
    `<rect width="${F.W}" height="${F.H}" fill="${bg}"/>` +
    `<rect x="${F.pad + F.frame / 2}" y="${F.pad + F.frame / 2}" width="${F.W - 2 * F.pad - F.frame}" height="${F.H - 2 * F.pad - F.frame}" rx="${F.radius - F.frame / 2}" fill="none" stroke="currentColor" stroke-width="${F.frame}"/>` +
    `<g fill="currentColor">${body}${foot}</g></svg>`;
}

/* ---------- Write ---------- */

const out = join(root, 'dist');
const started = Date.now();
let count = 0, bytes = 0;
for (const p of all) for (const format of ['og']) {
  const file = join(out, imagePath(p, format));
  mkdirSync(dirname(file), { recursive: true });
  const img = new Resvg(card(p, format), { font: { loadSystemFonts: false } }).render();
  const png = twoTonePng(img.pixels, img.width, img.height, colour('house-' + p.house), colour('house-' + p.house + '-on'));
  writeFileSync(file, png);
  count++; bytes += png.length;
}
console.log(`Khoim preview images: ${count} written to dist/og/ (${(bytes / 1048576).toFixed(1)} MB) in ${((Date.now() - started) / 1000).toFixed(1)}s.`);

/* Exported for a quick look at one card while working on the layout. */
export { card };
