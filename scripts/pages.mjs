/* Which place pages search engines may index, and the day each page's data last changed (for sitemap.xml).

   The rule (docs/phase2-brief.md, A1, with Shashank's change of 16 October 2026):
   - Goa, the districts and the talukas are always indexable: they carry the lists of the places inside them.
   - A village or town page is indexable if it has a reviewed Konkani name (Devanagari or Romi or both, with a
     reviewer), or at least one sourced fact beyond its official name (phase 4, B7): a meaning, feast, parish,
     landmark, product, video, vaddo list or Gazetteer spelling. Sourced facts are counted by
     scripts/village-facts.mjs. How a Gazetteer form is shown still follows phase 2 rule 6.
   Every other page carries <meta name="robots" content="noindex"> and is left out of the sitemap. Nothing is ever
   blocked in robots.txt.

   A page's day is the latest change to its own rows (the LGD list, its credited facts, its Gazetteer spellings);
   a taluka also takes its villages' days, a district its
   talukas', and the home page everything. */
import { parseCsv, readCsv } from './lib/csv.mjs';
import { openHistory } from './lib/history.mjs';
import { openProjection } from './lib/projection.mjs';
import { readSheet } from './lib/xlsx.mjs';
import { join } from 'node:path';

const latest = days => days.filter(Boolean).sort().at(-1) ?? null;

export async function pageIndex(root, { places, villages, geoBase, factCount = () => 0 }) {
  const history = openHistory(root);

  const placeDays = await history.moduleRowDays('design/components/data/places.js', m => m.PLACES.map(p => [p.id, p]));
  const csvRows = key => text => parseCsv(text).map(r => [r[key], r]);
  const lgdDays = history.rowDays('data/villages_lgd.csv', csvRows('lgd_code'));
  const outlineDays = history.rowDays('data/town_outline_matches.csv', csvRows('lgd_code'));
  const shapesDay = history.fileDay('design/components/data/goaGeo.js');
  /* Phase 4, B7: a village's day also takes its credited facts (every row of data/credited/ with its code; a row is
     known by its code and its own fields, so each row's last change counts) and its Gazetteer spellings in the review
     sheet. A row that is removed leaves no day behind. */
  const creditedDays = new Map();
  for (const file of ['origins_luis_2026.csv', 'feasts.csv', 'parishes.csv', 'monuments.csv', 'gi_products.csv', 'videos_villages_of_goa.csv', 'vaddos.csv']) {
    const days = history.rowDays('data/credited/' + file, text => parseCsv(text).filter(r => r.village_code || r.place_id).map(r => [(r.village_code ? 'v' + r.village_code : r.place_id) + '|' + JSON.stringify(Object.values(r)), r]));
    for (const [k, day] of days) { const id = k.split('|')[0]; if (!creditedDays.has(id) || creditedDays.get(id) < day) creditedDays.set(id, day); }
  }
  const GAZ = ['gazetteer_government', 'gazetteer_soi', 'advisory_body_form', 'gazetteer_devanagari', 'gazetteer_page'];
  const sheetDays = history.binaryRowDays('data/village_names_review.xlsx', path => readSheet(path, 'Review').map(r => ['v' + String(r['LGD code']).replace(/\.0$/, ''), Object.fromEntries(GAZ.map(c => [c, r[c] ?? '']))]));

  const pages = {};
  for (const v of villages) {
    const named = !!(v.deva || v.romi) && !!v.reviewer;
    const facts = factCount(v.id);
    /* A Survey of India outline with no LGD row: its outline is its data. */
    const day = latest([v.lgd ? latest([lgdDays.get(v.lgd), outlineDays.get(v.lgd)]) : shapesDay, creditedDays.get(v.id), sheetDays.get(v.id)]);
    /* phase 4, B7: one sourced fact beyond the official name is enough */
    pages[v.id] = { index: named || facts >= 1, lastmod: day };
  }
  for (const p of places.filter(p => p.level === 'taluka')) {
    const day = latest([placeDays.get(p.id), ...villages.filter(v => v.t === p.id).map(v => pages[v.id].lastmod)]);
    pages[p.id] = { index: true, lastmod: day };
  }
  for (const p of places.filter(p => p.level === 'district')) {
    const day = latest([placeDays.get(p.id), ...places.filter(t => t.parent === p.id).map(t => pages[t.id].lastmod)]);
    pages[p.id] = { index: true, lastmod: day };
  }
  pages.goa = { index: true, lastmod: latest(Object.values(pages).map(x => x.lastmod).concat(placeDays.get('goa'))) };

  const list = Object.entries(pages);
  const yes = list.filter(([, x]) => x.index);
  const level = id => id === 'goa' ? 'home' : places.find(p => p.id === id)?.level ?? 'village';
  const count = l => yes.filter(([id]) => level(id) === l).length + ' of ' + list.filter(([id]) => level(id) === l).length;
  const summary = `Search engines: ${yes.length} of ${list.length} place pages can be indexed ` +
    `(home ${count('home')}, districts ${count('district')}, talukas ${count('taluka')}, villages ${count('village')}).` +
    (history.ok ? '' : ` Sitemap dates left out: ${history.why}.`);
  /* For each page's structured data: a point from our own shapes (the label point, which always lies inside the
     outline), and the Wikidata item for Goa, the districts and the talukas. Villages without an outline get no point. */
  const { toLatLon } = openProjection(root);
  const qid = Object.fromEntries(readCsv(join(root, 'data/credited/wikidata_units.csv')).map(r => [r.place_id, r.qid]));
  for (const v of villages) if (v.lp) pages[v.id].geo = toLatLon(v.lp);
  for (const p of places) {
    const lp = p.level === 'taluka' ? geoBase.talukas[p.id]?.lp : p.level === 'district' ? geoBase.districts[p.id]?.lp : null;
    if (lp) pages[p.id].geo = toLatLon(lp);
    if (qid[p.id]) pages[p.id].qid = qid[p.id];
  }

  /* Pages that are not places, listed in the sitemap with their own file's day. */
  const other = {
    '/privacy/': history.fileDay('src/pages/privacy.astro'),
    '/contributors/': latest([history.fileDay('src/pages/contributors.astro'), history.fileDay('data/villages_lgd.csv')]),
    /* phase 4, B5: the pages listing every feast and every name's origin */
    '/feasts/': latest(['src/pages/feasts.astro', 'data/credited/feasts.csv', 'data/credited/parishes.csv'].map(f => history.fileDay(f))),
    '/meanings/': latest(['src/pages/meanings.astro', 'data/credited/origins_luis_2026.csv'].map(f => history.fileDay(f)))
  };
  return { pages: { places: pages, other }, summary };
}
