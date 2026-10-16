/* A small PNG writer for the share images. Each card is drawn in two colours, the house colour and its ink, plus
   the blends between them along the edges of letters and shapes. So instead of full colour, each pixel is stored
   as one of 16 steps between the two: an indexed PNG, 4 bits a pixel, a fraction of the size, with no visible
   change. Built on Node's own zlib; no extra package. */
import { crc32, deflateSync } from 'node:zlib';

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const rgb = hex => { const h = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };

/** RGBA pixels (from resvg) drawn in `bg` and `ink` only, as an indexed PNG of 16 steps between them. */
export function twoTonePng(pixels, width, height, bg, ink, steps = 16) {
  const a = rgb(bg), b = rgb(ink), d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] || 1;
  const palette = Buffer.alloc(steps * 3);
  for (let i = 0; i < steps; i++) for (let c = 0; c < 3; c++) palette[i * 3 + c] = Math.round(a[c] + d[c] * i / (steps - 1));
  const rowBytes = Math.ceil(width / 2), raw = Buffer.alloc((rowBytes + 1) * height);
  for (let y = 0; y < height; y++) {
    const o = y * (rowBytes + 1);
    raw[o] = 0;
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4;
      const t = ((pixels[p] - a[0]) * d[0] + (pixels[p + 1] - a[1]) * d[1] + (pixels[p + 2] - a[2]) * d[2]) / dd;
      const idx = Math.max(0, Math.min(steps - 1, Math.round(t * (steps - 1))));
      raw[o + 1 + (x >> 1)] |= x & 1 ? idx : idx << 4;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4); ihdr[8] = 4; ihdr[9] = 3; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('PLTE', palette), chunk('IDAT', deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}
