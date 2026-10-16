/* A list of the pages search engines may index, each with the day its data last changed. Pages without a Konkani
   name or two sourced facts are left out (they carry noindex); scripts/pages.mjs decides which. */
import type { APIRoute } from 'astro';
import { PAGE_INDEX } from '../data/pageIndex';
import villagesJson from '../data/generated/villages.json';
import { PLACES, allVillages, pathOf, registerVillages } from '../data/khoim';
import type { RawVillage } from '../data/types';

export const GET: APIRoute = ({ site }) => {
  registerVillages(villagesJson as unknown as RawVillage[]);
  const index = PAGE_INDEX;
  const urls: [string, string | null][] = [...PLACES, ...allVillages()]
    .filter(p => index.places[p.id]?.index)
    .map(p => [pathOf(p), index.places[p.id].lastmod]);
  for (const [path, day] of Object.entries(index.other)) urls.push([path, day]);
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(([path, day]) => `  <url><loc>${new URL(path, site).href}</loc>${day ? `<lastmod>${day}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
