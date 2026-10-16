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
const imagePath = p => p.level === 'state' ? '/og/goa.png' : '/og' + pathOf(p).slice(0, -1) + '.png';
const LEVEL = { district: 'District', taluka: 'Taluka', village: 'Village' };
const whereLine = p => { const par = parentOf(p); return LEVEL[p.level] + (par && par.level !== 'state' ? ' in ' + par.official : '') + ', Goa'; };
const outlineOf = p => p.level === 'state' ? Object.values(geo.districts).map(d => d.d).join('')
  : p.level === 'district' ? geo.districts[p.id]?.d : p.level === 'taluka' ? geo.talukas[p.id]?.d : villagePaths[p.id];

/* ---------- Layout (ShareCard, og) ---------- */

const W = 1200, H = 630, PAD = 24, FRAME = 5, RADIUS = 36;
const box = { x: PAD + FRAME + 48, y: PAD + FRAME + 36 };
box.w = W - 2 * box.x; box.h = H - 2 * box.y;
const SHAPE_W = 300, GAP = 56, FOOT_H = 60, ROW_GAP = 36;
const namesX = box.x + SHAPE_W + GAP, namesW = box.w - SHAPE_W - GAP, rowH = box.h - FOOT_H - ROW_GAP;

function shapeSvg(d, x, y, w, h) {
  if (!d) return '';
  const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  let b = [Infinity, Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n.length - 1; i += 2) { b[0] = Math.min(b[0], n[i]); b[1] = Math.min(b[1], n[i + 1]); b[2] = Math.max(b[2], n[i]); b[3] = Math.max(b[3], n[i + 1]); }
  b = [b[0] - 4, b[1] - 4, b[2] + 4, b[3] + 4];
  const s = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1]));
  const tx = x + (w - (b[2] - b[0]) * s) / 2 - b[0] * s, ty = y + (h - (b[3] - b[1]) * s) / 2 - b[1] * s;
  return `<path transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})" d="${d}" stroke="currentColor" stroke-width="${(1 / s).toFixed(3)}" stroke-linejoin="round"/>`;
}

/** Lines stacked in a column, centred in its height, as CSS grid with align-content: center would. */
function column(lines, x, top, height, gap) {
  const total = lines.reduce((t, l) => t + l.size * l.lh, 0) + gap * (lines.length - 1);
  let y = top + (height - total) / 2, out = '';
  for (const l of lines) {
    const base = y + baselineIn(l.font, l.size, l.lh);
    out += `<g transform="translate(${x.toFixed(2)} ${base.toFixed(2)})">${shapeLine(l.font, l.text, l.size).svg}</g>`;
    y += l.size * l.lh + gap;
  }
  return { out, total };
}

function card(p) {
  const named = !!(p.deva || p.romi);
  const NO_NAME = facts[p.id]?.gazetteerDeva ? CHECK : FIND;
  /* Name size: 112, or smaller so that the longest name fits the column and every line fits the height. */
  const fitWidth = (font, text, size) => Math.min(size, size * namesW / shapeLine(font, text, size).width);
  const big = [p.deva && [DEVA, p.deva], p.romi && [LATIN[600], p.romi], !named && [LATIN[600], p.official]].filter(Boolean);
  let nameSize = Math.min(112, ...big.map(([f, t]) => fitWidth(f, t, 112)));
  const linesAt = size => [
    p.level !== 'state' && { font: LATIN[600], text: whereLine(p), size: 30, lh: 1.3 },
    p.deva && { font: DEVA, text: p.deva, size, lh: 1.5 },
    p.romi && { font: LATIN[600], text: p.romi, size, lh: 1.2 },
    named ? { font: LATIN[500], text: p.official, size: Math.min(44, fitWidth(LATIN[500], p.official, 44)), lh: 1.3 }
      : { font: LATIN[600], text: p.official, size, lh: 1.2 },
    !named && { font: LATIN[600], text: NO_NAME, size: Math.min(34, fitWidth(LATIN[600], NO_NAME, 34)), lh: 1.35 }
  ].filter(Boolean);
  for (let i = 0; i < 20; i++) {
    const lines = linesAt(nameSize);
    const total = lines.reduce((t, l) => t + l.size * l.lh, 0) + 4 * (lines.length - 1);
    if (total <= rowH) break;
    nameSize -= 2;
  }
  const names = column(linesAt(nameSize), namesX, box.y, rowH, 4);

  /* Footer: the wordmark on the left, khoim.in on the right, on one baseline. */
  const footTop = box.y + box.h - FOOT_H, base = footTop + baselineIn(DEVA, 40, 1.5);
  const deva = shapeLine(DEVA, SITE.deva, 40), romi = shapeLine(LATIN[600], SITE.romi, 40), url = shapeLine(LATIN[600], 'khoim.in', 36);
  const foot = `<g transform="translate(${box.x} ${base.toFixed(2)})">${deva.svg}</g>` +
    `<g transform="translate(${(box.x + deva.width + 12).toFixed(2)} ${base.toFixed(2)})">${romi.svg}</g>` +
    `<g transform="translate(${(box.x + box.w - url.width).toFixed(2)} ${base.toFixed(2)})">${url.svg}</g>`;

  const bg = colour('house-' + p.house), on = colour('house-' + p.house + '-on');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" color="${on}">` +
    `<rect width="${W}" height="${H}" fill="${bg}"/>` +
    `<rect x="${PAD + FRAME / 2}" y="${PAD + FRAME / 2}" width="${W - 2 * PAD - FRAME}" height="${H - 2 * PAD - FRAME}" rx="${RADIUS - FRAME / 2}" fill="none" stroke="currentColor" stroke-width="${FRAME}"/>` +
    `<g fill="currentColor">${shapeSvg(outlineOf(p), box.x, box.y, SHAPE_W, rowH)}${names.out}${foot}</g></svg>`;
}

/* ---------- Write ---------- */

const out = join(root, 'dist');
const started = Date.now();
let count = 0, bytes = 0;
for (const p of all) {
  const file = join(out, imagePath(p));
  mkdirSync(dirname(file), { recursive: true });
  const png = new Resvg(card(p), { font: { loadSystemFonts: false } }).render().asPng();
  writeFileSync(file, png);
  count++; bytes += png.length;
}
console.log(`Khoim preview images: ${count} written to dist/og/ (${(bytes / 1048576).toFixed(1)} MB) in ${((Date.now() - started) / 1000).toFixed(1)}s.`);

/* Exported for a quick look at one card while working on the layout. */
export { card };
