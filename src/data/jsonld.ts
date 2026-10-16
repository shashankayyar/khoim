/* Structured data for search engines (docs/phase2-brief.md, A6). One block per page:
   - the home page: WebSite, named Khoim;
   - a village: Place; a district or taluka: AdministrativeArea;
   - every place page also gets a BreadcrumbList.
   alternateName carries only names on file (reviewed village names, the researched district and taluka names),
   tagged gom-Deva and gom-Latn. geo is a point inside our own outline (scripts/pages.mjs); sameAs is Wikidata
   where we hold a checked ID (data/credited/wikidata_units.csv). No hreflang. */
import { SITE } from './site';
import { getPlace, pathOf, trailOf } from './khoim';
import type { PageIndex, Place } from './types';

type Json = Record<string, unknown>;

export function structuredData(p: Place, index: PageIndex, site: URL): Json[] {
  const url = (q: Place) => new URL(pathOf(q), site).href;
  if (p.level === 'state') {
    return [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.romi, alternateName: { '@value': SITE.deva, '@language': 'gom-Deva' }, url: url(p) }];
  }
  const facts = index.places[p.id] ?? { index: false, lastmod: null };
  const parent = getPlace(p.parent);
  const alternateName = [
    p.deva && { '@value': p.deva, '@language': 'gom-Deva' },
    p.romi && { '@value': p.romi, '@language': 'gom-Latn' }
  ].filter(Boolean);
  const place: Json = {
    '@context': 'https://schema.org',
    '@type': p.level === 'village' ? 'Place' : 'AdministrativeArea',
    '@id': url(p) + '#place',
    name: p.official,
    url: url(p)
  };
  if (alternateName.length) place.alternateName = alternateName;
  if (parent) {
    place.containedInPlace = parent.level === 'state'
      ? { '@type': 'AdministrativeArea', name: parent.official, ...(index.places.goa?.qid ? { sameAs: `https://www.wikidata.org/wiki/${index.places.goa.qid}` } : null) }
      : { '@type': 'AdministrativeArea', '@id': url(parent) + '#place', name: parent.official, url: url(parent) };
  }
  if (facts.geo) place.geo = { '@type': 'GeoCoordinates', latitude: facts.geo[0], longitude: facts.geo[1] };
  if (facts.qid) place.sameAs = `https://www.wikidata.org/wiki/${facts.qid}`;

  const crumbs: Json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trailOf(p.id).map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.official, item: url(t) }))
  };
  return [place, crumbs];
}

/** Safe to put inside <script type="application/ld+json">: no "</script>" can close it early. */
export const jsonLdText = (data: Json[]) => JSON.stringify(data.length === 1 ? data[0] : data).replace(/</g, '\\u003c');
