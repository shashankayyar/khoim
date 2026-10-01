/* Builds the site's data from the source files. Runs before every build and dev start.

   Sources (never edited by this script):
   - design/components/data/places.js       Goa, districts, talukas: every name form (Khoim, CC BY 4.0)
   - design/components/data/goaGeo.js       map shapes (derived from LGD boundaries, CC0)
   - data/villages_lgd.csv                  official LGD village list (GODL-India), plus reviewed Konkani names
   - data/names_districts_talukas.csv       cross-check for the 16 named units
   - data/town_outline_matches.csv          Survey of India outlines confirmed, by a person, to be an LGD town

   Output: src/data/generated/ (not committed).

   Rules this script enforces:
   - Villages are joined on LGD codes, never on names. A Survey of India outline is given to an LGD
     entry only through a row of data/town_outline_matches.csv that a person has confirmed.
   - A village belongs to the taluka the LGD list files it under, even where the boundary file draws it elsewhere.
   - No name is created, changed or transliterated here. A village gets a Konkani name only from a
     reviewed row of data/villages_lgd.csv (konkani_deva, reviewer and reviewed_on all filled).
   - The build stops with a plain message if the sources disagree with each other. */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLACES, HOUSE_OF } from '../design/components/data/places.js';
import { GOA_SIZE, DISTRICT_SHAPES, TALUKA_SHAPES, VILLAGES } from '../design/components/data/goaGeo.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/data/generated');

const problems = [];
const check = (ok, message) => { if (!ok) problems.push(message); };

/* Small CSV reader: handles quoted fields with commas and doubled quotes. */
function readCsv(file) {
  const text = readFileSync(join(root, file), 'utf8').replace(/^﻿/, '');
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); if (row.some(v => v !== '')) rows.push(row); }
  const [header, ...body] = rows;
  return body.map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const slugify = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* ---------- Goa, districts, talukas ---------- */

const placeById = Object.fromEntries(PLACES.map(p => [p.id, p]));
const districts = PLACES.filter(p => p.level === 'district');
const talukas = PLACES.filter(p => p.level === 'taluka');
check(PLACES.length === 16 && districts.length === 3 && talukas.length === 12, `Expected Goa, 3 districts and 12 talukas in places.js, found ${PLACES.length} places.`);
check(new Set(PLACES.map(p => p.id)).size === PLACES.length, 'places.js has a repeated id.');
for (const p of PLACES) {
  check(HOUSE_OF[p.id] === p.house, `House colour for ${p.id} differs between PLACES and HOUSE_OF.`);
  check(p.reviewed === false || p.reviewed === true, `${p.id} needs reviewed: true or false.`);
  if (p.level === 'taluka') check(TALUKA_SHAPES[p.id] && TALUKA_SHAPES[p.id].district === p.parent, `Taluka ${p.id} has no map shape, or its district differs from places.js.`);
  if (p.level === 'district') check(!!DISTRICT_SHAPES[p.id], `District ${p.id} has no map shape.`);
}

/* places.js must say the same as the names CSV. If they drift, someone edited one and not the other. */
const namesCsv = readCsv('data/names_districts_talukas.csv');
check(namesCsv.length === PLACES.length, `data/names_districts_talukas.csv has ${namesCsv.length} rows, places.js has ${PLACES.length}.`);
for (const row of namesCsv) {
  const p = placeById[row.id];
  if (!p) { check(false, `data/names_districts_talukas.csv has "${row.id}", which is not in places.js.`); continue; }
  const same = (a, b, what) => check((a || '') === (b || ''), `${row.id}: ${what} differs between places.js ("${a || ''}") and data/names_districts_talukas.csv ("${b || ''}").`);
  same(p.official, row.official, 'official name');
  same(p.lgd, row.lgd_code, 'LGD code');
  same(p.deva, row.konkani_deva, 'Devanagari name');
  same(p.romi, row.romi, 'Romi name');
  same(p.marathi, row.marathi, 'Marathi name');
  same(p.say, row.say_draft, 'say-it guide');
}

/* ---------- Villages ---------- */

const lgdRows = readCsv('data/villages_lgd.csv');
const lgdByCode = new Map(lgdRows.map(r => [r.lgd_code, r]));
check(lgdByCode.size === lgdRows.length, 'data/villages_lgd.csv has a repeated LGD code.');
const talukaIdByOfficial = Object.fromEntries(talukas.map(t => [t.official, t.id]));

/* Shapes. A town drawn in two parts (same code, e.g. 803252 and 803252-2) is one place with one combined outline. */
const shapes = new Map();
for (const v of VILLAGES) {
  const key = v.id.split('-')[0];
  const has = shapes.get(key);
  if (!has) { shapes.set(key, { ...v, id: key }); continue; }
  check(has.t === v.t && has.n === v.n, `Shape ${v.id} shares a code with ${has.id} but not its taluka or name.`);
  if (v.d.length > has.d.length) has.lp = v.lp; // label sits on the larger part
  has.d += v.d;
}

/* Survey of India outlines that a person has confirmed are the same place as an LGD entry with no outline. */
const outlineFor = new Map();
for (const m of readCsv('data/town_outline_matches.csv')) {
  const shape = shapes.get(m.outline_id), row = lgdByCode.get(m.lgd_code);
  const where = `data/town_outline_matches.csv, ${m.outline_id} to ${m.lgd_code}`;
  if (!shape || !row) { check(false, `${where}: ${!shape ? 'no outline with that id' : 'no LGD village with that code'}.`); continue; }
  check(shape.src === 'SOI', `${where}: the outline is not a Survey of India one.`);
  check(!shapes.has(m.lgd_code), `${where}: that LGD village already has its own outline.`);
  check(!!m.confirmed_by && !!m.confirmed_on, `${where}: confirmed_by and confirmed_on must be filled.`);
  check(talukaIdByOfficial[row.taluka] === shape.t, `${where}: the outline is in ${shape.t} but the LGD list says ${row.taluka}.`);
  check(!outlineFor.has(m.lgd_code), `${where}: this LGD code is matched twice.`);
  outlineFor.set(m.lgd_code, shape);
  shapes.delete(m.outline_id);
}

const villages = [];
const paths = Object.fromEntries(talukas.map(t => [t.id, {}]));
const mapTalukaDiffers = [];

/* 1. Every village in the LGD list, with its outline when the boundary file has one for that code. */
for (const row of [...lgdRows].sort((a, b) => Number(a.lgd_code) - Number(b.lgd_code))) {
  const listTaluka = talukaIdByOfficial[row.taluka];
  if (!listTaluka) { check(false, `LGD village ${row.lgd_code} is in taluka "${row.taluka}", which is not in places.js.`); continue; }
  check(placeById[placeById[listTaluka].parent].official === row.district, `LGD village ${row.lgd_code}: district "${row.district}" does not match places.js for ${row.taluka}.`);
  const own = shapes.get(row.lgd_code);
  check(!!own === (row.has_boundary === 'True'), `LGD village ${row.lgd_code} (${row.official}): has_boundary is ${row.has_boundary} but the map ${own ? 'has' : 'has no'} shape for it.`);
  if (own) check(own.src === 'LGD', `Shape ${row.lgd_code} is in the LGD list but marked ${own.src}.`);
  const shape = own || outlineFor.get(row.lgd_code);
  /* The LGD list decides the taluka. */
  const taluka = listTaluka;
  if (shape && shape.t !== listTaluka) mapTalukaDiffers.push(`${row.lgd_code} ${row.official}: filed under ${row.taluka} as the LGD list says; the boundary file draws it inside ${placeById[shape.t].official}`);
  const v = { id: 'v' + row.lgd_code, t: taluka, n: row.official, lgd: row.lgd_code };
  if (row.lgd_type === 'Ct') v.town = true;
  if (shape) { v.src = shape.src; v.lp = shape.lp; paths[taluka][v.id] = shape.d; shapes.delete(row.lgd_code); }
  /* A Konkani name appears only when a reviewer has signed the row. */
  if (row.konkani_deva && row.reviewer && row.reviewed_on) {
    v.deva = row.konkani_deva;
    if (row.romi) v.romi = row.romi;
    if (row.say) v.say = row.say;
    v.reviewer = row.reviewer;
    v.reviewedOn = row.reviewed_on;
  } else {
    check(!row.konkani_deva && !row.romi && !row.say, `LGD village ${row.lgd_code} (${row.official}) has a Konkani name, Romi name or say-it guide but no reviewer and date. Fill reviewer and reviewed_on, or clear the name.`);
  }
  villages.push(v);
}

/* 2. Outlines that are not in the LGD list. These come from Survey of India and keep its spelling. */
for (const shape of shapes.values()) {
  check(shape.src === 'SOI', `Shape ${shape.id} (${shape.n}) is marked LGD but its code is not in data/villages_lgd.csv.`);
  const v = { id: 'v' + shape.id, t: shape.t, n: shape.n, lgd: null, src: 'SOI', lp: shape.lp };
  if (shape.town) v.town = true;
  paths[shape.t][v.id] = shape.d;
  villages.push(v);
}

/* Page addresses. Unique inside a taluka. LGD villages come first, so they keep the plain name;
   a later clash gets its id added. */
const taken = new Set();
for (const v of villages) {
  const base = slugify(v.n);
  check(!!base, `Village ${v.id} has a name that makes an empty page address.`);
  let slug = base;
  if (taken.has(v.t + '/' + slug)) slug = base + '-' + v.id.slice(1);
  check(!taken.has(v.t + '/' + slug), `Two villages in ${v.t} end up with the page address "${slug}".`);
  taken.add(v.t + '/' + slug);
  v.slug = slug;
}

const withShape = villages.filter(v => v.src);
const counts = {
  lgd: lgdRows.length,
  lgdWithShape: villages.filter(v => v.lgd && v.src === 'LGD').length,
  lgdWithSoiShape: villages.filter(v => v.lgd && v.src === 'SOI').length,
  lgdWithoutShape: villages.filter(v => v.lgd && !v.src).length,
  soiOnly: villages.filter(v => !v.lgd).length,
  reviewed: villages.filter(v => v.deva).length
};
check(counts.lgd === 429, `Expected 429 LGD villages, found ${counts.lgd}. If the LGD list changed, update this check and CLAUDE.md.`);
check(VILLAGES.length === 384, `Expected 384 village shapes, found ${VILLAGES.length}.`);

if (problems.length) {
  console.error('\nKhoim data: the build stopped because the source files disagree.\n');
  for (const p of problems) console.error('  - ' + p);
  console.error('');
  process.exit(1);
}

/* ---------- Write ---------- */

const villageCount = Object.fromEntries(talukas.map(t => [t.id, withShape.filter(v => v.t === t.id).length]));
const places = PLACES.map(p => ({
  ...p,
  slug: p.level === 'state' ? '' : p.id,
  ...(p.level === 'taluka' ? { villageCount: villageCount[p.id] } : null)
}));

/* The box to zoom to when you go inside a taluka: its own outline, widened to take in any of its villages
   that the boundary file draws outside it. Only written when it differs from the taluka's box. */
function viewBox(talukaId) {
  const b = TALUKA_SHAPES[talukaId].b;
  const box = [...b];
  for (const d of Object.values(paths[talukaId])) {
    for (const m of d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)) {
      const x = Number(m[1]), y = Number(m[2]);
      if (x < box[0]) box[0] = x; if (y < box[1]) box[1] = y;
      if (x > box[2]) box[2] = x; if (y > box[3]) box[3] = y;
    }
  }
  return box.some((v, i) => Math.abs(v - b[i]) > 2) ? box.map(v => Math.round(v * 10) / 10) : null;
}

/* Districts are drawn from their talukas, so only the box and label point are kept for them. */
const geoBase = {
  size: GOA_SIZE,
  districts: Object.fromEntries(Object.entries(DISTRICT_SHAPES).map(([id, s]) => [id, { b: s.b, lp: s.lp }])),
  talukas: Object.fromEntries(talukas.map(t => {
    const s = TALUKA_SHAPES[t.id], view = viewBox(t.id);
    return [t.id, { district: s.district, d: s.d, b: s.b, lp: s.lp, ...(view ? { view } : null) }];
  }))
};

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'village-paths'), { recursive: true });
const write = (file, data) => writeFileSync(join(out, file), JSON.stringify(data));
write('places.json', places);
write('geo-base.json', geoBase);
write('villages.json', villages);
for (const t of talukas) write(`village-paths/${t.id}.json`, paths[t.id]);

console.log(`Khoim data: ${PLACES.length} named places, ${villages.length} villages ` +
  `(LGD list: ${counts.lgdWithShape} with an LGD outline, ${counts.lgdWithSoiShape} with a Survey of India outline, ${counts.lgdWithoutShape} with none; ` +
  `${counts.soiOnly} more from Survey of India maps only), ` +
  `${counts.reviewed} reviewed Konkani village names.`);
if (mapTalukaDiffers.length) {
  console.log(`Note: the boundary file draws ${mapTalukaDiffers.length} villages inside a different taluka than the LGD list files them under:`);
  for (const line of mapTalukaDiffers) console.log('  - ' + line);
}
