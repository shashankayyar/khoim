/* Turns a line of text into SVG outlines, shaped by HarfBuzz: the same shaping engine browsers use, so
   Devanagari conjuncts and vowel signs join as they do on the site (साश्टी, म्हापशें, धारबांदोडें).
   The image renderer then only draws shapes, never text. */
import { readFileSync } from 'node:fs';
import * as hb from 'harfbuzzjs';

const fonts = new Map();

/** Loads one font file (a static TTF). Glyph outlines are cached, since the same letters repeat across pages. */
export function loadFont(file) {
  if (fonts.has(file)) return fonts.get(file);
  const blob = new hb.Blob(readFileSync(file));
  const face = new hb.Face(blob, 0);
  const font = new hb.Font(face);
  const ext = font.hExtents();
  const entry = { font, upem: face.upem, ascender: ext.ascender, descender: ext.descender, paths: new Map() };
  fonts.set(file, entry);
  return entry;
}

/** Shapes `text` at `size` px. Returns its width and an SVG fragment whose origin is the start of the baseline. */
export function shapeLine(fontFile, text, size) {
  const f = loadFont(fontFile);
  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hb.shape(f.font, buffer);
  const infos = buffer.getGlyphInfos(), positions = buffer.getGlyphPositions();
  const s = size / f.upem;
  let x = 0, out = '';
  for (let i = 0; i < infos.length; i++) {
    const gid = infos[i].codepoint, p = positions[i];
    if (gid === 0) throw new Error(`The font ${fontFile} has no letter for part of "${text}". Add the missing subset to scripts/og/fonts/.`);
    if (!f.paths.has(gid)) f.paths.set(gid, f.font.glyphToPath(gid));
    const d = f.paths.get(gid);
    if (d) out += `<path transform="translate(${((x + p.xOffset) * s).toFixed(2)} ${(-p.yOffset * s).toFixed(2)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})" d="${d}"/>`;
    x += p.xAdvance;
  }
  return { width: x * s, svg: out };
}

/** Where the baseline sits inside a CSS line box of `lineHeight` (a multiple of `size`), from the box's top. */
export function baselineIn(fontFile, size, lineHeight) {
  const f = loadFont(fontFile), s = size / f.upem;
  return (lineHeight * size - (f.ascender - f.descender) * s) / 2 + f.ascender * s;
}
