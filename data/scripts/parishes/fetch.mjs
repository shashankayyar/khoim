/* Fetches the Archdiocese of Goa and Daman's parish list (https://archgoadaman.com/parishes/: church, location,
   deanery, year) into data/raw/ (phase 4, A3). Run: node data/scripts/parishes/fetch.mjs
   The UCA News parish directory (https://www.ucanews.com/directory/parishes-stations/india-goa-daman/18: church,
   address, principal patron, feast day, district) refuses scripts with a bot check; its 167 entries were read in a
   browser on 19 October 2026, each entry's fields as the page gives them, into data/raw/parishes_ucanews_2026-10-19.tsv. */
import { writeFileSync } from 'node:fs';
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const day = new Date().toISOString().slice(0, 10);

const arch = await (await fetch('https://archgoadaman.com/parishes/')).text();
const rows = [...arch.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c => strip(c[1]))).filter(r => r.length >= 4);
writeFileSync(`data/raw/parishes_archdiocese_${day}.tsv`, ['church\tlocation\tdeanery\testablished', ...rows.map(r => r.slice(0, 4).join('\t'))].join('\n') + '\n');
console.log('Archdiocese:', rows.length);

