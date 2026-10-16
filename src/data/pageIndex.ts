/* Which pages search engines may index, when each page's data last changed, and each place's point and
   Wikidata item. Written by scripts/pages.mjs; read only while the pages are built, never sent to the browser. */
import pagesJson from './generated/pages.json';
import type { PageIndex } from './types';

export const PAGE_INDEX = pagesJson as unknown as PageIndex;
