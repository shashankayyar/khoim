/* Khoim app state. Shared by the phone and desktop layouts. Based on design/ui_kits/khoim/state.jsx.

   One tap opens a place: the map moves to it and its card comes up. A district or taluka you open is also
   the level you are now inside, so its talukas or villages show on the map straight away. Closing the card
   leaves you inside, with the strip of places to browse.

   The address bar follows the place you are looking at, and the browser's back button steps back through
   places and closes search or About.

   Inside a taluka, "See all as a list" opens every village as a sortable list (phase 2), at the taluka's
   address plus villages/: /north-goa/bardez/villages/. */
import { useEffect, useRef, useState } from 'react';
import { TALUKA_IDS, loadMapLines, loadVillagePaths, type MapLines, type VillagePaths } from '../data/geo';
import { childCount, childrenOf, factsOf, getPlace, loadVillageFacts, loadVillages, pathOf, placeAtPath, registerVillage, spokenName, villagesReady } from '../data/khoim';
import { pageMeta } from '../data/seo';
import type { Place, RawVillage, Script } from '../data/types';
import { loadContribConfig, type ContribConfig, type ContributionKind } from '../lib/contribute';
import { LIVE_LAYERS, NO_LIVE, loadLive, type Live } from '../lib/live';
import { NAMES_LAYER, isColoured, layerFromQuery, layerHeadline, layerQuery, layerWith, mappedVillages, type MapLayer, type MapLayerId } from '../lib/layers';

export type Snap = 'peek' | 'full';
type Overlay = 'search' | 'more' | 'form' | 'list' | null;

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
  form: { placeId: string; kind: ContributionKind | ContributionKind[] | null } | null;
  layer: string;
  /** The taluka's villages as a list, over the map. Only inside a taluka. */
  list: boolean;
  /** The phase 2 map view (Names, Name parts, Feasts and zatras, Names we need). Travels in the address. */
  mapLayer: MapLayer;
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
  /** On a taluka's villages/ page: open with the list showing. */
  initialList?: boolean;
}

const START: State = { focus: null, selected: null, snap: 'peek', hot: null, search: false, query: '', more: false, form: null, layer: 'names', list: false, mapLayer: NAMES_LAYER };
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

/* TODO(copy): the list's page title. "Villages in {taluka}" is the design's title for the list. */
const listTitle = (t: Place) => `Villages in ${t.official} | Khoim`;

const queryInAddress = () => new URLSearchParams(window.location.search).get('q') ?? '';
const entryNow = (): Entry | undefined => window.history.state?.khoim;

/** A taluka's list address ends in villages/. */
const LIST_SLUG = 'villages';
const isListPath = (path: string) => { const parts = path.split('/').filter(Boolean); return parts.length === 3 && parts[2] === LIST_SLUG; };

export function useKhoim({ desktop, initialId, initialVillage, initialList = false }: KhoimOptions) {
  const [s, set] = useState<State>(() => {
    if (initialVillage) registerVillage(initialVillage);
    const query = queryInAddress();
    const start = { ...START, ...opened(getPlace(initialId)), query, search: !!query, mapLayer: layerFromQuery(window.location.search) };
    return initialList && getPlace(initialId)?.level === 'taluka' ? { ...start, selected: null, list: true } : start;
  });
  const [script, setScriptRaw] = useState<Script>(savedScript);
  const [announce, setAnnounce] = useState('');
  const [villagesLoaded, setVillagesLoaded] = useState(villagesReady);
  /* The first-visit hint goes after the first tap on the map and never comes back (phase 2, revision 10). */
  const [tapped, setTapped] = useState(() => { try { return localStorage.getItem('khoim-tapped') === '1'; } catch { return false; } });
  /* the map has been moved or tapped on this visit: the phone's first-screen title steps aside so the names show */
  const [mapMoved, setMapMoved] = useState(false);
  const touch = () => { setMapMoved(true); if (tapped) return; setTapped(true); try { localStorage.setItem('khoim-tapped', '1'); } catch { /* private mode: it lasts for this visit */ } };
  /* the share sheet, and the short confirmation after sharing ("Link copied") */
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  /* every village outline in Goa: the type map is made of them */
  const [allPaths, setAllPaths] = useState<VillagePaths | null>(null);
  /* rivers, railway and stations */
  const [mapLines, setMapLines] = useState<MapLines | null>(null);
  const [factsLoaded, setFactsLoaded] = useState(false);
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

  /* The type map is made of the village names, so the village list and every outline load straight away.
     Talukas are drawn in their tints until they arrive. The rest waits until the page has settled. */
  useEffect(() => {
    let live = true;
    loadVillages().then(() => { if (live) setVillagesLoaded(true); });
    Promise.all(TALUKA_IDS.map(loadVillagePaths)).then(all => { if (live) setAllPaths(Object.assign({}, ...all)); });
    const run = () => {
      loadMapLines().then(l => { if (live) setMapLines(l); });
      /* for the symbols of what each village is known for, at village zoom */
      loadVillageFacts().then(() => { if (live) setFactsLoaded(true); });
      loadLive().then(l => { if (live) setLiveData(l); });
    };
    /* whether the form is open, straight away: the ask on a village sheet needs to know before the first tap (B4) */
    loadContribConfig().then(c => { if (live) setContrib(c); });
    const idle = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 2500 }) : window.setTimeout(run, 1200);
    return () => {
      live = false;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle); else window.clearTimeout(idle);
    };
  }, []);

  const focusPlace = getPlace(s.focus), selectedPlace = getPlace(s.selected);
  const layered = s.mapLayer.id !== 'names';
  /* the map colours for meaning: a view other than Names, or Names in Devanagari or Romi (phase 4, B3) */
  const coloured = isColoured(s.mapLayer, script);

  /* A village's phase 2 facts load the first time a village is selected, or once the page has settled. */
  /* the list needs them too, to mark the villages whose Konkani form is waiting for review, and so does the map
     inside a taluka, for the glyphs of what each village is known for */
  const wantFacts = (selectedPlace?.level === 'village' || s.list || focusPlace?.level === 'taluka') && !factsLoaded;
  useEffect(() => {
    if (!wantFacts) return;
    let live = true;
    loadVillageFacts().then(() => { if (live) setFactsLoaded(true); });
    return () => { live = false; };
  }, [wantFacts]);

  /* ---------- The address bar follows the place ---------- */

  const place = selectedPlace ?? focusPlace;
  const listOpen = s.list && focusPlace?.level === 'taluka';
  const overlay: Overlay = s.form ? 'form' : s.more ? 'more' : s.search && !desktop ? 'search' : listOpen ? 'list' : null;
  useEffect(() => {
    const path = listOpen ? pathOf(focusPlace) + LIST_SLUG + '/' : pathOf(place);
    const params = [s.query && (desktop || s.search) ? 'q=' + encodeURIComponent(s.query) : '', layerQuery(s.mapLayer)].filter(Boolean);
    const q = params.length ? '?' + params.join('&') : '';
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
    document.title = listOpen ? listTitle(focusPlace!) : meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE + path);
  }, [s.focus, s.selected, s.snap, s.query, s.search, overlay, desktop, place, listOpen, s.mapLayer]);

  /* The browser's back and forward buttons. */
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const st = e.state?.khoim as Entry | undefined;
      const query = queryInAddress();
      if (st && (!st.selected || getPlace(st.selected))) {
        /* going back or forward never reopens the form: what was typed in it is gone */
        set(v => ({ ...v, focus: st.focus, selected: st.selected, snap: st.snap, hot: null, search: st.overlay === 'search', more: st.overlay === 'more', list: st.overlay === 'list', form: null, query: query || (st.overlay === 'search' ? v.query : ''), mapLayer: layerFromQuery(window.location.search) }));
        const p = getPlace(st.selected) ?? getPlace(st.focus);
        setAnnounce(sayNext.current ?? (p ? spokenName(p) : 'All of Goa'));
        sayNext.current = null;
        return;
      }
      /* an address we have no saved state for: work it out from the address itself */
      const open = () => {
        const path = window.location.pathname, list = isListPath(path);
        const p = placeAtPath(list ? path.replace(/villages\/?$/, '') : path);
        set(v => ({ ...v, ...opened(p), ...(list && p?.level === 'taluka' ? { selected: null } : null), list: list && p?.level === 'taluka', hot: null, search: false, more: false, form: null, query }));
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
    up({ search: false, more: false, form: null, list: false });
  };

  const goTo = (id: string | null) => {
    up({ focus: id, selected: null, snap: 'peek', hot: null, list: false });
    const p = getPlace(id);
    setAnnounce(p ? 'Inside ' + p.official + '.' + insideCount(p) : 'All of Goa');
  };
  /** Opens a place: the map moves to it and its card peeks up. */
  const select = (id: string) => {
    const p = getPlace(id);
    if (!p || p.level === 'state') return goTo(null);
    up({ ...opened(p), hot: null, list: false });
    setAnnounce(spokenName(p) + insideCount(p));
  };

  /* every village the map draws, once the list has loaded */
  const mapVillages: Place[] | undefined = villagesLoaded ? mappedVillages() : undefined;

  /* The layer that is on, if it is one that people add to: its marks go on the map and the strip. */
  const litLayer = LIVE_LAYERS.find(l => l.id === s.layer) ?? null;
  const layerCounts = liveData ? Object.fromEntries(LIVE_LAYERS.map(l => [l.id, liveData.total(l.id)])) : null;

  return {
    ...s, script, announce, villagesLoaded, mapVillages, contrib,
    layered,
    coloured,
    tapped,
    mapMoved,
    shareOpen,
    toast,
    openShare: () => setShareOpen(true),
    closeShare: () => setShareOpen(false),
    /** Shows a confirmation for 2400ms (--dur-demo) and closes the share sheet. */
    showToast: (text: string) => {
      setShareOpen(false);
      setToast(text);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 2400);
    },
    /** Every village outline, once loaded. */
    allPaths,
    mapLines,
    /** The first pan, zoom or tap on the map: the hint goes. */
    touch,
    /** Choosing a map view changes the colours only: the open card, the framing and the controls stay as they are. */
    setMapLayer: (mapLayer: MapLayer) => {
      replaceNext.current = true;
      set(v => ({ ...v, mapLayer }));
      setAnnounce(mapLayer.id === 'names' ? 'Names.' : layerHeadline(mapLayer, script));
    },
    live: liveData ?? NO_LIVE, litLayer, layerCounts,
    marks: litLayer && liveData ? liveData.marks(litLayer.id) : null,
    /* the form takes the place of About if it was opened from there */
    openForm: (placeId: string, kind: ContributionKind | ContributionKind[] | null = null) => up({ more: false, form: { placeId, kind } }),
    closeForm: closeOverlay,
    setScript: (v: Script) => { setScriptRaw(v); try { localStorage.setItem(SCRIPT_KEY, v); } catch { /* private mode: the choice lasts for this visit */ } },
    setHot: (hot: string | null) => up({ hot }),
    /* villages are part of search, so make sure their list is on its way as soon as someone starts */
    setQuery: (query: string) => { if (query) needVillages(); up({ query }); },
    /** "Show" (phase 4, B3): one choice sets both the view and the layer people add to. Landmarks is both: the
        credited landmarks colour the map, and any that people sent come as tiles. */
    show: (id: string) => {
      const live = LIVE_LAYERS.some(l => l.id === id) && id !== 'landmarks';
      const mapLayer = live ? NAMES_LAYER : s.mapLayer.id === id ? s.mapLayer : layerWith(id as MapLayerId);
      const layer = live || id === 'landmarks' ? id : 'names';
      replaceNext.current = true;
      set(v => ({ ...v, mapLayer, layer }));
      const l = LIVE_LAYERS.find(x => x.id === id), n = l && liveData ? liveData.total(l.id) : null;
      setAnnounce(live && l ? `${l.label}.${n === null ? '' : n ? ` ${n} so far.` : ' None yet.'}` : mapLayer.id === 'names' ? 'Names.' : layerHeadline(mapLayer, script));
    },
    /** What "Show" has chosen. */
    showValue: LIVE_LAYERS.some(l => l.id === s.layer) && s.layer !== 'landmarks' ? s.layer : s.mapLayer.id,
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
    /** The taluka's villages as a list. */
    listOpen,
    factsLoaded,
    openList: () => { needVillages(); up({ list: true, selected: null, hot: null }); if (focusPlace) setAnnounce(listTitle(focusPlace).replace(' | Khoim', '.')); },
    closeList: closeOverlay,
    closeMore: closeOverlay,
    select,
    goTo,
    /** The selected village's phase 2 facts, once loaded. */
    facts: factsLoaded && selectedPlace?.level === 'village' ? factsOf(selectedPlace.id) : null,
    /** A tap on the map or a label. Tapping the place whose card is already up opens the card fully. */
    pick: (id: string, scrubbed: boolean) => {
      touch();
      if (!scrubbed && id === s.selected) return up({ snap: 'full' });
      select(id);
    },
    /** 'closed' puts the card away. You stay inside the district or taluka, with its strip of places. */
    setSnap: (snap: Snap | 'closed') => snap === 'closed' ? up({ selected: null, snap: 'peek' }) : up({ snap }),
    /** Puts a village's card away first. Otherwise goes up one level. */
    back: () => {
      if (listOpen) return closeOverlay();
      if (selectedPlace?.level === 'village') return up({ selected: null, snap: 'peek' });
      const p = getPlace(s.focus);
      goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null);
    },
    /** From search: open the place. */
    openPlace: (id: string) => {
      const p = getPlace(id);
      if (!p || p.level === 'state') { closeOverlay(); up({ focus: null, selected: null, snap: 'peek' }); return; }
      up({ search: false, more: false, list: false, ...opened(p), hot: null });
      setAnnounce(spokenName(p) + insideCount(p));
    }
  };
}

export type Khoim = ReturnType<typeof useKhoim>;
