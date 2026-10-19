/* What the map shows (phase 3 views, made one "Show" control in phase 4, B3). Each choice changes only the colours of
   the same map: never its framing, never the village names, taluka names or borders.
   - Names: every village in its taluka's house colours. In देवनागरी or Romi, the villages with a reviewed name in
     that script fill with --map-written and the rest go quiet, so switching script plainly changes the map (this
     takes over from "Still unwritten").
   - Spelling endings: villages whose official spelling ends with the chosen ending fill with ink, the rest go quiet.
   - Feasts and zatras, Landmarks: villages with one on file fill with ink, the rest go quiet.
   - Voices, Crops, Food, Music (and Landmarks people send): the layers people add to; their white tiles go on the map.
   A data choice is offered only when it holds 10 or more entries. Every colour has a legend whose swatch is the same
   token as the fill (src/styles/tokens/typemap.css). A choice travels in the address: ?layer=parts&part=im. */
import { GEO } from '../data/geo';
import { allVillages, factsOf, LAYERS } from '../data/khoim';
import showCounts from '../data/generated/show-counts.json';
import type { KnownForItem, Place, Script } from '../data/types';
import type { IconName } from '../components/core/iconPaths';

export type MapLayerId = 'names' | 'parts' | 'feasts' | 'landmarks';
export interface MapLayer { id: MapLayerId; part?: string; month?: number }
export const NAMES_LAYER: MapLayer = { id: 'names' };

/** Village outlines on the map: one count everywhere the map counts villages (phase 3 rule 5). */
export const DRAWN = GEO.drawn;
/** A data choice shows in "Show" only with at least this many entries. */
export const SHOW_MIN = 10;

/** Endings, matched on official spellings exactly as written. */
export const NAME_PARTS: { id: string; label: string }[] = ['im', 'em', 'gao', 'ona', 'ora'].map(id => ({ id, label: '-' + id }));
const endsWith = (name: string, part: string) => name.toLowerCase().endsWith(part);

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The defaults a view opens with: -im. */
export function layerWith(id: MapLayerId): MapLayer {
  if (id === 'parts') return { id, part: 'im' };
  return { id };
}

/** Villages the map draws: the ones with an outline. */
export const mappedVillages = () => allVillages().filter(v => v.boundarySource);

export const partOf = (layer: MapLayer) => NAME_PARTS.find(p => p.id === layer.part) ?? NAME_PARTS[0];
export const partCount = (id: string) => mappedVillages().filter(v => endsWith(v.official, id)).length;
/** Villages with a reviewed name in a script (or in either, for Official). */
export const writtenCount = (script: Script = 'official') => mappedVillages().filter(v => (script === 'deva' ? v.deva : script === 'romi' ? v.romi : v.deva || v.romi)).length;

const FEAST_KINDS = new Set(['zatra', 'feast', 'festival']);
const isFeast = (k: KnownForItem) => FEAST_KINDS.has(k.kind) || (k.kind === 'parish' && !!k.whenText);
const has = (v: Place, test: (k: KnownForItem) => boolean) => (factsOf(v.id)?.knownFor ?? []).some(test);
export const feastVillages = () => mappedVillages().filter(v => has(v, isFeast)).length;
export const landmarkVillages = () => mappedVillages().filter(v => has(v, k => k.kind === 'landmark')).length;

/** A view colours the map for meaning: anything but Names in the Official script. */
export const isColoured = (layer: MapLayer, script: Script) => layer.id !== 'names' || script !== 'official';

export type LayerState = 'lit' | 'dim';
/** How a village is drawn under a view. */
export function layerState(v: Place, layer: MapLayer, script: Script): LayerState {
  if (layer.id === 'parts') return endsWith(v.official, partOf(layer).id) ? 'lit' : 'dim';
  if (layer.id === 'feasts') return has(v, isFeast) ? 'lit' : 'dim';
  if (layer.id === 'landmarks') return has(v, k => k.kind === 'landmark') ? 'lit' : 'dim';
  if (script === 'deva') return v.deva ? 'lit' : 'dim';
  if (script === 'romi') return v.romi ? 'lit' : 'dim';
  return 'lit';
}

/** Every dated feast, zatra or festival, with its village (with or without an outline). */
export function allFeasts(): { place: Place; item: KnownForItem }[] {
  return allVillages().flatMap(p => (factsOf(p.id)?.knownFor ?? []).filter(k => k.when).map(item => ({ place: p, item })));
}

/* ---------- The "Show" control ---------- */

export interface ShowOption { id: string; label: string; icon?: IconName; count?: number; kind: 'view' | 'live' }
const LIVE_IDS = ['voices', 'crops', 'food', 'music'];
/** Names and Spelling endings always; Feasts and zatras, Landmarks, and the layers people add to only with 10 or more.
    liveCounts: how many entries each layer people add to holds (null until the server answers). */
export function showOptions(liveCounts: Record<string, number> | null): ShowOption[] {
  const out: ShowOption[] = [{ id: 'names', label: 'Names', kind: 'view' }, { id: 'parts', label: 'Spelling endings', kind: 'view' }];
  const feasts = showCounts.feasts, landmarks = showCounts.landmarks + (liveCounts?.landmarks ?? 0);
  // TODO(copy): "Feasts and zatras" is the phase 2 layer name; the counts beside each choice are new
  if (feasts >= SHOW_MIN) out.push({ id: 'feasts', label: 'Feasts and zatras', icon: 'flame', count: feasts, kind: 'view' });
  if (landmarks >= SHOW_MIN) out.push({ id: 'landmarks', label: 'Landmarks', icon: 'landmark', count: landmarks, kind: 'view' });
  for (const l of LAYERS.filter(x => LIVE_IDS.includes(x.id))) {
    const n = liveCounts?.[l.id] ?? 0;
    if (n >= SHOW_MIN) out.push({ id: l.id, label: l.label, icon: l.icon, count: n, kind: 'live' });
  }
  return out;
}

/** The line above the map: the count in bold, then the rest. Names and Spelling endings: wording approved in
    docs/phase3-brief.md. */
export function viewLine(layer: MapLayer, script: Script): { strong: string; rest: string } {
  if (layer.id === 'parts') { const p = partOf(layer); return { strong: `${partCount(p.id)} of ${DRAWN} villages`, rest: ` end in “${p.label}” in their official spelling.` }; }
  // TODO(copy): the lines for Feasts and zatras, and Landmarks
  if (layer.id === 'feasts') return { strong: `${feastVillages()} of ${DRAWN} villages`, rest: ' have a feast or zatra on file. Tap one to see when.' };
  if (layer.id === 'landmarks') return { strong: `${landmarkVillages()} of ${DRAWN} villages`, rest: ' have a temple, church, fort or other landmark on file.' };
  if (script === 'official') return { strong: `${DRAWN} villages`, rest: ', as the government spells them. Switch script to see how many we can write in Konkani yet.' };
  const n = writtenCount(script);
  return { strong: `${n} of ${DRAWN}`, rest: ` villages written in ${script === 'deva' ? 'Devanagari' : 'Romi'} so far. The faint names are still waiting for someone who knows them.` };
}

/** The legend for a view that colours for meaning: each swatch is the token the map fills with. */
export function legendOf(layer: MapLayer, script: Script): { token: string; label: string }[] {
  if (layer.id === 'parts') return [{ token: '--map-view-on', label: `ends in ${partOf(layer).label}` }, { token: '--map-quiet', label: 'other villages' }];
  // TODO(copy): legends for Feasts and zatras, and Landmarks
  if (layer.id === 'feasts') { const n = feastVillages(); return [{ token: '--map-view-on', label: `feast or zatra on file, ${n}` }, { token: '--map-quiet', label: `not yet, ${DRAWN - n}` }]; }
  if (layer.id === 'landmarks') { const n = landmarkVillages(); return [{ token: '--map-view-on', label: `landmark on file, ${n}` }, { token: '--map-quiet', label: `not yet, ${DRAWN - n}` }]; }
  /* Names in Devanagari or Romi: the approved "Still unwritten" legend, counted for the chosen script */
  if (script !== 'official') { const n = writtenCount(script); return [{ token: '--map-written', label: `written in Konkani, ${n}` }, { token: '--map-quiet', label: `not yet, ${DRAWN - n}` }]; }
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
  if (layer.id === 'feasts' || layer.id === 'landmarks') return 'layer=' + layer.id;
  return '';
}

/** The view an address asks for. Anything unknown is Names; so is "need" (Still unwritten, now the script toggle). */
export function layerFromQuery(search: string): MapLayer {
  const q = new URLSearchParams(search), id = q.get('layer');
  if (id === 'parts') return { id, part: NAME_PARTS.some(p => p.id === q.get('part')) ? q.get('part')! : 'im' };
  if (id === 'feasts' || id === 'landmarks') return { id };
  return NAMES_LAYER;
}
