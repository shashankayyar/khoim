/* Map shapes. Districts and talukas load with the page; village outlines load one taluka at a time.
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
