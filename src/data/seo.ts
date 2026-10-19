/* Page titles and descriptions. Templates are from docs/copy.md (SEO section).
   Used when the pages are built and again in the app as you move between places. */
import { factsOf, getPlace, pathOf } from './khoim';
import type { KnownForItem, Place } from './types';

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
  const kind = p.isTown ? 'town' : 'village', where = `${p.official}, ${getPlace(p.parent)?.official}, Goa`;
  /* phase 4, B7: the meaning or the main feast, where there is one */
  if (p.level === 'village') {
    if (meaningOf(p)) return `${where}: name meaning and ${kind} facts | Khoim`;
    const feast = mainFeast(p);
    if (feast) return `${where}: ${feast.title} and ${kind} facts | Khoim`;
  }
  return `${where}: ${kind} facts | Khoim`;
}

/** A village's first reading of where its name comes from, with its source's caution. Sourced, in our words. */
function meaningOf(p: Place): string | null {
  const r = factsOf(p.id)?.meaning?.readings[0];
  return r ? `${r.text}${r.hedge ? ` (${r.hedge})` : ''}` : null;
}
/** The feast a village is best known for: a zatra or feast with its date, else any, else its parish feast. */
const FEAST_RANK: Record<string, number> = { zatra: 0, feast: 1, festival: 2, parish: 3 };
function mainFeast(p: Place): KnownForItem | null {
  const all = (factsOf(p.id)?.knownFor ?? []).filter(k => k.kind in FEAST_RANK && (k.kind !== 'parish' || k.whenText));
  return all.sort((a, b) => (a.whenText ? 0 : 4) + FEAST_RANK[a.kind] - ((b.whenText ? 0 : 4) + FEAST_RANK[b.kind]))[0] ?? null;
}
/** The sentences a village's description adds for its meaning and main feast. */
function factLine(p: Place): string {
  const m = meaningOf(p), f = mainFeast(p);
  return (m ? ` Name meaning: ${m}.` : '') + (f ? ` Known for ${f.title}${f.whenText ? ', ' + f.whenText : ''}.` : '');
}

export function pageMeta(p: Place | null): PageMeta {
  if (!p || p.level === 'state') return HOME_META;
  const parent = getPlace(p.parent);
  const title = pageTitle(p);

  if (p.level === 'village') {
    const district = getPlace(parent?.parent);
    const where = `${parent?.official} taluka, ${district?.official}, Goa`;
    const kind = p.isTown ? 'town' : 'village';
    if (p.deva || p.romi) {
      return {
        title,
        description: `${p.official} is a ${kind} in ${where}. It is ${p.deva ? `${p.deva} in Konkani${p.romi ? ` and ${p.romi} in Romi` : ''}` : `${p.romi} in Romi`}.${factLine(p)}`
      };
    }
    return {
      title,
      description: `${p.official} is a ${kind} in ${where}.${factLine(p)} Official name from government records; its Konkani name is being added.`
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
