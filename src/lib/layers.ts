/* Map views (phase 3, docs/phase3-brief.md step 3). Each view changes only the colours of the same map: never its
   framing, never the village names, taluka names or borders.
   - Names: every village in its taluka's house colours.
   - Spelling endings: villages whose official spelling ends with the chosen ending fill with ink, the rest go quiet.
   - Still unwritten: villages with a reviewed Konkani name (either script) fill with kokum, the rest go quiet.
   - Feasts and zatras: kept for village sheets and old links, but out of the view row until there are at least 20.
   - Population waits for Census 2011: not offered at all.
   Every view that colours for meaning has a legend, and the legend's swatches use the same tokens as the map
   (src/styles/tokens/typemap.css). A view travels in the address: ?layer=parts&part=im, ?layer=need.
   The ids stay those of phase 2 so links shared then still work.

   These are separate from the layers people add to (Voices, Crops and the rest, on the About screen). */
import { GEO } from '../data/geo';
import { allVillages, factsOf } from '../data/khoim';
import type { KnownForItem, Place, Script } from '../data/types';
import { upcomingMonths } from './feasts';

export type MapLayerId = 'names' | 'parts' | 'need' | 'feasts';
export interface MapLayer { id: MapLayerId; part?: string; month?: number }
export const NAMES_LAYER: MapLayer = { id: 'names' };

/** The view row. Wording approved in docs/phase3-brief.md. */
export const MAP_LAYERS: { id: MapLayerId; label: string }[] = [
  { id: 'names', label: 'Names' },
  { id: 'parts', label: 'Spelling endings' },
  { id: 'need', label: 'Still unwritten' }
];

/** Village outlines on the map: one count everywhere the map counts villages (phase 3 rule 5). */
export const DRAWN = GEO.drawn;

/** Endings, matched on official spellings exactly as written. */
export const NAME_PARTS: { id: string; label: string }[] = ['im', 'em', 'gao', 'ona', 'ora'].map(id => ({ id, label: '-' + id }));
const endsWith = (name: string, part: string) => name.toLowerCase().endsWith(part);

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The defaults a view opens with: -im, and this month. */
export function layerWith(id: MapLayerId, today = new Date()): MapLayer {
  if (id === 'parts') return { id, part: 'im' };
  if (id === 'feasts') return { id, month: today.getMonth() + 1 };
  return { id };
}

/** Villages the map draws: the ones with an outline. */
export const mappedVillages = () => allVillages().filter(v => v.boundarySource);

export const partOf = (layer: MapLayer) => NAME_PARTS.find(p => p.id === layer.part) ?? NAME_PARTS[0];
export const partCount = (id: string) => mappedVillages().filter(v => endsWith(v.official, id)).length;
/** Villages with a Konkani name a reviewer has checked, in either script. */
export const writtenCount = () => mappedVillages().filter(v => v.deva || v.romi).length;

const dated = (v: Place): KnownForItem[] => (factsOf(v.id)?.knownFor ?? []).filter(k => k.when);

export type LayerState = 'lit' | 'dim';
/** How a village is drawn under a view. */
export function layerState(v: Place, layer: MapLayer, today: Date): LayerState {
  if (layer.id === 'parts') return endsWith(v.official, partOf(layer).id) ? 'lit' : 'dim';
  if (layer.id === 'need') return v.deva || v.romi ? 'lit' : 'dim';
  if (layer.id === 'feasts') return dated(v).some(k => upcomingMonths(k.when!, today).includes(layer.month ?? 1)) ? 'lit' : 'dim';
  return 'lit';
}

/** Every dated feast, zatra or festival, with its village (with or without an outline). */
export function allFeasts(): { place: Place; item: KnownForItem }[] {
  return allVillages().flatMap(p => dated(p).map(item => ({ place: p, item })));
}

/** The line above the map: the count in bold, then the rest. Wording approved in docs/phase3-brief.md. */
export function viewLine(layer: MapLayer, script: Script): { strong: string; rest: string } {
  if (layer.id === 'parts') { const p = partOf(layer); return { strong: `${partCount(p.id)} of ${DRAWN} villages`, rest: ` end in “${p.label}” in their official spelling.` }; }
  if (layer.id === 'need') return { strong: `${writtenCount()} of ${DRAWN} villages`, rest: ' have a Konkani name written here. The rest still show their official spelling.' };
  if (script === 'official') return { strong: `${DRAWN} villages`, rest: ', as the government spells them. Switch script to see how many we can write in Konkani yet.' };
  const n = mappedVillages().filter(v => (script === 'deva' ? v.deva : v.romi)).length;
  return { strong: `${n} of ${DRAWN}`, rest: ` villages written in ${script === 'deva' ? 'Devanagari' : 'Romi'} so far. The faint names are still waiting for someone who knows them.` };
}

/** The legend for a view that colours for meaning: each swatch is the token the map fills with. Names has none. */
export function legendOf(layer: MapLayer): { token: string; label: string }[] {
  if (layer.id === 'parts') return [{ token: '--map-view-on', label: `ends in ${partOf(layer).label}` }, { token: '--map-quiet', label: 'other villages' }];
  if (layer.id === 'need') { const n = writtenCount(); return [{ token: '--map-written', label: `written in Konkani, ${n}` }, { token: '--map-quiet', label: `not yet, ${DRAWN - n}` }]; }
  return [];
}

/** What a screen reader hears when a view is chosen. */
export function layerHeadline(layer: MapLayer, script: Script = 'official'): string {
  const l = viewLine(layer, script);
  return l.strong + l.rest;
}

/** "?layer=parts&part=im", or '' for Names. */
export function layerQuery(layer: MapLayer): string {
  if (layer.id === 'parts') return `layer=parts&part=${partOf(layer).id}`;
  if (layer.id === 'need') return 'layer=need';
  return '';
}

/** The view an address asks for. Anything unknown is Names, and so is Feasts until it is back in the row. */
export function layerFromQuery(search: string): MapLayer {
  const q = new URLSearchParams(search), id = q.get('layer');
  if (id === 'parts') return { id, part: NAME_PARTS.some(p => p.id === q.get('part')) ? q.get('part')! : 'im' };
  if (id === 'need') return { id };
  return NAMES_LAYER;
}
