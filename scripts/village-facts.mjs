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

/** A feast rule as data the browser can turn into the next date. Throws on a rule it cannot read. */
export function parseRule(rule, calendar) {
  const r = rule.trim().toLowerCase();
  if (calendar === 'lunar') {
    const month = Object.keys(LUNAR).find(m => r.startsWith(m));
    if (!month) throw new Error(`lunar month not recognised in "${rule}"`);
    return { lunar: true, months: LUNAR[month] };
  }
  let m = /^(first|second|third|fourth|fifth) saturday after easter$/.exec(r);
  if (m) return { easterSaturday: ORDINALS.indexOf(m[1]) + 1 };
  m = /^(\d{1,2}) ([a-z]+)$/.exec(r);
  if (m && MONTHS.includes(m[2])) return { month: MONTHS.indexOf(m[2]) + 1, day: +m[1] };
  throw new Error(`feast rule not recognised: "${rule}"`);
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
    try { known(r.village_code, { kind: 'parish', icon: 'church', title: `${r.patron} parish`, detail: 'Parish feast', when: parseRule(r.feast_rule, 'gregorian'), whenText: sentence(r.feast_rule), source: r.source, url: link(r.source_url) }); }
    catch (e) { check(false, `data/credited/parishes.csv, ${r.parish}: ${e.message}.`); }
  }
  for (const r of csv('feasts.csv')) {
    if (!ok(r)) continue;
    try { known(r.village_code, { kind: r.kind || 'zatra', icon: r.icon || 'flame', title: r.name, when: parseRule(r.rule, r.calendar), whenText: sentence(r.rule), source: r.source, url: link(r.source_url) }); }
    catch (e) { check(false, `data/credited/feasts.csv, ${r.name}: ${e.message}.`); }
  }
  for (const r of csv('gi_products.csv')) {
    if (!ok(r)) continue;
    known(r.village_code, { kind: 'gi', icon: /banana/i.test(r.product) ? 'banana' : 'sprout', title: r.product, detail: `GI no. ${r.app_no}`, source: r.source, url: link(r.source_url) });
  }
  for (const r of csv('monuments.csv')) {
    if (!r.village_code || !lgdCodes.has(r.village_code)) continue;
    known(r.village_code, { kind: 'monument', icon: 'castle', title: r.name, detail: r.protection || null, source: r.protection || 'Protected monument', url: link(r.source_url) });
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
    const f = of(code);
    f.spellings = { items, page: r.gazetteer_page || null };
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
    f.sources = list;
  }
  return facts;
}

/** Sourced facts beyond the official name, for the indexing rule (A1). A Gazetteer form does not count (rule 6). */
export const sourcedFactCount = f => f ? (f.meaning?.readings.length ?? 0) + (f.knownFor?.length ?? 0) + (f.vaddos ? 1 : 0) : 0;
