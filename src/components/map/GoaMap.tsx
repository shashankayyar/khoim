/* The type map (phase 3, docs/prototypes/type-atlas.html): Goa drawn with every village's name inside its own
   outline, so the map is made of names. People pan and zoom freely to read it.

   - Each village is filled with its taluka's house tint and named in that house's ink, along the outline's long
     axis, at a size that fits (data/scripts/labels.mjs). A name shows only once it is at least 7px tall on screen.
   - Labels follow the script toggle and show reviewed names only. A village with no reviewed name in the chosen
     script shows its official spelling, lighter and fainter. Gazetteer forms never appear here (phase 2 rule 6).
   - Taluka names are large over all of Goa and fade out as you zoom in. Taluka borders are always drawn.
   - Drag to pan; wheel, pinch or the zoom buttons to zoom, around the pointer. Tapping a village opens it: the map
     moves to it, outlines it, keeps its neighbours' names in view and dims the rest. Tapping the sea puts the card away.
   - A map view (Names, and the others in src/lib/layers.ts) changes only the colours, never the framing.
   - Rivers: the named main rivers only, as quiet water lines clipped to Goa, wider as you zoom in, heavier for the
     Mandovi and Zuari. Their names (OpenStreetMap's, never invented) follow the line past about 2.2 times the Goa
     view. In the other views they fade to 30% and lose their names. Railway: one thin ink line. Station names, and
     the symbols for a village's feasts, monuments and GI products, show only at village zoom; the symbols only in
     the Names view. OpenStreetMap is credited on the map.

   SVG only. The names on the map are aria-hidden: search, the lists and the plain links on every page are how a
   screen reader or keyboard reaches each village. Most of the moving is done with CSS custom properties on the
   map's box (--k: the zoom, --z: the zoom against the Goa view), so a pan or zoom never re-renders React. */
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { DISTRICT_IDS, GEO, TALUKA_IDS, type MapLines, type VillagePaths } from '../../data/geo';
import { factsOf, getPlace, houseOf, nameIn } from '../../data/khoim';
import type { Box, Place, Point, Script } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import { isColoured, layerState, type MapLayer } from '../../lib/layers';
import { Icon } from '../core/Icon';
import type { IconName } from '../core/iconPaths';
import './map.css';

const T = GEO.talukas, D = GEO.districts;
/** All of Goa: the whole map plane, so no tip of it is left under the chrome. */
const GOA: Box = [0, 0, GEO.size[0], GEO.size[1]];
/* Where a taluka's name sits better a little away from the shape's label point. */
const NUDGE: Record<string, Point> = { mormugao: [-10, 4], quepem: [-45, 95] };
const talukaPoint = (id: string): Point => { const n = NUDGE[id] || [0, 0]; return [T[id].lp[0] + n[0], T[id].lp[1] + n[1]]; };
const houseKey = (id: string) => houseOf(getPlace(id)).key;
/** How far out you can zoom: all of Goa (phase 4, B1). */
const MIN_Z = 1;
/** How far in: a village fills about 60% of the shorter side of the map. An open village is framed the same way. */
const VILLAGE_FILL = 0.6;
/** Official spellings are set narrower on the map, close to the prototype's width-75 Anek Latin. */
const NARROW = 0.84;
/** Village zoom: five times the Goa view. Stations, the symbols for what villages are known for, and their legend. */
const CLOSE_Z = 5;
/* Towns rank above other villages when names clash (phase 4 polish, step 3): Goa's capital first, then each
   taluka's headquarters as the place data names it, then the other towns. Two headquarters carry another name in the
   LGD list and on the map: Vasco da Gama lies in Mormugao, and the LGD spells Dharbandora "Darbandora". */
const CAPITAL = 'Panaji';
const HQ_ON_MAP: Record<string, string> = { 'Vasco da Gama': 'Mormugao', Dharbandora: 'Darbandora' };
function townRank(v: Place): number {
  if (v.official === CAPITAL) return 3;
  const hq = getPlace(v.parent)?.hq;
  if (hq && (HQ_ON_MAP[hq] ?? hq) === v.official) return 2;
  return v.isTown ? 1 : 0;
}
/* What each symbol stands for, for the legend (phase 4, B2). */
const SYMBOL_LABEL: Partial<Record<IconName, string>> = {
  church: 'Church or church feast', flame: 'Zatra, fair or festival', sailboat: 'Festival on the water', landmark: 'Temple, mosque or monument',
  castle: 'Fort', waves: 'Spring or waterfall', sprout: 'GI product', banana: 'GI product', 'train-front': 'Railway station'
};

type Quad = [number, number][];
/** A box of w by h centred on (cx, cy), turned by deg degrees, as its four corners on screen. */
function quad(cx: number, cy: number, w: number, h: number, deg: number): Quad {
  const t = deg * Math.PI / 180, c = Math.cos(t), sn = Math.sin(t);
  return ([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]] as const).map(([dx, dy]) => [cx + dx * c - dy * sn, cy + dx * sn + dy * c] as [number, number]);
}
/** Do two boxes overlap? The separating axis test. */
function overlap(a: Quad, b: Quad): boolean {
  for (const poly of [a, b]) for (let i = 0; i < 4; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % 4], nx = y2 - y1, ny = x1 - x2;
    let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
    for (const [x, y] of a) { const v = x * nx + y * ny; a0 = Math.min(a0, v); a1 = Math.max(a1, v); }
    for (const [x, y] of b) { const v = x * nx + y * ny; b0 = Math.min(b0, v); b1 = Math.max(b1, v); }
    if (a1 <= b0 || b1 <= a0) return false;
  }
  return true;
}

function useSize(ref: RefObject<HTMLElement | null>) {
  const [z, set] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const u = () => set({ w: el.clientWidth, h: el.clientHeight });
    u();
    const ro = new ResizeObserver(u);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return z;
}

export interface GoaMapProps {
  /** The place that is open: a district, a taluka or a village ('v626925'). Null = all of Goa. */
  selected?: string | null;
  /** The district or taluka you are in (a village's taluka). Framed when nothing is selected. */
  focus?: string | null;
  /** A place to outline lightly: the one under the mouse in a list. */
  hot?: string | null;
  script?: Script;
  /** A tap on a village. */
  onSelect?: (id: string) => void;
  /** A tap on the sea or outside Goa. */
  onBackground?: () => void;
  /** The first pan, zoom or tap. */
  onInteract?: () => void;
  /** px kept clear for floating chrome, so what is framed fits between the header and the sheet */
  insetTop?: number;
  insetBottom?: number;
  insetLeft?: number;
  insetRight?: number;
  /** Every village that has an outline, once loaded, and their outlines. */
  villages?: Place[];
  paths?: VillagePaths | null;
  /** The map view. Changes colours only. */
  mapLayer?: MapLayer;
  /** With a live layer on (Voices, Crops and the rest): how many things each place holds, and the layer's icon. */
  marks?: Record<string, number> | null;
  markIcon?: IconName;
  /** Rivers, railway and stations, once loaded. */
  lines?: MapLines | null;
  /** Once the village facts have loaded: the symbols for what villages are known for. */
  factsReady?: boolean;
  /** False where the page shows the OpenStreetMap credit itself, off the map (the phone's bar or sheet, the desktop panel). */
  showCredit?: boolean;
  /** A phone: the legend folds into a "Key" button, opened over the map and closed by a tap elsewhere. */
  compactLegend?: boolean;
}

interface View { k: number; tx: number; ty: number }

export function GoaMap({
  selected = null, focus = null, hot = null, script = 'deva', onSelect, onBackground, onInteract,
  insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, villages, paths, mapLayer, marks, markIcon, lines = null, factsReady = false,
  showCredit = true, compactLegend = false
}: GoaMapProps) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), world = useRef<SVGGElement>(null);
  const { w, h } = useSize(root);
  const view = useRef<View>({ k: 0, tx: 0, ty: 0 });
  const k0 = useRef(1);
  /* true once the person has moved the map since it last framed a place: then a change of insets leaves it be */
  const moved = useRef(false);
  const anim = useRef(0);
  const framed = useRef<string | null>(null);
  /* the phone's key to the map: open or not; a tap anywhere else closes it */
  const [keyOpen, setKeyOpen] = useState(false);
  useEffect(() => {
    if (!keyOpen) return;
    const away = (e: PointerEvent) => { if (!(e.target as Element).closest('.k-key')) setKeyOpen(false); };
    document.addEventListener('pointerdown', away, true);
    return () => document.removeEventListener('pointerdown', away, true);
  }, [keyOpen]);
  /* the name under a symbol, after a tap */
  const [tip, setTip] = useState<{ key: string; x: number; y: number; fs: number; gdy: string; place: string; lines: string[] } | null>(null);

  /* the free space for the map, and the zoom that fits all of Goa in it */
  const area = useCallback(() => {
    const aw = Math.max(1, w - insetLeft - insetRight), ah = Math.max(1, h - insetTop - insetBottom);
    return { x: insetLeft, y: insetTop, w: aw, h: ah };
  }, [w, h, insetLeft, insetRight, insetTop, insetBottom]);
  /* The deepest zoom: a village of typical size (the median outline) fills VILLAGE_FILL of the shorter side; an open
     village smaller than that may be framed closer, and then that is the limit while it is open. */
  const typical = useMemo(() => {
    const sizes = (villages ?? []).filter(v => v.map).map(v => Math.max(v.map!.b[2] - v.map!.b[0], v.map!.b[3] - v.map!.b[1])).sort((x, y) => x - y);
    return sizes.length ? sizes[sizes.length >> 1] : 12;
  }, [villages]);
  const villageK = useCallback((b: Box) => { const a = area(); return Math.min(a.w, a.h) * VILLAGE_FILL / Math.max(b[2] - b[0], b[3] - b[1]); }, [area]);
  const openBox = useMemo(() => { const p = getPlace(selected); return p?.level === 'village' && p.map ? p.map.b : null; }, [selected]);
  const maxK = useCallback(() => Math.max(villageK([0, 0, typical, typical]), openBox ? villageK(openBox) : 0, k0.current * 1.5), [villageK, typical, openBox]);
  const minK = () => k0.current * MIN_Z;
  const fit = useCallback((b: Box, fill = 1): View => {
    const a = area(), bw = b[2] - b[0], bh = b[3] - b[1];
    const k = Math.min(a.w / bw, a.h / bh) * fill;
    const kk = Math.max(k0.current * MIN_Z, Math.min(maxK(), k));
    return { k: kk, tx: a.x + a.w / 2 - (b[0] + bw / 2) * kk, ty: a.y + a.h / 2 - (b[1] + bh / 2) * kk };
  }, [area, maxK]);

  const apply = useCallback(() => {
    const { k, tx, ty } = view.current, el = root.current;
    if (!(k > 0) || !Number.isFinite(tx) || !Number.isFinite(ty)) return;
    world.current?.setAttribute('transform', `translate(${tx} ${ty}) scale(${k})`);
    if (!el) return;
    el.style.setProperty('--k', String(k));
    el.style.setProperty('--z', String(k / k0.current));
    el.style.setProperty('--tx', String(tx));
    el.style.setProperty('--ty', String(ty));
    /* at village zoom: stations, symbols and their legend */
    el.classList.toggle('is-close', k / k0.current >= CLOSE_Z);
    cullSoon.current();
  }, []);

  /* Keep some of Goa on screen, however far it is dragged. */
  const clampView = (v: View): View => {
    const k = Math.max(minK(), Math.min(maxK(), v.k)), m = 60;
    const tx = Math.min(w - m - GOA[0] * k, Math.max(m - GOA[2] * k, v.tx));
    const ty = Math.min(h - m - GOA[1] * k, Math.max(m - GOA[3] * k, v.ty));
    return { k, tx, ty };
  };

  const animateTo = useCallback((to: View, ms = 650) => {
    cancelAnimationFrame(anim.current);
    const from = { ...view.current };
    if (reduce || !from.k) { view.current = to; apply(); return; }
    const t0 = performance.now();
    const step = (now: number) => {
      const p = 1 - Math.pow(1 - Math.min(1, (now - t0) / ms), 3);
      view.current = { k: from.k + (to.k - from.k) * p, tx: from.tx + (to.tx - from.tx) * p, ty: from.ty + (to.ty - from.ty) * p };
      apply();
      if (p < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  }, [apply, reduce]);

  /* What to frame: the open place, else the district or taluka you are in, else all of Goa. */
  const target = selected ?? focus;
  const targetPlace = getPlace(target);
  const targetView = useCallback((): View => {
    const p = targetPlace;
    if (p?.level === 'village' && p.map) return fit(p.map.b, VILLAGE_FILL);
    /* a village with no outline yet: its taluka, outlined (phase 4, B1) */
    if (p?.level === 'village' && p.parent && T[p.parent]) { const b = T[p.parent].view ?? T[p.parent].b, pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.06; return fit([b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad]); }
    if (p?.level === 'taluka') { const b = T[p.id].view ?? T[p.id].b, pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.06; return fit([b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad]); }
    if (p?.level === 'district') { const b = D[p.id].b, pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.04; return fit([b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad]); }
    return fit(GOA);
  }, [targetPlace, fit]);

  /* The Goa view sets the zoom range. Recomputed when the map's box or the chrome around it changes. */
  useLayoutEffect(() => {
    if (!w || !h) return;
    const a = area();
    k0.current = Math.min(a.w / (GOA[2] - GOA[0]), a.h / (GOA[3] - GOA[1]));
    const key = target ?? 'goa';
    const first = !view.current.k;
    if (first) { view.current = targetView(); apply(); framed.current = key; return; }
    /* a new place is always framed; the same place is re-framed after a resize or a sheet change only if the map was not moved */
    if (framed.current !== key) { moved.current = false; framed.current = key; animateTo(targetView()); }
    else if (!moved.current) animateTo(targetView(), 350);
    else apply();
  }, [w, h, area, target, targetView, animateTo, apply]);

  /* ---------- No two names overlap (phase 4, B2) ----------
     After each move, every name that would show is ranked: the open village and its neighbours first, then taluka
     names while they show, then village names by their size on screen (reviewed names before official spellings),
     then river names, then stations. A name that would overlap one ranked above it is hidden. A river name shows
     only where its straight stretch is longer than the name. */
  const widths = useRef(new WeakMap<Element, { t: string; w: number }>());
  const cullFrame = useRef(0), cullTimer = useRef(0), lastCull = useRef(0);
  const cull = () => {
    const el = root.current, { k, tx, ty } = view.current;
    if (!el || !k) return;
    const z = k / k0.current, W = el.clientWidth, H = el.clientHeight, r0 = el.getBoundingClientRect();
    const width = (t: SVGTextElement, scale = 1) => {
      const txt = t.textContent ?? '', c = widths.current.get(t);
      if (c && c.t === txt) return c.w;
      const w = t.getComputedTextLength() * scale; widths.current.set(t, { t: txt, w }); return w;
    };
    const items: { el: Element; q: Quad; p: number; of?: Element }[] = [], short: Element[] = [], skip: Element[] = [];
    const nameAt = new Map<string, { el: Element; q: Quad; cx: number; cy: number; px: number }>();
    const rectQuad = (e: Element): Quad => { const r = e.getBoundingClientRect(); return [[r.left - r0.left, r.top - r0.top], [r.right - r0.left, r.top - r0.top], [r.right - r0.left, r.bottom - r0.top], [r.left - r0.left, r.bottom - r0.top]]; };
    const onScreen = (cx: number, cy: number) => cx > -300 && cy > -300 && cx < W + 300 && cy < H + 300;
    const hasVillage = el.classList.contains('has-village'), openId = getPlace(selected)?.id;
    if (!hasVillage) for (const t of el.querySelectorAll<SVGTextElement>('.k-tmap__taluka')) {
      const op = 1 - (z - 1.7) / 1.2;
      if (op <= 0) { skip.push(t); continue; }
      const b = T[t.dataset.id!]?.b, area = b ? (b[2] - b[0]) * (b[3] - b[1]) : 0;
      /* while a taluka name fades out it gives way to the village names it would sit on */
      items.push({ el: t, q: rectQuad(t), p: op < 0.5 ? 0.5 : 900 + area / 1e4 });
    }
    for (const t of el.querySelectorAll<SVGTextElement>('.k-tmap__name')) {
      const fs = Number(t.dataset.fs), px = fs * k, near = t.classList.contains('is-near');
      const cx = tx + Number(t.dataset.x) * k, cy = ty + Number(t.dataset.y) * k;
      if ((px < 7 && !near) || !onScreen(cx, cy)) { skip.push(t); continue; }
      const w = width(t, t.dataset.latin ? NARROW : 1) * k;
      /* towns above other villages, near the open village or not; below the open village and the taluka names */
      const rank = Number(t.dataset.rank) || 0;
      const p = t.classList.contains('is-open') ? 3000
        : rank ? (hasVillage ? 1500 : 800) + rank * 30 + Math.min(px, 29)
        : near ? 1000 + px : px + (t.classList.contains('is-faint') ? 0 : 3) + (t.classList.contains('is-lit') ? 2 : 0);
      const nq = quad(cx, cy, w + 4, px, Number(t.dataset.a) || 0);
      items.push({ el: t, q: nq, p });
      if (t.dataset.id) nameAt.set(t.dataset.id, { el: t, q: nq, cx, cy, px });
    }
    if (!el.classList.contains('is-layered') || el.classList.contains('k-tmap--written')) for (const t of el.querySelectorAll<SVGTextElement>('.k-tmap__river-name')) {
      if (z <= 2.2) { skip.push(t); continue; }
      const wpx = width(t, k), len = Number(t.dataset.len) * k;
      if (len < wpx + 12) { short.push(t); continue; }
      const m = t.transform.baseVal.consolidate()?.matrix;
      if (!m) continue;
      const cx = tx + m.e * k, cy = ty + m.f * k;
      if (!onScreen(cx, cy)) { skip.push(t); continue; }
      items.push({ el: t, q: quad(cx, cy, wpx + 6, 15, Math.atan2(m.b, m.a) * 180 / Math.PI), p: 5 });
    }
    if (z >= CLOSE_Z) for (const st of el.querySelectorAll('.k-tmap__station')) items.push({ el: st, q: rectQuad(st), p: 1 });
    /* A village's symbols sit in one row just under its name, wherever the name's tilt puts its lower edge, and
       show only while the name shows (phase 4 polish, step 3). They give way to names, except the open village's own. */
    if (z >= CLOSE_Z) for (const g of el.querySelectorAll<HTMLElement>('.k-tmap__glyphs')) {
      const n = nameAt.get(g.dataset.id!);
      /* a name off the edge of the map takes its symbols with it */
      const off = !n || n.q.every(([x]) => x < 0) || n.q.every(([x]) => x > W) || n.q.every(([, y]) => y < 0) || n.q.every(([, y]) => y > H);
      if (!n || off) { g.classList.add('is-culled'); continue; }
      const rw = g.offsetWidth, rh = g.offsetHeight, x0 = n.cx - rw / 2, x1 = n.cx + rw / 2;
      let bottom = -Infinity;
      for (const [x, y] of n.q) if (x >= x0 && x <= x1) bottom = Math.max(bottom, y);
      for (let i = 0; i <= 6; i++) {
        const x = x0 + (x1 - x0) * i / 6;
        for (let e = 0; e < 4; e++) {
          const [ax, ay] = n.q[e], [bx, by] = n.q[(e + 1) % 4];
          if ((x - ax) * (x - bx) > 0 || ax === bx) continue;
          bottom = Math.max(bottom, ay + (by - ay) * (x - ax) / (bx - ax));
        }
      }
      if (!Number.isFinite(bottom)) bottom = n.cy + n.px / 2;
      const top = bottom + 2;
      g.style.setProperty('--gdy', String(Math.round(((top - n.cy) / n.px) * 1000) / 1000));
      items.push({ el: g, q: [[x0, top], [x1, top], [x1, top + rh], [x0, top + rh]], p: g.dataset.id === openId ? 2500 : 2, of: n.el });
    }
    if (z >= CLOSE_Z) for (const m of el.querySelectorAll('.k-tmap__mark')) items.push({ el: m, q: rectQuad(m), p: 2.1 });
    items.sort((a, b) => b.p - a.p);
    /* nothing is drawn under the page's own pieces over the map (phase 4 polish, step 2): they are placed first */
    const placed: { q: Quad; x0: number; y0: number; x1: number; y1: number }[] = chromeBoxes(el, r0);
    for (const it of items) {
      const xs = it.q.map(c => c[0]), ys = it.q.map(c => c[1]);
      const box = { q: it.q, x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
      /* symbols whose name is hidden hide with it */
      const clash = (it.of && it.of.classList.contains('is-culled')) || placed.some(o => o.x0 < box.x1 && box.x0 < o.x1 && o.y0 < box.y1 && box.y0 < o.y1 && overlap(o.q, it.q));
      it.el.classList.toggle('is-culled', clash);
      if (!clash) placed.push(box);
    }
    for (const e of skip) e.classList.remove('is-culled', 'is-short');
    /* which symbols and stations are on screen, for the legend */
    const icons = new Set<string>();
    if (z >= CLOSE_Z) {
      for (const g of el.querySelectorAll<HTMLElement>('.k-tmap__glyphs:not(.is-culled) .k-tmap__glyph')) { const r = g.getBoundingClientRect(); if (r.right > r0.left && r.left < r0.right && r.bottom > r0.top && r.top < r0.bottom) icons.add(g.dataset.icon!); }
      for (const st of el.querySelectorAll('.k-tmap__station:not(.is-culled)')) { const r = st.getBoundingClientRect(); if (r.right > r0.left && r.left < r0.right && r.bottom > r0.top && r.top < r0.bottom) { icons.add('train-front'); break; } }
    }
    const key = [...icons].sort().join(' ');
    setInView(v => (v === key ? v : key));
    for (const e of short) { e.classList.add('is-short'); e.classList.remove('is-culled'); }
    for (const it of items) it.el.classList.remove('is-short');
  };
  /* The pieces of the page over the map: the draft banner, the header's pills, the panel, the card or sheet, the zoom buttons, the key,
     the credit. Measured at most every 300ms, since they move only when the page changes. */
  const chrome = useRef<{ t: number; boxes: { q: Quad; x0: number; y0: number; x1: number; y1: number }[] }>({ t: 0, boxes: [] });
  /* when one of them changes size (a card that grows as its facts arrive, a sheet pulled up), the names are placed again */
  const chromeWatch = useRef<ResizeObserver | null>(null);
  useEffect(() => () => chromeWatch.current?.disconnect(), []);
  const chromeBoxes = (el: HTMLElement, r0: DOMRect) => {
    const now = performance.now();
    if (now - chrome.current.t < 300) return [...chrome.current.boxes];
    if (!chromeWatch.current && typeof ResizeObserver !== 'undefined') chromeWatch.current = new ResizeObserver(() => { chrome.current.t = 0; cullSoon.current(); });
    const solid = (e: Element) => { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) < 0.05) return false; const m = s.backgroundColor.match(/rgba?\(([^)]+)\)/); const a = m ? Number(m[1].split(/[,\s/]+/).filter(Boolean)[3] ?? 1) : 0; return a > 0.5 || s.boxShadow !== 'none'; };
    const rects: DOMRect[] = [];
    const roots = [...document.querySelectorAll('.k-draft-banner, .k-phone-header, .k-phone-bar, .k-desktop-panel, .k-desktop-dock, .k-sheet, .k-desktop-credit, .k-desktop-hint'), ...el.querySelectorAll('.k-tmap__zoom, .k-tmap__legend, .k-key, .k-tmap__credit')];
    for (const root of roots) {
      chromeWatch.current?.observe(root);
      if (solid(root)) { rects.push(root.getBoundingClientRect()); continue; }
      for (const d of root.querySelectorAll('*')) if (!(d instanceof SVGElement) && solid(d)) rects.push(d.getBoundingClientRect());
    }
    const boxes = rects.filter(r => r.width > 1 && r.height > 1).map(r => {
      const x0 = r.left - r0.left, y0 = r.top - r0.top, x1 = r.right - r0.left, y1 = r.bottom - r0.top;
      return { q: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as Quad, x0, y0, x1, y1 };
    });
    chrome.current = { t: now, boxes };
    return [...boxes];
  };
  const cullSoon = useRef(() => {});
  cullSoon.current = () => {
    clearTimeout(cullTimer.current);
    if (performance.now() - lastCull.current > 90) {
      cancelAnimationFrame(cullFrame.current);
      cullFrame.current = requestAnimationFrame(() => { lastCull.current = performance.now(); cull(); });
    }
    cullTimer.current = window.setTimeout(() => { lastCull.current = performance.now(); cull(); }, 140);
  };
  useEffect(() => { document.fonts?.ready.then(() => { widths.current = new WeakMap(); cullSoon.current(); }); }, []);

  /* after any redraw, the map stays where it was */
  useLayoutEffect(() => { if (view.current.k) apply(); cullSoon.current(); });

  /* ---------- Pan, pinch, wheel, tap ---------- */
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ moved: boolean; last: Point; pinch: { d: number; v: View; c: Point } | null } | null>(null);
  const interacted = useRef(false);
  const touched = () => { if (!interacted.current) { interacted.current = true; onInteract?.(); } };
  const zoomAt = (factor: number, cx: number, cy: number) => {
    const v = view.current, k = Math.max(minK(), Math.min(maxK(), v.k * factor));
    view.current = clampView({ k, tx: cx - (cx - v.tx) * k / v.k, ty: cy - (cy - v.ty) * k / v.k });
    moved.current = true;
    apply();
  };
  const local = (e: { clientX: number; clientY: number }): Point => { const r = root.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button, a')) return;
    if (tip) setTip(null);
    if (e.pointerType === 'mouse' && e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimationFrame(anim.current);
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (pointers.current.size === 1) gesture.current = { moved: false, last: p, pinch: null };
    else if (pointers.current.size === 2 && gesture.current) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), v: { ...view.current }, c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] };
      gesture.current.moved = true;
    }
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    const p = local(e);
    pointers.current.set(e.pointerId, p);
    if (g.pinch && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const { v, c } = g.pinch, k = Math.max(minK(), Math.min(maxK(), v.k * d / g.pinch.d));
      const mid: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      view.current = clampView({ k, tx: mid[0] - (c[0] - v.tx) * k / v.k, ty: mid[1] - (c[1] - v.ty) * k / v.k });
      moved.current = true; touched(); apply();
      return;
    }
    const dx = p[0] - g.last[0], dy = p[1] - g.last[1];
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    if (!g.moved) root.current?.classList.add('is-dragging');
    g.moved = true;
    g.last = p;
    view.current = clampView({ ...view.current, tx: view.current.tx + dx, ty: view.current.ty + dy });
    moved.current = true; touched(); apply();
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>, tap: boolean) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) { if (g) g.pinch = null; if (g && pointers.current.size === 1) g.last = [...pointers.current.values()][0]; return; }
    gesture.current = null;
    root.current?.classList.remove('is-dragging');
    if (!tap || !g || g.moved) return;
    touched();
    const id = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-village]')?.getAttribute('data-village');
    if (id) onSelect?.(id); else onBackground?.();
  };
  /* wheel zooms around the pointer; React's wheel listener is passive, so this one is added by hand */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('button, a')) return;
      e.preventDefault();
      cancelAnimationFrame(anim.current);
      const [x, y] = local(e);
      zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016)), x, y);
      touched();
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  });
  const zoomButton = (factor: number) => () => {
    const a = area(), v = view.current, cx = a.x + a.w / 2, cy = a.y + a.h / 2;
    const k = Math.max(minK(), Math.min(maxK(), v.k * factor));
    moved.current = true; touched();
    animateTo(clampView({ k, tx: cx - (cx - v.tx) * k / v.k, ty: cy - (cy - v.ty) * k / v.k }), 300);
  };

  /* ---------- What is drawn ---------- */
  const sel = getPlace(selected);
  const selV = sel?.level === 'village' && sel.map ? sel : null;
  const near = useMemo(() => new Set(selV ? [selV.id, ...selV.map!.nb] : []), [selV]);
  /* a view that colours for meaning: anything but Names in the Official script (phase 4, B3) */
  const layered = !!mapLayer && isColoured(mapLayer, script);
  const viewClass = layered ? (mapLayer!.id === 'names' ? 'written' : mapLayer!.id) : '';
  const drawn = villages && paths ? villages.filter(v => paths[v.id] && v.map) : [];
  const outlineOf = (id: string | null) => {
    const p = getPlace(id);
    if (!p) return null;
    /* a village with no outline yet: its taluka's outline */
    if (p.level === 'village') return paths?.[p.id] ?? (p.parent && T[p.parent] ? T[p.parent].d : null);
    if (p.level === 'taluka') return T[p.id].d;
    if (p.level === 'district') return D[p.id].d;
    return null;
  };
  const selOutline = outlineOf(selected), hotOutline = hot && hot !== selected ? outlineOf(hot) : null;
  const markAt = (id: string) => (markIcon && marks?.[id]) || 0;
  /* what each village is known for: one symbol per kind, three at most */
  const glyphs = factsReady && (!mapLayer || mapLayer.id === 'names')
    ? drawn.map(v => ({ v, items: (factsOf(v.id)?.knownFor ?? []).filter((it, i, a) => a.findIndex(x => x.icon === it.icon) === i).slice(0, 3) })).filter(g => g.items.length)
    : [];

  /* the legend at village zoom: the symbols and stations in view, once each (worked out after each move, below) */
  const [inView, setInView] = useState<string>('');
  const legend = useMemo(() => {
    const out: [IconName, string][] = [];
    for (const icon of inView.split(' ').filter(Boolean) as IconName[]) { const l = SYMBOL_LABEL[icon]; if (l && !out.some(o => o[1] === l)) out.push([icon, l]); }
    return out;
  }, [inView]);
  const style = { '--tl': Math.max(15, Math.min(30, w / 30)), '--map-inset-left': insetLeft + 'px', '--map-inset-top': insetTop + 'px', '--map-inset-bottom': insetBottom + 'px', '--map-inset-right': insetRight + 'px' } as CSSProperties;
  const { k, tx, ty } = view.current;
  return (
    <div ref={root} className={'k-tmap' + (selV ? ' has-village' : '') + (layered ? ' is-layered k-tmap--' + viewClass : '')} style={style}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={e => onUp(e, true)} onPointerCancel={e => onUp(e, false)}>
      {w > 0 && (
        <svg className="k-tmap__svg" width={w} height={h} aria-hidden="true">
          <defs>
            <clipPath id="k-goa-clip" clipPathUnits="userSpaceOnUse">{DISTRICT_IDS.map(id => <path key={id} d={D[id].d} />)}</clipPath>
          </defs>
          {/* the transform is also set here, so a redrawn group never starts at the plain, unzoomed plane */}
          <g ref={world} transform={k > 0 ? `translate(${tx} ${ty}) scale(${k})` : undefined}>
            {/* each taluka in its tint, under the villages: what shows before the village outlines arrive */}
            {TALUKA_IDS.map(id => <path key={'tf' + id} className="k-tmap__base" data-house={houseKey(id)} d={T[id].d} />)}
            <Villages drawn={drawn} paths={paths ?? null} script={script} near={near} mapLayer={layered ? mapLayer : undefined} />
            {lines && <Lines lines={lines} />}
            {TALUKA_IDS.map(id => <path key={'tb' + id} className="k-tmap__border" d={T[id].d} vectorEffect="non-scaling-stroke" />)}
            {hotOutline && <path className="k-tmap__hot" d={hotOutline} vectorEffect="non-scaling-stroke" />}
            {selOutline && <path className="k-tmap__selected" d={selOutline} vectorEffect="non-scaling-stroke" />}
            <Names drawn={drawn} script={script} near={near} mapLayer={layered ? mapLayer : undefined} open={selV?.id ?? null} />
            {lines && (
              /* straight, on each river's straightest stretch; shown when zoomed in and the stretch is long enough */
              <g className="k-tmap__river-names">
                {lines.rivers.map(r => (
                  <text key={r.n} className="k-tmap__river-name" data-len={r.label.len} transform={`translate(${r.label.at[0]} ${r.label.at[1]}) rotate(${r.label.a})`}>{r.n}</text>
                ))}
              </g>
            )}
            <g className="k-tmap__talukas">
              {TALUKA_IDS.map(id => {
                const n = nameIn(getPlace(id), script), [x, y] = talukaPoint(id);
                return <text key={'tl' + id} className="k-tmap__taluka" data-id={id} x={x} y={y} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</text>;
              })}
            </g>
          </g>
        </svg>
      )}
      {/* the live layer that is on: a white tile with its icon and a count, over each place that holds something */}
      {markIcon && marks && (
        <div className="k-tmap__marks" aria-hidden="true">
          {TALUKA_IDS.filter(id => markAt(id) > 0).map(id => { const [x, y] = talukaPoint(id); return <Mark key={'mt' + id} x={x} y={y - 22} icon={markIcon} n={markAt(id)} taluka />; })}
          {drawn.filter(v => markAt(v.id) > 0).map(v => <Mark key={'mv' + v.id} x={v.lp![0]} y={v.lp![1]} fs={v.map!.fs} icon={markIcon} n={markAt(v.id)} />)}
        </div>
      )}
      {/* at village zoom: railway stations, and what villages are known for (feasts, monuments, GI products) */}
      {(lines || glyphs.length > 0) && (
        <div className="k-tmap__marks" aria-hidden="true">
          {lines?.stations.map(st => (
            <span key={st.code} className="k-tmap__station" style={{ '--x': st.at[0], '--y': st.at[1] } as CSSProperties}><Icon name="train-front" size={14} />{st.n}</span>
          ))}
          {glyphs.map(({ v, items }) => (
            <span key={'g' + v.id} className="k-tmap__glyphs" data-id={v.id} style={{ '--x': v.lp![0], '--y': v.lp![1], '--fs': v.map!.fs } as CSSProperties}>
              {items.map(it => (
                /* a tap names what the symbol stands for here; the village's sheet lists it all */
                <button key={it.kind + it.title} type="button" tabIndex={-1} className="k-tmap__glyph" data-icon={it.icon}
                  onClick={e => { const gdy = e.currentTarget.parentElement?.style.getPropertyValue('--gdy') || '.7'; setTip(tp => (tp?.key === v.id + it.icon ? null : { key: v.id + it.icon, x: v.lp![0], y: v.lp![1], fs: v.map!.fs, gdy, place: v.official, lines: (factsOf(v.id)?.knownFor ?? []).filter(x => x.icon === it.icon).map(x => x.title) })); }}>
                  <Icon name={it.icon as IconName} size={16} />
                </button>
              ))}
            </span>
          ))}
          {tip && (
            <span className="k-tmap__tip" style={{ '--x': tip.x, '--y': tip.y, '--fs': tip.fs, '--gdy': tip.gdy } as CSSProperties}>
              <strong>{tip.place}</strong>
              {tip.lines.slice(0, 4).map(l => <span key={l}>{l}</span>)}
              {tip.lines.length > 4 && <span>+{tip.lines.length - 4}</span>}
            </span>
          )}
        </div>
      )}
      {/* what the symbols mean, at village zoom in the Names view; on a phone, behind the "Key" button */}
      {legend.length > 0 && !compactLegend && (
        <ul className="k-tmap__legend" aria-hidden="true">
          {legend.map(([icon, label]) => <li key={icon}><Icon name={icon} size={16} />{label}</li>)}
        </ul>
      )}
      {legend.length > 0 && compactLegend && (
        <div className="k-key">
          <button type="button" className="k-key__button" aria-label="Key to the map" aria-expanded={keyOpen} onClick={() => setKeyOpen(o => !o)}>
            <Icon name="list" size={18} />Key
          </button>
          {keyOpen && (
            <ul className="k-tmap__legend k-key__list">
              {legend.map(([icon, label]) => <li key={icon}><Icon name={icon} size={16} />{label}</li>)}
            </ul>
          )}
        </div>
      )}
      {lines && showCredit && (
        /* OpenStreetMap's licence asks for this wherever its lines are shown */
        <p className="k-tmap__credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">Rivers and railway © OpenStreetMap contributors</a></p>
      )}
      <div className="k-tmap__zoom">
        <button type="button" className="k-tmap__zoom-button" aria-label="Zoom in" onClick={zoomButton(1.6)}><Icon name="plus" size={22} /></button>
        <button type="button" className="k-tmap__zoom-button" aria-label="Zoom out" onClick={zoomButton(1 / 1.6)}><Icon name="minus" size={22} /></button>
      </div>
    </div>
  );
}

/** A white tile with the live layer's icon and count, kept the same size on screen at every zoom. */
function Mark({ x, y, fs, icon, n, taluka = false }: { x: number; y: number; fs?: number; icon: IconName; n: number; taluka?: boolean }) {
  return (
    <span className={taluka ? 'k-tmap__mark k-tmap__mark--taluka' : 'k-tmap__mark'} style={{ '--x': x, '--y': y, '--fs': fs ?? 0 } as CSSProperties}>
      <Icon name={icon} size={16} />{n > 1 || taluka ? n : null}
    </span>
  );
}

/** Rivers and railway, clipped to Goa. Drawn once: a pan or zoom only changes the CSS numbers they read. */
const Lines = memo(function Lines({ lines }: { lines: MapLines }) {
  return (
    <g className="k-tmap__lines" clipPath="url(#k-goa-clip)">
      {lines.rivers.map(r => r.d.map((d, i) => <path key={r.n + i} className="k-tmap__river" d={d} style={{ '--w': r.w } as CSSProperties} />))}
      {lines.rail.map((d, i) => <path key={'r' + i} className="k-tmap__rail" d={d} vectorEffect="non-scaling-stroke" />)}
    </g>
  );
});

interface LayerProps { drawn: Place[]; script: Script; near: Set<string>; mapLayer?: MapLayer }

/** The village outlines, grouped by taluka so each group carries its house colours. */
const Villages = memo(function Villages({ drawn, paths, near, mapLayer, script }: LayerProps & { paths: VillagePaths | null }) {
  return (
    <g className="k-tmap__villages">
      {TALUKA_IDS.map(t => (
        <g key={t} data-house={houseKey(t)}>
          {drawn.filter(v => v.parent === t).map(v => {
            const st = mapLayer ? layerState(v, mapLayer, script) : null;
            return <path key={v.id} data-village={v.id} className={'k-tmap__v' + (st ? ' is-' + st : '') + (near.size && !near.has(v.id) ? ' is-off' : '')} d={paths![v.id]} vectorEffect="non-scaling-stroke" />;
          })}
        </g>
      ))}
    </g>
  );
});

/** The names, one per outline, in the chosen script. */
const Names = memo(function Names({ drawn, script, near, mapLayer, open }: LayerProps & { open: string | null }) {
  return (
    <g className="k-tmap__names">
      {TALUKA_IDS.map(t => (
        <g key={t} data-house={houseKey(t)}>
          {drawn.filter(v => v.parent === t).map(v => {
            const n = nameIn(v, script), m = v.map!, [x, y] = v.lp!;
            const st = mapLayer ? layerState(v, mapLayer, script) : null;
            const cls = 'k-tmap__name' + (n.fallback ? ' is-faint' : '') + (st ? ' is-' + st : '') + (near.size ? (near.has(v.id) ? ' is-near' : ' is-off') : '') + (v.id === open ? ' is-open' : '');
            const latin = n.kind !== 'deva', rank = townRank(v);
            return (
              <text key={v.id} className={cls + (rank ? ' is-town' : '')} data-id={v.id} data-rank={rank || undefined} fontSize={m.fs} lang={n.kind === 'deva' ? 'gom' : undefined} style={{ '--fs': m.fs } as CSSProperties}
                data-x={x} data-y={y} data-a={m.a} data-fs={m.fs} data-latin={latin ? 1 : undefined}
                transform={`translate(${x} ${y})${m.a ? ` rotate(${m.a})` : ''}${latin ? ` scale(${NARROW} 1)` : ''}`}>{n.text}</text>
            );
          })}
        </g>
      ))}
    </g>
  );
});
