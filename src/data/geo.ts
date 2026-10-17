/* Map shapes. Districts and talukas load with the page; village outlines load straight after, a file per taluka.
   Written by scripts/build-data.mjs from design/components/data/goaGeo.js (LGD boundaries, a few from Survey of India). */
import baseJson from './generated/geo-base.json';
import type { GeoBase } from './types';

export const GEO = baseJson as unknown as GeoBase;
export const TALUKA_IDS = Object.keys(GEO.talukas);
export const DISTRICT_IDS = Object.keys(GEO.districts);

/** Village id to SVG path, for one taluka. */
export type VillagePaths = Record<string, string>;

const loaders = import.meta.glob<{ default: VillagePaths }>('./generated/village-paths/*.json');
const cache = new Map<string, VillagePaths>();
const pending = new Map<string, Promise<VillagePaths>>();

export function villagePathsNow(talukaId: string): VillagePaths | null {
  return cache.get(talukaId) ?? null;
}

/** Fetches one taluka's village outlines once. */
export function loadVillagePaths(talukaId: string): Promise<VillagePaths> {
  const have = cache.get(talukaId);
  if (have) return Promise.resolve(have);
  let p = pending.get(talukaId);
  if (!p) {
    const load = loaders[`./generated/village-paths/${talukaId}.json`];
    p = load ? load().then(m => { cache.set(talukaId, m.default); return m.default; }) : Promise.resolve({});
    pending.set(talukaId, p);
  }
  return p;
}

/** Rivers (named main rivers only), railway and stations for the map (scripts/map-lines.mjs, OpenStreetMap and
    Wikidata). Each river keeps OpenStreetMap's name and the prototype's weight; label is the part its name runs along. */
export interface MapLines {
  rivers: { n: string; w: number; d: string[]; label: string }[];
  rail: string[];
  stations: { n: string; code: string; at: [number, number] }[];
}

let lines: Promise<MapLines> | null = null;
/** Fetches the lines once. */
export function loadMapLines(): Promise<MapLines> {
  lines ??= import('./generated/map-lines.json').then(m => m.default as unknown as MapLines);
  return lines;
}
