/* The square (1080) and tall (1080 x 1920) "My village in Konkani" images, drawn in the visitor's browser when
   they choose Save image. Same layout and numbers as the link-preview images made at build time
   (scripts/og/cards.mjs, design/components/share/ShareCard.jsx): the house colour, a trim frame, the place's own
   outline, a where-line, the Devanagari and Romi names at the same size, the official spelling smaller, and the
   wordmark with khoim.in. The browser shapes the text with the site's own fonts, so Devanagari joins as it does on
   the page. Reviewed names only: a place without one shows its official name and asks for help (rule 6). */
import { GEO, loadVillagePaths } from '../data/geo';
import { factsOf, houseOf, whereLabel } from '../data/khoim';
import { SITE } from '../data/site';
import type { Place } from '../data/types';

const FORMATS = {
  square: { W: 1080, H: 1080, pad: 36, frame: 6, radius: 48, px: 60, py: 56, name: 130, where: 40, official: 56, ask: 44, mark: 52, url: 46, rowGap: 36 },
  tall: { W: 1080, H: 1920, pad: 36, frame: 6, radius: 48, px: 64, py: 72, name: 150, where: 40, official: 56, ask: 44, mark: 52, url: 46, rowGap: 56 }
} as const;
export type ShareFormat = keyof typeof FORMATS;

const DEVA = '"Anek Devanagari", "Anek Latin", sans-serif', LATIN = '"Anek Latin", "Anek Devanagari", sans-serif';
interface Line { text: string; weight: 500 | 600; family: string; size: number; lh: number }

async function outlineOf(p: Place): Promise<string | null> {
  if (p.level === 'state') return Object.values(GEO.districts).map(d => d.d).join('');
  if (p.level === 'district') return GEO.districts[p.id]?.d ?? null;
  if (p.level === 'taluka') return GEO.talukas[p.id]?.d ?? null;
  return p.parent ? (await loadVillagePaths(p.parent))[p.id] ?? null : null;
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Draws the image and returns it as a PNG. */
export async function makeShareImage(p: Place, format: ShareFormat): Promise<Blob> {
  const F = FORMATS[format];
  const named = !!(p.deva || p.romi);
  /* TODO(copy): from the design's list (revision 1) */
  const ask = factsOf(p.id)?.gazetteerDeva ? 'Konkani name: help us check it' : 'Konkani name: help us find it';
  const where = p.level === 'state' ? null : whereLabel(p) + ', Goa';
  const texts = [p.deva, p.romi, p.official, where, ask, SITE.deva, SITE.romi, 'khoim.in'].filter(Boolean).join(' ');
  await Promise.all([600, 500].flatMap(w => [document.fonts.load(`${w} 100px "Anek Devanagari"`, texts), document.fonts.load(`${w} 100px "Anek Latin"`, texts)]));

  const canvas = document.createElement('canvas');
  canvas.width = F.W; canvas.height = F.H;
  const ctx = canvas.getContext('2d')!;
  const font = (l: Pick<Line, 'weight' | 'family' | 'size'>) => `${l.weight} ${l.size}px ${l.family}`;
  const width = (l: Pick<Line, 'weight' | 'family' | 'size' | 'text'>) => { ctx.font = font(l); return ctx.measureText(l.text).width; };

  const box = { x: F.pad + F.frame + F.px, y: F.pad + F.frame + F.py, w: 0, h: 0 };
  box.w = F.W - 2 * box.x; box.h = F.H - 2 * box.y;
  const footH = F.mark * 1.5, gap = 10, room = box.h - footH - 2 * F.rowGap;
  const fit = (l: Omit<Line, 'lh'>, size: number) => Math.min(size, size * box.w / width({ ...l, size }));

  const big: Omit<Line, 'lh' | 'size'>[] = [
    p.deva ? { text: p.deva, weight: 600, family: DEVA } : null,
    p.romi ? { text: p.romi, weight: 600, family: LATIN } : null,
    !named ? { text: p.official, weight: 600, family: LATIN } : null
  ].filter((x): x is Omit<Line, 'lh' | 'size'> => !!x);
  let nameSize = Math.min(F.name, ...big.map(b => fit({ ...b, size: F.name }, F.name)));
  const linesAt = (size: number): Line[] => [
    where ? { text: where, weight: 600, family: LATIN, size: fit({ text: where, weight: 600, family: LATIN, size: F.where }, F.where), lh: 1.3 } : null,
    p.deva ? { text: p.deva, weight: 600, family: DEVA, size, lh: 1.5 } : null,
    p.romi ? { text: p.romi, weight: 600, family: LATIN, size, lh: 1.2 } : null,
    named ? { text: p.official, weight: 500, family: LATIN, size: fit({ text: p.official, weight: 500, family: LATIN, size: F.official }, F.official), lh: 1.3 }
      : { text: p.official, weight: 600, family: LATIN, size, lh: 1.2 },
    !named ? { text: ask, weight: 600, family: LATIN, size: fit({ text: ask, weight: 600, family: LATIN, size: F.ask }, F.ask), lh: 1.35 } : null
  ].filter((x): x is Line => !!x) as Line[];
  const heightOf = (ls: Line[]) => ls.reduce((t, l) => t + l.size * l.lh, 0) + gap * (ls.length - 1);
  for (let i = 0; i < 40 && heightOf(linesAt(nameSize)) > room - box.h / 4; i++) nameSize -= 2;
  const lines = linesAt(nameSize), namesH = heightOf(lines), shapeH = room - namesH;

  /* text sits on its baseline inside a CSS-like line box */
  const baselineOf = (l: Line, top: number) => {
    ctx.font = font(l);
    const m = ctx.measureText(l.text), asc = m.fontBoundingBoxAscent ?? l.size * 0.8, desc = m.fontBoundingBoxDescent ?? l.size * 0.25;
    return top + (l.lh * l.size - (asc + desc)) / 2 + asc;
  };
  const drawAt = (l: Line, x: number, base: number, align: CanvasTextAlign = 'left') => {
    ctx.font = font(l); ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.fillText(l.text, x, base);
  };
  const draw = (l: Line, x: number, top: number) => drawAt(l, x, baselineOf(l, top));

  const k = houseOf(p).key, bg = cssVar(`--house-${k}`), ink = cssVar(`--house-${k}-on`) || '#15130F';
  ctx.fillStyle = bg; ctx.fillRect(0, 0, F.W, F.H);
  ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = F.frame;
  ctx.beginPath(); ctx.roundRect(F.pad + F.frame / 2, F.pad + F.frame / 2, F.W - 2 * F.pad - F.frame, F.H - 2 * F.pad - F.frame, F.radius - F.frame / 2); ctx.stroke();

  /* the outline: square at the top left, 44% wide; tall centred with room around it */
  const d = await outlineOf(p);
  if (d) {
    const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    let b = [Infinity, Infinity, -Infinity, -Infinity];
    for (let i = 0; i < n.length - 1; i += 2) b = [Math.min(b[0], n[i]), Math.min(b[1], n[i + 1]), Math.max(b[2], n[i]), Math.max(b[3], n[i + 1])];
    b = [b[0] - 4, b[1] - 4, b[2] + 4, b[3] + 4];
    const [x, y, w, h] = format === 'square' ? [box.x, box.y, box.w * 0.44, shapeH] : [box.x + 80, box.y + 40, box.w - 160, shapeH - 80];
    if (w > 0 && h > 0) {
      const s = Math.min(w / (b[2] - b[0]), h / (b[3] - b[1]));
      const tx = x + (format === 'square' ? 0 : (w - (b[2] - b[0]) * s) / 2) - b[0] * s, ty = y + (h - (b[3] - b[1]) * s) / 2 - b[1] * s;
      ctx.save(); ctx.translate(tx, ty); ctx.scale(s, s);
      const path = new Path2D(d);
      ctx.fill(path); ctx.lineWidth = 1 / s; ctx.lineJoin = 'round'; ctx.stroke(path);
      ctx.restore();
    }
  }

  let top = box.y + shapeH + F.rowGap;
  for (const l of lines) { draw(l, box.x, top); top += l.size * l.lh + gap; }

  /* footer: the wordmark on the left, khoim.in on the right, on the Devanagari's baseline */
  const footTop = box.y + box.h - footH, mark: Line = { text: SITE.deva, weight: 600, family: DEVA, size: F.mark, lh: 1.5 };
  const base = baselineOf(mark, footTop);
  drawAt(mark, box.x, base);
  drawAt({ text: SITE.romi, weight: 600, family: LATIN, size: F.mark, lh: 1.5 }, box.x + width(mark) + F.mark * 0.3, base);
  drawAt({ text: 'khoim.in', weight: 600, family: LATIN, size: F.url, lh: 1.5 }, box.x + box.w, base, 'right');

  return new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('no image'))), 'image/png'));
}

/** Saves a blob as a file. */
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
}
