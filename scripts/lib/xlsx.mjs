/* Reads one sheet of an .xlsx file into rows of objects keyed by the header row, with no extra package:
   an .xlsx file is a zip of XML files. Enough for the review sheet (text and numbers, no formulas). */
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

function unzip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('not a zip file');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = new Map();
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + size);
    files.set(name, () => (method === 8 ? inflateRawSync(raw) : raw).toString('utf8'));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const unescape = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
const textOf = xml => [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(m => unescape(m[1])).join('');
const colIndex = ref => [...ref.replace(/\d+/g, '')].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;

export function readSheet(file, sheetName) {
  const zip = unzip(readFileSync(file));
  const get = name => { const f = zip.get(name); if (!f) throw new Error(`${file}: ${name} is missing`); return f(); };
  const shared = zip.has('xl/sharedStrings.xml') ? [...get('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => textOf(m[1])) : [];
  const workbook = get('xl/workbook.xml');
  const sheet = [...workbook.matchAll(/<sheet\b[^>]*>/g)].map(m => m[0]).find(s => s.includes(`name="${sheetName}"`));
  if (!sheet) throw new Error(`${file}: no sheet called "${sheetName}"`);
  const rid = /r:id="([^"]+)"/.exec(sheet)[1];
  const rel = [...get('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)].map(m => m[0]).find(r => r.includes(`Id="${rid}"`));
  const target = /Target="([^"]+)"/.exec(rel)[1].replace(/^\/?(xl\/)?/, '');
  const rows = [];
  for (const r of get('xl/' + target).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const c of r[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1], body = c[2] ?? '', ref = /r="([A-Z]+\d+)"/.exec(attrs)?.[1], type = /t="([^"]+)"/.exec(attrs)?.[1];
      const v = /<v>([\s\S]*?)<\/v>/.exec(body)?.[1];
      const value = type === 's' ? shared[+v] : type === 'inlineStr' ? textOf(body) : v != null ? unescape(v) : '';
      row[ref ? colIndex(ref) : row.length] = value ?? '';
    }
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.filter(r => r.some(v => v !== undefined && v !== '')).map(r => Object.fromEntries(header.map((h, i) => [h, String(r[i] ?? '').trim()])));
}
