/* Khoim app state. Shared by the phone and desktop layouts. Based on design/ui_kits/khoim/state.jsx.

   One tap opens a place: the map moves to it and its card comes up. A district or taluka you open is also
   the level you are now inside, so its talukas or villages show on the map straight away. Closing the card
   leaves you inside, with the strip of places to browse.

   The address bar follows the place you are looking at, and the browser's back button steps back through
   places and closes search or About. */
import { useEffect, useRef, useState } from 'react';
import { loadVillagePaths, type VillagePaths } from '../data/geo';
import { childCount, childrenOf, getPlace, loadVillages, pathOf, placeAtPath, registerVillage, spokenName, villagesReady } from '../data/khoim';
import { pageMeta } from '../data/seo';
import type { Place, RawVillage, Script } from '../data/types';
import { loadContribConfig, type ContribConfig, type ContributionKind } from '../lib/contribute';
import { LIVE_LAYERS, NO_LIVE, loadLive, type Live } from '../lib/live';

export type Snap = 'peek' | 'full';
type Overlay = 'search' | 'more' | 'form' | null;

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
  /** The contribution form: which place it is about and which choice is ticked. Null when closed. */
  form: { placeId: string; kind: ContributionKind | null } | null;
  layer: string;
}

/** What each browser history entry remembers. */
interface Entry {
  focus: string | null;
  selected: string | null;
  snap: Snap;
  overlay: Overlay;
  /** address plus overlay: a new key means a new history entry */
  key: string;
  /** how many entries deep we are since the page loaded */
  idx: number;
}

export interface KhoimOptions {
  desktop: boolean;
  /** The place this page was built for. Missing on the home page and the not-found page. */
  initialId?: string;
  /** On a village page: that village's record, so its card can show before the full list loads. */
  initialVillage?: RawVillage;
}

const START: State = { focus: null, selected: null, snap: 'peek', hot: null, search: false, query: '', more: false, form: null, layer: 'names' };
const SCRIPT_KEY = 'khoim-script';
const SITE = 'https://khoim.in';

function savedScript(): Script {
  try {
    const v = localStorage.getItem(SCRIPT_KEY);
    return v === 'official' || v === 'romi' || v === 'deva' ? v : 'deva';
  } catch {
    return 'deva';
  }
}

/** A place that has been opened, from the map, the strip, search or a link: its card peeks up and the map
    shows it. Districts and talukas are entered; a village is shown inside its taluka. */
function opened(p: Place | null): Pick<State, 'focus' | 'selected' | 'snap'> {
  if (!p || p.level === 'state') return { focus: null, selected: null, snap: 'peek' };
  return { focus: p.level === 'village' ? p.parent : p.id, selected: p.id, snap: 'peek' };
}

/** "3 talukas." or "47 villages." for a place that has places inside it. */
function insideCount(p: Place): string {
  return p.level === 'village' ? '' : ' ' + childCount(p) + (p.level === 'taluka' ? ' villages.' : ' talukas.');
}

const queryInAddress = () => new URLSearchParams(window.location.search).get('q') ?? '';
const entryNow = (): Entry | undefined => window.history.state?.khoim;

export function useKhoim({ desktop, initialId, initialVillage }: KhoimOptions) {
  const [s, set] = useState<State>(() => {
    if (initialVillage) registerVillage(initialVillage);
    const query = queryInAddress();
    return { ...START, ...opened(getPlace(initialId)), query, search: !!query };
  });
  const [script, setScriptRaw] = useState<Script>(savedScript);
  const [announce, setAnnounce] = useState('');
  const [villagesLoaded, setVillagesLoaded] = useState(villagesReady);
  const [paths, setPaths] = useState<{ id: string; paths: VillagePaths } | null>(null);
  /* Whether the contribution form is switched on. Until the server says so, cards keep their email buttons. */
  const [contrib, setContrib] = useState<ContribConfig>({ open: false, siteKey: null });
  /* What reviewers have allowed for the layers other than Names. Null until the server has answered. */
  const [liveData, setLiveData] = useState<Live | null>(null);
  /* what to read out once About has closed, in place of the name of the place underneath */
  const sayNext = useRef<string | null>(null);
  /* the next address change replaces the current history entry instead of adding one */
  const replaceNext = useRef(true);

  const up = (o: Partial<State>) => set(v => ({ ...v, ...o }));
  const needVillages = () => loadVillages().then(() => setVillagesLoaded(true));

  /* The village list is not needed for the first screen. Fetch it once the page has settled. */
  useEffect(() => {
    let live = true;
    const run = () => {
      loadVillages().then(() => { if (live) setVillagesLoaded(true); });
      loadContribConfig().then(c => { if (live) setContrib(c); });
      loadLive().then(l => { if (live) setLiveData(l); });
    };
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

  /* ---------- The address bar follows the place ---------- */

  const place = selectedPlace ?? focusPlace;
  const overlay: Overlay = s.form ? 'form' : s.more ? 'more' : s.search && !desktop ? 'search' : null;
  useEffect(() => {
    const path = pathOf(place);
    const q = s.query && (desktop || s.search) ? '?q=' + encodeURIComponent(s.query) : '';
    const cur = entryNow();
    const key = path + '#' + (overlay ?? '');
    const entry: Entry = { focus: s.focus, selected: s.selected, snap: s.snap, overlay, key, idx: cur?.idx ?? 0 };
    if (replaceNext.current || !cur || cur.key === key) {
      window.history.replaceState({ khoim: entry }, '', path + q);
    } else {
      entry.idx = cur.idx + 1;
      window.history.pushState({ khoim: entry }, '', path + q);
    }
    replaceNext.current = false;

    const meta = pageMeta(place);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE + path);
  }, [s.focus, s.selected, s.snap, s.query, s.search, overlay, desktop, place]);

  /* The browser's back and forward buttons. */
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const st = e.state?.khoim as Entry | undefined;
      const query = queryInAddress();
      if (st && (!st.selected || getPlace(st.selected))) {
        /* going back or forward never reopens the form: what was typed in it is gone */
        set(v => ({ ...v, focus: st.focus, selected: st.selected, snap: st.snap, hot: null, search: st.overlay === 'search', more: st.overlay === 'more', form: null, query: query || (st.overlay === 'search' ? v.query : '') }));
        const p = getPlace(st.selected) ?? getPlace(st.focus);
        setAnnounce(sayNext.current ?? (p ? spokenName(p) : 'All of Goa'));
        sayNext.current = null;
        return;
      }
      /* an address we have no saved state for: work it out from the address itself */
      const open = () => {
        const p = placeAtPath(window.location.pathname);
        set(v => ({ ...v, ...opened(p), hot: null, search: false, more: false, form: null, query }));
      };
      if (window.location.pathname.split('/').filter(Boolean).length > 2 && !villagesReady()) needVillages().then(open); else open();
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /* Search and About sit on top of the map. Closing one steps back in history when it was opened here,
     so the phone's back button and the Cancel button do the same thing. */
  const closeOverlay = () => {
    const cur = entryNow();
    if (cur?.overlay && cur.idx > 0) { window.history.back(); return; }
    replaceNext.current = true;
    up({ search: false, more: false, form: null });
  };

  const goTo = (id: string | null) => {
    up({ focus: id, selected: null, snap: 'peek', hot: null });
    const p = getPlace(id);
    setAnnounce(p ? 'Inside ' + p.official + '.' + insideCount(p) : 'All of Goa');
  };
  /** Opens a place: the map moves to it and its card peeks up. */
  const select = (id: string) => {
    const p = getPlace(id);
    if (!p || p.level === 'state') return goTo(null);
    up({ ...opened(p), hot: null });
    setAnnounce(spokenName(p) + insideCount(p));
  };

  const inTaluka = focusPlace?.level === 'taluka';
  const villages: Place[] | undefined = inTaluka && villagesLoaded ? childrenOf(focusPlace.id) : undefined;
  const villagePaths = inTaluka && paths?.id === focusPlace.id ? paths.paths : null;

  /* The layer that is on, if it is one that people add to: its marks go on the map and the strip. */
  const litLayer = LIVE_LAYERS.find(l => l.id === s.layer) ?? null;
  const layerCounts = liveData ? Object.fromEntries(LIVE_LAYERS.map(l => [l.id, liveData.total(l.id)])) : null;

  return {
    ...s, script, announce, villagesLoaded, villages, villagePaths, contrib,
    live: liveData ?? NO_LIVE, litLayer, layerCounts,
    marks: litLayer && liveData ? liveData.marks(litLayer.id) : null,
    /* the form takes the place of About if it was opened from there */
    openForm: (placeId: string, kind: ContributionKind | null = null) => up({ more: false, form: { placeId, kind } }),
    closeForm: closeOverlay,
    setScript: (v: Script) => { setScriptRaw(v); try { localStorage.setItem(SCRIPT_KEY, v); } catch { /* private mode: the choice lasts for this visit */ } },
    setHot: (hot: string | null) => up({ hot }),
    /* villages are part of search, so make sure their list is on its way as soon as someone starts */
    setQuery: (query: string) => { if (query) needVillages(); up({ query }); },
    /* Choosing a layer puts About away, so the map with that layer's marks is what you see next. */
    setLayer: (layer: string) => {
      const l = LIVE_LAYERS.find(x => x.id === layer), n = l && liveData ? liveData.total(l.id) : null;
      const words = l ? `${l.label} layer on.${n === null ? '' : n ? ` ${n} so far.` : ' None yet.'}` : 'Names layer on.';
      set(v => ({ ...v, layer }));
      setAnnounce(words);
      /* closing About steps back in history, which would read out the place's name instead */
      const cur = entryNow();
      if (cur?.overlay && cur.idx > 0) sayNext.current = words;
      closeOverlay();
    },
    openSearch: () => { needVillages(); up({ search: true }); },
    closeSearch: closeOverlay,
    openMore: () => up({ more: true }),
    closeMore: closeOverlay,
    select,
    goTo,
    /** A tap on the map or a label. Tapping the place whose card is already up opens the card fully. */
    pick: (id: string, scrubbed: boolean) => {
      if (!scrubbed && id === s.selected) return up({ snap: 'full' });
      select(id);
    },
    /** 'closed' puts the card away. You stay inside the district or taluka, with its strip of places. */
    setSnap: (snap: Snap | 'closed') => snap === 'closed' ? up({ selected: null, snap: 'peek' }) : up({ snap }),
    /** Puts a village's card away first. Otherwise goes up one level. */
    back: () => {
      if (selectedPlace?.level === 'village') return up({ selected: null, snap: 'peek' });
      const p = getPlace(s.focus);
      goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null);
    },
    /** From search: open the place. */
    openPlace: (id: string) => {
      const p = getPlace(id);
      if (!p || p.level === 'state') { closeOverlay(); up({ focus: null, selected: null, snap: 'peek' }); return; }
      up({ search: false, more: false, ...opened(p), hot: null });
      setAnnounce(spokenName(p) + insideCount(p));
    }
  };
}

export type Khoim = ReturnType<typeof useKhoim>;
