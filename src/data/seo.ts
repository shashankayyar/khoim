/* Page titles and descriptions. Templates are from docs/copy.md (SEO section).
   Used when the pages are built and again in the app as you move between places. */
import { getPlace } from './khoim';
import type { Place } from './types';

export interface PageMeta { title: string; description: string }

export const HOME_META: PageMeta = {
  title: "Khoim | Goa's place names in Konkani, and how to say them",
  description: "A map of Goa's districts, talukas and villages. Official spellings next to Konkani names in Devanagari and Romi, with a guide to saying each one."
};

export function pageMeta(p: Place | null): PageMeta {
  if (!p || p.level === 'state') return HOME_META;
  const parent = getPlace(p.parent);

  if (p.level === 'village') {
    const district = getPlace(parent?.parent);
    const where = `${parent?.official} taluka, ${district?.official}, Goa`;
    if (p.deva) {
      // For a village with a reviewed Konkani name. None exist yet; copy.md has only the pending form, so this follows the taluka pattern.
      return {
        title: `${p.official} (${[p.romi, p.deva].filter(Boolean).join(', ')}), ${parent?.official} taluka, Goa | Khoim`,
        description: `${p.official} is a village in ${where}. It is ${p.deva} in Konkani${p.romi ? ` and ${p.romi} in Romi` : ''}.`
      };
    }
    return {
      title: `${p.official}, ${parent?.official} taluka, Goa | Khoim`,
      description: `${p.official} is a village in ${where}. Official name from government records; its Konkani name is being added.`
    };
  }

  /* Districts and talukas. copy.md gives the taluka form with both names present. Districts, and places where
     the Romi or the Konkani name is missing (Kushavati, Pernem, Dharbandora), follow the same template with
     the missing part left out. Settled 1 Oct 2026. */
  const names = [p.romi, p.deva].filter(Boolean).join(', ');
  const inside = p.level === 'taluka' ? 'villages' : 'talukas';
  const title = `${p.official}${names ? ` (${names})` : ''} ${p.level}, Goa | Khoim`;
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
