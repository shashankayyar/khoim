/* What each village's sheet shows beyond its names (phase 2): where the name comes from, how sources have spelled
   it, its vaddos, what it is known for, and the sources behind all of it. Read from data/credited/ and the Gazetteer
   columns of data/village_names_review.xlsx; written to src/data/generated/village-facts.json, keyed by place id.

   Rules (docs/phase2-brief.md):
   - Only rows a person has confirmed (checked=yes), joined on the LGD code. Nothing is matched by name here.
   - Facts in our words, each with its source's own hedge and a credit: author, publication, date and link.
     A missing link is shown as "(link to add)", never invented.
   - Dates that move are stored as rules and shown with the next date beside them (worked out in the browser).
     Lunar dates are never turned into a day; only their months are shown.
   - The Gazetteer's Devanagari is unreviewed. It goes only to the village sheet, labelled (rule 6), never into
     p.deva, titles, labels or link previews. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readCsv } from './lib/csv.mjs';
import { readSheet } from './lib/xlsx.mjs';

const GAZETTEER = 'Gazetteer of the Union Territory Goa, Daman and Diu, Part 1, 1979';
const GAZETTEER_URL = 'https://archive.org/details/dli.ministry.08183';
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];
/* Lunar months (amanta, as reckoned in Goa) and the Gregorian months each one runs across. */
const LUNAR = { chaitra: [3, 4], vaishakh: [4, 5], jyeshtha: [5, 6], ashadh: [6, 7], shravan: [7, 8], bhadrapad: [8, 9], ashwin: [9, 10], kartik: [10, 11], margashirsha: [11, 12], paush: [12, 1], magh: [1, 2], phalgun: [2, 3] };

const link = url => url ? encodeURI(decodeURI(url)) : null;
const sentence = s => s.charAt(0).toUpperCase() + s.slice(1);
/* "2026-02-21" as "21 Feb 2026"; a year stays a year. */
const shortDate = d => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d); return m ? `${+m[3]} ${SHORT_MONTHS[+m[2] - 1]} ${m[1]}` : d; };

/** Lunar month names as sources spell them ("Ashvin", "Ashvina", "Kartika", "Magha", "Pausha", "Chaitri"). */
const LUNAR_ALIASES = { ashvin: 'ashwin', ashvina: 'ashwin', chaitri: 'chaitra', jaishtha: 'jyeshtha', ashadha: 'ashadh', bhadrapada: 'bhadrapad' };
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** A feast rule as data the browser can turn into a date or months. Rules are kept as their source states them
    ("Vaishakha Shuddha Panchami", "Fr-Kt" read as "Kartika", "second Monday after Easter", "In October").
    Returns null when the rule names no month (a tithi alone, "Saptami to Navami"): the rule is then shown as
    written, with no month and no date. Lunar dates are never turned into a day. */
export function parseRule(rule, calendar) {
  const r = rule.trim().toLowerCase().replace(/[,.]/g, ' ').replace(/[-/]/g, ' ').replace(/\s+/g, ' ');
  if (!r) return null;
  if (calendar === 'lunar') {
    const words = r.split(/[\s\-/]+/).map(w => LUNAR_ALIASES[w] ?? w);
    const months = [...new Set(words.map(w => Object.keys(LUNAR).find(m => w.startsWith(m))).filter(Boolean))];
    if (!months.length) return null;
    /* "Magha and Phalguna": both; "Magha Krishna 12 to Phalgun Shuddha 2": the month it starts in */
    const use = / and /.test(r) ? months : months.slice(0, 1);
    return { lunar: true, months: [...new Set(use.flatMap(m => LUNAR[m]))] };
  }
  /* two dates ("Jul 16, 4th Sun of Jan"): the months of both, no single day */
  const parts = rule.split(',').map(x => x.trim().toLowerCase().replace(/[.]/g, ' ').replace(/[-/]/g, ' ').replace(/\s+/g, ' ')).filter(Boolean);
  if (parts.length > 1) {
    const each = parts.map(gregorian);
    if (each.every(Boolean)) return { months: [...new Set(each.flatMap(w => ('months' in w ? w.months : 'month' in w ? [w.month] : [])))] };
  }
  return gregorian(r);
}

/* Short forms in the parish directory: "2nd Sun of May", "Sun after Jul 26", "Last Tue of Oct", "Sept 8". */
const SHORT = { sun: 'sunday', mon: 'monday', tue: 'tuesday', tues: 'tuesday', wed: 'wednesday', thu: 'thursday', thur: 'thursday', fri: 'friday', sat: 'saturday',
  jan: 'january', feb: 'february', mar: 'march', apr: 'april', jun: 'june', jul: 'july', aug: 'august', sep: 'september', sept: 'september', oct: 'october', nov: 'november', dec: 'december',
  '1st': 'first', '2nd': 'second', '3rd': 'third', '4th': 'fourth', '5th': 'fifth' };
const WD = '(sunday|monday|tuesday|wednesday|thursday|friday|saturday)', MO = `(${MONTHS.join('|')})`, ORD = '(first|second|third|fourth|fifth)';

function gregorian(raw) {
  const r = raw.split(' ').map(w => SHORT[w] ?? w).join(' ');
  let m;
  if (r === 'pentecost') return { easterDays: 49 };
  if ((m = new RegExp(`^(?:${ORD} )?${WD} after easter$`).exec(r))) {
    const n = m[1] ? ORDINALS.indexOf(m[1]) + 1 : 1, wd = WEEKDAYS.indexOf(m[2]);
    return wd === 6 ? { easterSaturday: n } : { easterDays: (wd || 7) + 7 * (n - 1) };
  }
  if ((m = new RegExp(`\\b${ORD} ${WD} (?:of|in) (?:the month of )?${MO}\\b`).exec(r))) return { month: MONTHS.indexOf(m[3]) + 1, nth: ORDINALS.indexOf(m[1]) + 1, weekday: WEEKDAYS.indexOf(m[2]) };
  if ((m = new RegExp(`\\blast ${WD} (?:of|in) (?:the month of )?${MO}\\b`).exec(r))) return { month: MONTHS.indexOf(m[2]) + 1, lastWeekday: WEEKDAYS.indexOf(m[1]) };
  if ((m = new RegExp(`^${WD} after ${MO} (\\d{1,2})$`).exec(r))) return { month: MONTHS.indexOf(m[2]) + 1, day: +m[3], after: WEEKDAYS.indexOf(m[1]) };
  /* anything else that counts from Easter, Lent or Carnival ("Sun before Carnival") is shown as written */
  if (/easter|lent|carnival|ash wednesday|ash wed/.test(r)) return null;
  const days = [...r.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? ${MO}\\b|\\b${MO} (\\d{1,2})(?:st|nd|rd|th)?\\b`, 'g'))];
  const months = MONTHS.map((x, i) => (new RegExp(`\\b${x}\\b`).test(r) ? i + 1 : 0)).filter(Boolean);
  if (days.length === 1 && months.length === 1) {
    const d = days[0], month = MONTHS.indexOf(d[2] ?? d[3]) + 1, day = +(d[1] ?? d[4]);
    const near = new RegExp(`${WD} (?:closest|nearest) to`).exec(r);
    return near ? { month, day, nearest: WEEKDAYS.indexOf(near[1]) } : { month, day };
  }
  /* a month and no day ("October", "2nd week of May", "April-May", "December/January"), or two dates: months only */
  if (months.length) return { months };
  return null;
}

export function villageFacts(root, { lgdCodes, check }) {
  const facts = {};
  const of = code => (facts['v' + code] ??= {});
  const ok = r => r.checked === 'yes' && r.village_code && lgdCodes.has(r.village_code);
  const csv = name => readCsv(join(root, 'data/credited', name));

  /* Where the name comes from. Our summary, the source's hedge, the credit. */
  for (const r of csv('origins_luis_2026.csv')) {
    if (!ok(r)) continue;
    /* "Dr Alvarinho J. Luis, The Goan, 21 Feb 2026"; "Alfred Bragança, 1964"; the Gazetteer by name and chapter. */
    const credit = r.author ? [r.author, r.publication.replace(/ \(.*\)$/, ''), shortDate(r.date)].filter(Boolean).join(', ') : `${GAZETTEER}${r.part ? ', ' + r.part : ''}`;
    const f = of(r.village_code);
    (f.meaning ??= { differ: false, readings: [] }).readings.push({ text: r.origin, hedge: r.hedge && r.hedge !== 'stated' ? r.hedge : null, credit, url: link(r.url) });
  }
  /* "Sources differ" only when separate sources give different readings; one source alone never claims agreement. */
  for (const f of Object.values(facts)) {
    const rs = f.meaning?.readings ?? [];
    if (new Set(rs.map(x => x.credit)).size > 1 && new Set(rs.map(x => x.text)).size > 1) f.meaning.differ = true;
  }

  /* Vaddos: a list, never shapes. */
  for (const r of csv('vaddos.csv')) {
    if (!ok(r)) continue;
    const f = of(r.village_code);
    (f.vaddos ??= { source: r.source, url: link(r.source_url), items: [] }).items.push(r.vaddo);
  }

  /* Known for: parish feasts, feasts and zatras, GI products, protected monuments. */
  const known = (code, item) => (of(code).knownFor ??= []).push(item);
  for (const r of csv('parishes.csv')) {
    if (!ok(r)) continue;
    try { const when = parseRule(r.feast_rule, 'gregorian'); known(r.village_code, { kind: 'parish', icon: 'church', title: `${r.patron} parish`, detail: r.feast_rule ? 'Parish feast' : null, ...(when ? { when } : {}), ...(r.feast_rule ? { whenText: sentence(r.feast_rule) } : {}), source: r.source, url: link(r.source_url) }); }
    catch (e) { check(false, `data/credited/parishes.csv, ${r.parish}: ${e.message}.`); }
  }
  for (const r of csv('feasts.csv')) {
    if (!ok(r)) continue;
    try { const when = parseRule(r.rule, r.calendar); known(r.village_code, { kind: r.kind || 'zatra', icon: r.icon || 'flame', title: r.name, ...(when ? { when } : {}), ...(r.rule ? { whenText: sentence(r.rule) } : {}), source: r.source, url: link(r.source_url) }); }
    catch (e) { check(false, `data/credited/feasts.csv, ${r.name}: ${e.message}.`); }
  }
  for (const r of csv('gi_products.csv')) {
    if (!ok(r)) continue;
    known(r.village_code, { kind: 'gi', icon: /banana/i.test(r.product) ? 'banana' : 'sprout', title: r.product, detail: `GI no. ${r.app_no}`, source: r.source, url: link(r.source_url) });
  }
  /* Landmarks: protected monuments (ASI, Government of Goa) and the temples, churches, forts and springs the 1979
     Gazetteer names village by village. Names as the source gives them. */
  const LANDMARK_ICON = { fort: 'castle', church: 'church', chapel: 'church', waterfall: 'waves', spring: 'waves' };
  for (const r of csv('monuments.csv')) {
    if (!ok(r)) continue;
    const page = r.page ? `, p. ${r.page}` : '';
    known(r.village_code, { kind: 'landmark', icon: LANDMARK_ICON[r.type] ?? 'landmark', title: r.name, detail: r.protection || null, source: r.source.split('; ')[0] + page, url: link(r.source_url) });
  }

  /* Videos, credited to the channel. Shown as a still (public/video-thumbs/, fetched once and kept here) until
     someone taps play; nothing loads from YouTube before that. A row may point at a page without an LGD code
     (the Mapusa town page) through place_id. */
  for (const r of csv('videos_villages_of_goa.csv')) {
    const id = r.village_code ? 'v' + r.village_code : r.place_id;
    if (r.checked !== 'yes' || !id || (r.village_code && !lgdCodes.has(r.village_code))) continue;
    check(existsSync(join(root, 'public/video-thumbs', r.video_id + '.jpg')), `data/credited/videos_villages_of_goa.csv: no still for video ${r.video_id} in public/video-thumbs/.`);
    (facts[id] ??= {}).videos ??= [];
    facts[id].videos.push({ id: r.video_id, title: r.title, channel: r.channel, channelUrl: r.channel_url, url: r.url, uploaded: r.uploaded });
  }

  /* The Gazetteer's 1970 spelling list, transcribed by hand into the review sheet. */
  for (const r of readSheet(join(root, 'data/village_names_review.xlsx'), 'Review')) {
    const code = String(r['LGD code']).replace(/\.0$/, '');
    if (!lgdCodes.has(code)) continue;
    const items = [
      r.gazetteer_government && { form: r.gazetteer_government, source: 'Government spelling' },
      r.gazetteer_soi && { form: r.gazetteer_soi, source: 'Survey of India spelling' },
      r.advisory_body_form && { form: r.advisory_body_form, source: 'Advisory Body spelling' },
      r.gazetteer_devanagari && { form: r.gazetteer_devanagari, source: 'Devanagari', lang: 'gom', note: 'pending review' }
    ].filter(Boolean);
    if (!items.length) continue;
    /* the same form from two columns shows once, with both sources (phase 4, B4: Aldona showed "Aldona" twice) */
    const merged = [];
    for (const it of items) {
      const same = merged.find(m => m.form === it.form && m.lang === it.lang);
      if (same) same.source += ' and ' + it.source; else merged.push({ ...it });
    }
    const f = of(code);
    f.spellings = { items: merged, page: r.gazetteer_page || null };
    if (r.gazetteer_devanagari) f.gazetteerDeva = r.gazetteer_devanagari;
  }

  /* Sources, each once, with its link. */
  for (const f of Object.values(facts)) {
    const list = [], seen = new Set();
    const add = (title, url) => { if (title && !seen.has(title)) { seen.add(title); list.push({ title, url: url ?? null }); } };
    if (f.spellings) add(GAZETTEER, GAZETTEER_URL);
    for (const r of f.meaning?.readings ?? []) add(r.credit.startsWith(GAZETTEER) ? GAZETTEER : r.credit, r.url);
    if (f.vaddos) add(f.vaddos.source, f.vaddos.url);
    for (const k of f.knownFor ?? []) add(k.source, k.url);
    for (const v of f.videos ?? []) add(`${v.channel}, ${v.title}`, v.url);
    f.sources = list;
  }
  return facts;
}

/** Sourced facts beyond the official name, for the indexing rule (A1). A Gazetteer form does not count (rule 6). */
export const sourcedFactCount = f => f ? (f.meaning?.readings.length ?? 0) + (f.knownFor?.length ?? 0) + (f.vaddos ? 1 : 0) : 0;
