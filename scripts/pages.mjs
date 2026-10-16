/* Which place pages search engines may index, and the day each page's data last changed (for sitemap.xml).

   The rule (docs/phase2-brief.md, A1, with Shashank's change of 16 October 2026):
   - Goa, the districts and the talukas are always indexable: they carry the lists of the places inside them.
   - A village page is indexable only if it has a reviewed Konkani name (Devanagari or Romi or both, with a
     reviewer), or at least two sourced facts beyond its official name. A Gazetteer-only form never counts
     (phase 2 rule 6). Sourced facts are counted by scripts/village-facts.mjs: each origin, each feast, product or
     monument, and a vaddo list. Census and LGD facts join them with A2.
   Every other page carries <meta name="robots" content="noindex"> and is left out of the sitemap. Nothing is ever
   blocked in robots.txt.

   A page's day is the latest change to its own rows; a taluka also takes its villages' days, a district its
   talukas', and the home page everything. */
import { parseCsv, readCsv } from './lib/csv.mjs';
import { openHistory } from './lib/history.mjs';
import { openProjection } from './lib/projection.mjs';
import { join } from 'node:path';

const latest = days => days.filter(Boolean).sort().at(-1) ?? null;

export async function pageIndex(root, { places, villages, geoBase, factCount = () => 0 }) {
  const history = openHistory(root);

  const placeDays = await history.moduleRowDays('design/components/data/places.js', m => m.PLACES.map(p => [p.id, p]));
  const csvRows = key => text => parseCsv(text).map(r => [r[key], r]);
  const lgdDays = history.rowDays('data/villages_lgd.csv', csvRows('lgd_code'));
  const outlineDays = history.rowDays('data/town_outline_matches.csv', csvRows('lgd_code'));
  const shapesDay = history.fileDay('design/components/data/goaGeo.js');

  const pages = {};
  for (const v of villages) {
    const named = !!(v.deva || v.romi) && !!v.reviewer;
    const facts = factCount(v.id);
    /* A Survey of India outline with no LGD row: its outline is its data. */
    const day = v.lgd ? latest([lgdDays.get(v.lgd), outlineDays.get(v.lgd)]) : shapesDay;
    pages[v.id] = { index: named || facts >= 2, lastmod: day };
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
  const other = { '/privacy/': history.fileDay('src/pages/privacy.astro') };
  return { pages: { places: pages, other }, summary };
}
