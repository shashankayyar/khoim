/* Khoim app state. Shared by the phone and desktop layouts. Ported from design/ui_kits/khoim/state.jsx. */
import { useEffect, useState } from 'react';
import { loadVillagePaths, type VillagePaths } from '../data/geo';
import { childCount, childrenOf, getPlace, loadVillages, spokenName, villagesReady } from '../data/khoim';
import type { Place, Script } from '../data/types';

export type Snap = 'peek' | 'full';

interface State {
  /** null = all Goa; a district or taluka id when inside one */
  focus: string | null;
  selected: string | null;
  snap: Snap;
  /** transient highlight while scrubbing or swiping a strip */
  hot: string | null;
  search: boolean;
  query: string;
  more: boolean;
  layer: string;
}

const START: State = { focus: null, selected: null, snap: 'peek', hot: null, search: false, query: '', more: false, layer: 'names' };
const SCRIPT_KEY = 'khoim-script';

function savedScript(): Script {
  try {
    const v = localStorage.getItem(SCRIPT_KEY);
    return v === 'official' || v === 'romi' || v === 'deva' ? v : 'deva';
  } catch {
    return 'deva';
  }
}

export function useKhoim() {
  const [s, set] = useState<State>(START);
  const [script, setScriptRaw] = useState<Script>(savedScript);
  const [announce, setAnnounce] = useState('');
  const [villagesLoaded, setVillagesLoaded] = useState(villagesReady);
  const [paths, setPaths] = useState<{ id: string; paths: VillagePaths } | null>(null);

  const up = (o: Partial<State>) => set(v => ({ ...v, ...o }));
  const say = (id: string) => { const p = getPlace(id); if (p) setAnnounce(spokenName(p)); };

  /* The village list is not needed for the first screen. Fetch it once the page has settled. */
  useEffect(() => {
    let live = true;
    const run = () => { loadVillages().then(() => { if (live) setVillagesLoaded(true); }); };
    const idle = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2500 }) : window.setTimeout(run, 1200);
    return () => {
      live = false;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle); else window.clearTimeout(idle);
    };
  }, []);

  /* Village outlines load one taluka at a time: fetched when a taluka is selected, so going inside is instant. */
  const focusPlace = getPlace(s.focus), selectedPlace = getPlace(s.selected);
  const wantPaths = focusPlace?.level === 'taluka' ? focusPlace.id : selectedPlace?.level === 'taluka' ? selectedPlace.id : null;
  useEffect(() => {
    if (!wantPaths) return;
    let live = true;
    loadVillages().then(() => { if (live) setVillagesLoaded(true); });
    loadVillagePaths(wantPaths).then(p => { if (live) setPaths({ id: wantPaths, paths: p }); });
    return () => { live = false; };
  }, [wantPaths]);

  const select = (id: string) => { up({ selected: id, snap: 'peek' }); say(id); };
  const goInside = (id: string) => {
    const p = getPlace(id);
    if (!p) return;
    up({ focus: id, selected: null, snap: 'peek', hot: null });
    setAnnounce('Inside ' + p.official + '. ' + childCount(p) + (p.level === 'taluka' ? ' villages.' : ' talukas.'));
  };
  const goTo = (id: string | null) => {
    up({ focus: id, selected: null, snap: 'peek', hot: null });
    const p = getPlace(id);
    setAnnounce(p ? 'Inside ' + p.official : 'All of Goa');
  };

  const inTaluka = focusPlace?.level === 'taluka';
  const villages: Place[] | undefined = inTaluka && villagesLoaded ? childrenOf(focusPlace.id) : undefined;
  const villagePaths = inTaluka && paths?.id === focusPlace.id ? paths.paths : null;

  return {
    ...s, script, announce, villagesLoaded, villages, villagePaths,
    setScript: (v: Script) => { setScriptRaw(v); try { localStorage.setItem(SCRIPT_KEY, v); } catch { /* private mode: the choice lasts for this visit */ } },
    setHot: (hot: string | null) => up({ hot }),
    setQuery: (query: string) => up({ query }),
    setLayer: (layer: string) => up({ layer }),
    openSearch: () => up({ search: true }),
    closeSearch: () => up({ search: false }),
    openMore: () => up({ more: true }),
    closeMore: () => up({ more: false }),
    select,
    goInside,
    goTo,
    /** A tap on the map or a label. Tapping what is already selected goes inside; a village opens its full card. */
    pick: (id: string, scrubbed: boolean) => {
      if (scrubbed || id !== s.selected) return select(id);
      const p = getPlace(id);
      if (!p) return;
      if (p.level !== 'village') goInside(id); else up({ snap: 'full' });
    },
    setSnap: (snap: Snap | 'closed') => snap === 'closed' ? up({ selected: null, snap: 'peek' }) : up({ snap }),
    /** Clears the selection first, then goes up one level. */
    back: () => {
      if (s.selected) return up({ selected: null, snap: 'peek' });
      const p = getPlace(s.focus);
      goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null);
    },
    /** From search or a link: show the place with its full card. */
    openPlace: (id: string) => {
      const p = getPlace(id);
      if (!p || p.level === 'state') return up({ search: false, focus: null, selected: null });
      up({ search: false, focus: p.level === 'district' ? null : p.parent, selected: id, snap: 'full' });
      say(id);
    }
  };
}

export type Khoim = ReturnType<typeof useKhoim>;
