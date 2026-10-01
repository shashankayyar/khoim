/* A list of every page, for search engines. */
import type { APIRoute } from 'astro';
import villagesJson from '../data/generated/villages.json';
import { PLACES, allVillages, pathOf, registerVillages } from '../data/khoim';
import type { RawVillage } from '../data/types';

export const GET: APIRoute = ({ site }) => {
  registerVillages(villagesJson as unknown as RawVillage[]);
  const urls = [...PLACES, ...allVillages()].map(p => new URL(pathOf(p), site).href);
  urls.push(new URL('/privacy/', site).href);
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
