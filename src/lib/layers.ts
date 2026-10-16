/* Phase 2 map views (design/components/data/khoim.js): a row of layers that recolour the villages.
   - Names: the map as it always was.
   - Name parts: every village whose official spelling ends with the chosen part lights up.
   - Feasts and zatras: villages with a feast or zatra in the chosen month light up (next occurrence; a lunar date
     by the months it can fall in).
   - Names we need: villages with a reviewed Konkani name are filled, ones with only an unchecked form (the
     Gazetteer's) are tinted with a dashed edge, the rest are outlined.
   - Population waits for Census 2011 (A2): until then it is not offered at all.
   A view travels in the address: ?layer=parts&part=im, ?layer=feasts&month=4, ?layer=need.

   These are separate from the layers people add to (Voices, Crops and the rest, on the About screen). */
import { allVillages, factsOf } from '../data/khoim';
import type { KnownForItem, Place } from '../data/types';
import type { IconName } from '../components/core/iconPaths';
import { upcomingMonths } from './feasts';

export type MapLayerId = 'names' | 'parts' | 'feasts' | 'need';
export interface MapLayer { id: MapLayerId; part?: string; month?: number }
export const NAMES_LAYER: MapLayer = { id: 'names' };

export const MAP_LAYERS: { id: MapLayerId; label: string; icon: IconName }[] = [
  { id: 'names', label: 'Names', icon: 'languages' },
  { id: 'parts', label: 'Name parts', icon: 'puzzle' },
  { id: 'feasts', label: 'Feasts and zatras', icon: 'calendar-days' },
  { id: 'need', label: 'Names we need', icon: 'circle-dashed' }
];

/** Name parts, matched on official spellings. What each part means still needs a source (the panel says so). */
export const NAME_PARTS: { id: string; label: string; test: (name: string) => boolean }[] = [
  { id: 'em', label: '-em', test: n => /em$/i.test(n) },
  { id: 'im', label: '-im', test: n => /im$/i.test(n) },
  { id: 'gao', label: '-gao', test: n => /gaon?$/i.test(n) },
  { id: 'ona', label: '-ona', test: n => /ona$/i.test(n) },
  { id: 'ora', label: '-ora', test: n => /ora$/i.test(n) }
];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The defaults a layer opens with: -im, and this month. */
export function layerWith(id: MapLayerId, today = new Date()): MapLayer {
  if (id === 'parts') return { id, part: 'im' };
  if (id === 'feasts') return { id, month: today.getMonth() + 1 };
  return { id };
}

/** Villages the map draws: the ones with an outline. */
export const mappedVillages = () => allVillages().filter(v => v.boundarySource);

export const partOf = (layer: MapLayer) => NAME_PARTS.find(p => p.id === layer.part) ?? NAME_PARTS[1];
export const partCount = (id: string) => { const p = NAME_PARTS.find(x => x.id === id); return p ? mappedVillages().filter(v => p.test(v.official)).length : 0; };

const dated = (v: Place): KnownForItem[] => (factsOf(v.id)?.knownFor ?? []).filter(k => k.when);

export type LayerState = 'lit' | 'dim' | 'review' | 'outline';
/** How a village is drawn under a layer. */
export function layerState(v: Place, layer: MapLayer, today: Date): LayerState {
  if (layer.id === 'parts') return partOf(layer).test(v.official) ? 'lit' : 'dim';
  if (layer.id === 'feasts') return dated(v).some(k => upcomingMonths(k.when!, today).includes(layer.month ?? 1)) ? 'lit' : 'dim';
  if (layer.id === 'need') return v.deva || v.romi ? 'lit' : factsOf(v.id)?.gazetteerDeva ? 'review' : 'outline';
  return 'lit';
}

/** Every dated feast, zatra or festival, with its village (with or without an outline). */
export function allFeasts(): { place: Place; item: KnownForItem }[] {
  return allVillages().flatMap(p => dated(p).map(item => ({ place: p, item })));
}

/** The line that replaces the title while a layer is on. TODO(copy): from the design's list. */
export function layerHeadline(layer: MapLayer): string {
  if (layer.id === 'parts') { const p = partOf(layer); return `Names ending ${p.label}, ${partCount(p.id)} villages`; }
  if (layer.id === 'feasts') return `Feasts and zatras in ${MONTHS[(layer.month ?? 1) - 1]}`;
  if (layer.id === 'need') return 'Konkani names we still need';
  return '';
}

/** "?layer=parts&part=im", or '' for Names. */
export function layerQuery(layer: MapLayer): string {
  if (layer.id === 'parts') return `layer=parts&part=${partOf(layer).id}`;
  if (layer.id === 'feasts') return `layer=feasts&month=${layer.month ?? 1}`;
  if (layer.id === 'need') return 'layer=need';
  return '';
}

/** The layer an address asks for. Anything unknown is Names. */
export function layerFromQuery(search: string): MapLayer {
  const q = new URLSearchParams(search), id = q.get('layer');
  if (id === 'parts') return { id, part: NAME_PARTS.some(p => p.id === q.get('part')) ? q.get('part')! : 'im' };
  if (id === 'feasts') { const m = Number(q.get('month')); return { id, month: m >= 1 && m <= 12 ? m : new Date().getMonth() + 1 }; }
  if (id === 'need') return { id };
  return NAMES_LAYER;
}
