/* Page titles and descriptions. Templates are from docs/copy.md (SEO section).
   Used when the pages are built and again in the app as you move between places. */
import { getPlace, pathOf } from './khoim';
import type { Place } from './types';

export interface PageMeta { title: string; description: string }

export const HOME_META: PageMeta = {
  title: "Khoim | Goa's place names in Konkani, and how to say them",
  description: "A map of Goa's districts, talukas and villages. Official spellings next to Konkani names in Devanagari and Romi, with a guide to saying each one."
};

/** Page titles follow docs/phase2-brief.md (A6), approved by Shashank on 16 October 2026:
    a place with a Konkani name: "[Official] ([Devanagari], [Romi]): Konkani name, how to say it | Khoim";
    any other place: "[Official], [taluka or district], Goa: village facts | Khoim".
    Only names on file count: reviewed village names, and the researched district and taluka names. A form
    from the Gazetteer that nobody has checked never appears here (phase 2 rule 6). A missing script is left out. */
export function pageTitle(p: Place): string {
  const names = [p.deva, p.romi].filter(Boolean).join(', ');
  if (names) return `${p.official} (${names}): Konkani name, how to say it | Khoim`;
  return `${p.official}, ${getPlace(p.parent)?.official}, Goa: village facts | Khoim`;
}

export function pageMeta(p: Place | null): PageMeta {
  if (!p || p.level === 'state') return HOME_META;
  const parent = getPlace(p.parent);
  const title = pageTitle(p);

  if (p.level === 'village') {
    const district = getPlace(parent?.parent);
    const where = `${parent?.official} taluka, ${district?.official}, Goa`;
    if (p.deva || p.romi) {
      return {
        title,
        description: `${p.official} is a village in ${where}. It is ${p.deva ? `${p.deva} in Konkani${p.romi ? ` and ${p.romi} in Romi` : ''}` : `${p.romi} in Romi`}.`
      };
    }
    return {
      title,
      description: `${p.official} is a village in ${where}. Official name from government records; its Konkani name is being added.`
    };
  }

  /* Districts and talukas. copy.md gives the taluka form with both names present. Districts, and places where
     the Romi or the Konkani name is missing (Kushavati, Pernem, Dharbandora), follow the same template with
     the missing part left out. Settled 1 Oct 2026. */
  const inside = p.level === 'taluka' ? 'villages' : 'talukas';
  if (!p.deva) {
    return {
      title,
      description: `${p.official} is a ${p.level} in ${parent && parent.level !== 'state' ? parent.official + ', ' : ''}Goa. Official name from government records.${p.pendingNote ? ' ' + p.pendingNote : ''}`
    };
  }
  const where = p.level === 'taluka' && parent ? ` in ${parent.official}` : '';
  return {
    title,
    description: `${p.official} ${p.level}${where} is ${p.deva} in Konkani${p.romi ? ` and ${p.romi} in Romi` : ''}. See how to say it and find its ${inside} on the map.`
  };
}

/** Where a place's link-preview image is written at build (scripts/og/cards.mjs makes the same address):
    /og/goa.png for the home page, /og/south-goa/salcete.png for a taluka. */
export function ogImagePath(p: Place): string {
  return p.level === 'state' ? '/og/goa.png' : '/og' + pathOf(p).slice(0, -1) + '.png';
}
