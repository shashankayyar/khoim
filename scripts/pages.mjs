/* Which place pages search engines may index, and the day each page's data last changed (for sitemap.xml).

   The rule (docs/phase2-brief.md, A1): a place page is indexable only if it has a Konkani name on file, or at
   least two sourced facts beyond its official name. Every other page carries <meta name="robots" content="noindex">
   and is left out of the sitemap. Nothing is ever blocked in robots.txt.
   - A village's Konkani name counts only when a reviewer has signed its row (Devanagari or Romi or both).
     A Gazetteer-only form never counts (phase 2 rule 6).
   - Goa, the districts and the talukas count the names in design/components/data/places.js, the researched
     set the site already uses in titles. Dharbandora has none.
   - Sourced facts: the `facts` of a district or taluka when places.js names its sources. Villages have none
     yet; data/build/village_facts.json adds them (phase 2, A2).

   A page's day is the latest change to its own rows; a taluka also takes its villages' days, a district its
   talukas', and the home page everything. */
import { parseCsv } from './lib/csv.mjs';
import { openHistory } from './lib/history.mjs';

const latest = days => days.filter(Boolean).sort().at(-1) ?? null;

export async function pageIndex(root, { places, villages }) {
  const history = openHistory(root);

  const placeDays = await history.moduleRowDays('design/components/data/places.js', m => m.PLACES.map(p => [p.id, p]));
  const csvRows = key => text => parseCsv(text).map(r => [r[key], r]);
  const lgdDays = history.rowDays('data/villages_lgd.csv', csvRows('lgd_code'));
  const outlineDays = history.rowDays('data/town_outline_matches.csv', csvRows('lgd_code'));
  const shapesDay = history.fileDay('design/components/data/goaGeo.js');

  const pages = {};
  for (const v of villages) {
    const named = !!(v.deva || v.romi) && !!v.reviewer;
    const facts = 0;
    /* A Survey of India outline with no LGD row: its outline is its data. */
    const day = v.lgd ? latest([lgdDays.get(v.lgd), outlineDays.get(v.lgd)]) : shapesDay;
    pages[v.id] = { index: named || facts >= 2, lastmod: day, why: named ? 'name' : facts >= 2 ? 'facts' : 'none' };
  }
  for (const p of places.filter(p => p.level === 'taluka')) {
    const named = !!(p.deva || p.romi);
    const facts = p.sources ? (p.facts ?? []).length : 0;
    const day = latest([placeDays.get(p.id), ...villages.filter(v => v.t === p.id).map(v => pages[v.id].lastmod)]);
    pages[p.id] = { index: named || facts >= 2, lastmod: day, why: named ? 'name' : facts >= 2 ? 'facts' : 'none' };
  }
  for (const p of places.filter(p => p.level === 'district')) {
    const named = !!(p.deva || p.romi);
    const facts = p.sources ? (p.facts ?? []).length : 0;
    const day = latest([placeDays.get(p.id), ...places.filter(t => t.parent === p.id).map(t => pages[t.id].lastmod)]);
    pages[p.id] = { index: named || facts >= 2, lastmod: day, why: named ? 'name' : facts >= 2 ? 'facts' : 'none' };
  }
  pages.goa = { index: true, lastmod: latest(Object.values(pages).map(x => x.lastmod).concat(placeDays.get('goa'))), why: 'home' };

  const list = Object.entries(pages);
  const yes = list.filter(([, x]) => x.index);
  const level = id => id === 'goa' ? 'home' : places.find(p => p.id === id)?.level ?? 'village';
  const count = l => yes.filter(([id]) => level(id) === l).length + ' of ' + list.filter(([id]) => level(id) === l).length;
  const summary = `Search engines: ${yes.length} of ${list.length} place pages can be indexed ` +
    `(home ${count('home')}, districts ${count('district')}, talukas ${count('taluka')}, villages ${count('village')}).` +
    (history.ok ? '' : ` Sitemap dates left out: ${history.why}.`);
  const left = list.filter(([id, x]) => !x.index && level(id) !== 'village').map(([id]) => id);

  for (const x of Object.values(pages)) delete x.why;
  /* Pages that are not places, listed in the sitemap with their own file's day. */
  const other = { '/privacy/': history.fileDay('src/pages/privacy.astro') };
  return { pages: { places: pages, other }, summary, notIndexed: left };
}
