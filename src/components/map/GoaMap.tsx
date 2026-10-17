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

   SVG only. The names on the map are aria-hidden: search, the lists and the plain links on every page are how a
   screen reader or keyboard reaches each village. Most of the moving is done with CSS custom properties on the
   map's box (--k: the zoom, --z: the zoom against the Goa view), so a pan or zoom never re-renders React. */
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { GEO, TALUKA_IDS, type VillagePaths } from '../../data/geo';
import { getPlace, houseOf, nameIn } from '../../data/khoim';
import type { Box, Place, Point, Script } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import { layerState, type MapLayer } from '../../lib/layers';
import { Icon } from '../core/Icon';
import type { IconName } from '../core/iconPaths';
import './map.css';

const T = GEO.talukas, D = GEO.districts;
const GOA: Box = [20, 30, 985, 1400];
/* Where a taluka's name sits better a little away from the shape's label point. */
const NUDGE: Record<string, Point> = { mormugao: [-10, 4], quepem: [-45, 95] };
const talukaPoint = (id: string): Point => { const n = NUDGE[id] || [0, 0]; return [T[id].lp[0] + n[0], T[id].lp[1] + n[1]]; };
const houseKey = (id: string) => houseOf(getPlace(id)).key;
/** How far in and out you can zoom, against the Goa view. */
const MIN_Z = 0.8, MAX_Z = 22;
/** A selected village fills this much of the free space (the prototype's figure), up to 14 times the Goa view. */
const VILLAGE_FILL = 0.55, VILLAGE_MAX_Z = 14;
/** Official spellings are set narrower on the map, close to the prototype's width-75 Anek Latin. */
const NARROW = 0.84;

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
}

interface View { k: number; tx: number; ty: number }

export function GoaMap({
  selected = null, focus = null, hot = null, script = 'deva', onSelect, onBackground, onInteract,
  insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, villages, paths, mapLayer, marks, markIcon
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

  /* the free space for the map, and the zoom that fits all of Goa in it */
  const area = useCallback(() => {
    const aw = Math.max(1, w - insetLeft - insetRight), ah = Math.max(1, h - insetTop - insetBottom);
    return { x: insetLeft, y: insetTop, w: aw, h: ah };
  }, [w, h, insetLeft, insetRight, insetTop, insetBottom]);
  const fit = useCallback((b: Box, fill = 1, maxZ = MAX_Z): View => {
    const a = area(), bw = b[2] - b[0], bh = b[3] - b[1];
    const k = Math.min(a.w / bw, a.h / bh) * fill;
    const kk = Math.max(k0.current * MIN_Z, Math.min(k0.current * maxZ, k));
    return { k: kk, tx: a.x + a.w / 2 - (b[0] + bw / 2) * kk, ty: a.y + a.h / 2 - (b[1] + bh / 2) * kk };
  }, [area]);

  const apply = useCallback(() => {
    const { k, tx, ty } = view.current, el = root.current;
    world.current?.setAttribute('transform', `translate(${tx} ${ty}) scale(${k})`);
    if (!el) return;
    el.style.setProperty('--k', String(k));
    el.style.setProperty('--z', String(k / k0.current));
    el.style.setProperty('--tx', String(tx));
    el.style.setProperty('--ty', String(ty));
  }, []);

  /* Keep some of Goa on screen, however far it is dragged. */
  const clampView = (v: View): View => {
    const k = Math.max(k0.current * MIN_Z, Math.min(k0.current * MAX_Z, v.k)), m = 60;
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
    if (p?.level === 'village' && p.map) return fit(p.map.b, VILLAGE_FILL, VILLAGE_MAX_Z);
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

  /* ---------- Pan, pinch, wheel, tap ---------- */
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{ moved: boolean; last: Point; pinch: { d: number; v: View; c: Point } | null } | null>(null);
  const interacted = useRef(false);
  const touched = () => { if (!interacted.current) { interacted.current = true; onInteract?.(); } };
  const zoomAt = (factor: number, cx: number, cy: number) => {
    const v = view.current, k = Math.max(k0.current * MIN_Z, Math.min(k0.current * MAX_Z, v.k * factor));
    view.current = clampView({ k, tx: cx - (cx - v.tx) * k / v.k, ty: cy - (cy - v.ty) * k / v.k });
    moved.current = true;
    apply();
  };
  const local = (e: { clientX: number; clientY: number }): Point => { const r = root.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button, a')) return;
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
      const { v, c } = g.pinch, k = Math.max(k0.current * MIN_Z, Math.min(k0.current * MAX_Z, v.k * d / g.pinch.d));
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
    const k = Math.max(k0.current * MIN_Z, Math.min(k0.current * MAX_Z, v.k * factor));
    moved.current = true; touched();
    animateTo(clampView({ k, tx: cx - (cx - v.tx) * k / v.k, ty: cy - (cy - v.ty) * k / v.k }), 300);
  };

  /* ---------- What is drawn ---------- */
  const sel = getPlace(selected);
  const selV = sel?.level === 'village' && sel.map ? sel : null;
  const near = useMemo(() => new Set(selV ? [selV.id, ...selV.map!.nb] : []), [selV]);
  const layered = !!mapLayer && mapLayer.id !== 'names';
  const drawn = villages && paths ? villages.filter(v => paths[v.id] && v.map) : [];
  const outlineOf = (id: string | null) => {
    const p = getPlace(id);
    if (!p) return null;
    if (p.level === 'village') return paths?.[p.id] ?? null;
    if (p.level === 'taluka') return T[p.id].d;
    if (p.level === 'district') return D[p.id].d;
    return null;
  };
  const selOutline = outlineOf(selected), hotOutline = hot && hot !== selected ? outlineOf(hot) : null;
  const markAt = (id: string) => (markIcon && marks?.[id]) || 0;

  const style = { '--tl': Math.max(15, Math.min(30, w / 30)), '--map-inset-bottom': insetBottom + 'px' } as CSSProperties;
  return (
    <div ref={root} className={'k-tmap' + (selV ? ' has-village' : '') + (layered ? ' is-layered k-tmap--' + mapLayer!.id : '')} style={style}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={e => onUp(e, true)} onPointerCancel={e => onUp(e, false)}>
      {w > 0 && (
        <svg className="k-tmap__svg" width={w} height={h} aria-hidden="true">
          <g ref={world}>
            {/* each taluka in its tint, under the villages: what shows before the village outlines arrive */}
            {TALUKA_IDS.map(id => <path key={'tf' + id} className="k-tmap__base" data-house={houseKey(id)} d={T[id].d} />)}
            <Villages drawn={drawn} paths={paths ?? null} script={script} near={near} mapLayer={mapLayer} />
            {TALUKA_IDS.map(id => <path key={'tb' + id} className="k-tmap__border" d={T[id].d} vectorEffect="non-scaling-stroke" />)}
            {hotOutline && <path className="k-tmap__hot" d={hotOutline} vectorEffect="non-scaling-stroke" />}
            {selOutline && <path className="k-tmap__selected" d={selOutline} vectorEffect="non-scaling-stroke" />}
            <Names drawn={drawn} script={script} near={near} mapLayer={mapLayer} />
            <g className="k-tmap__talukas">
              {TALUKA_IDS.map(id => {
                const n = nameIn(getPlace(id), script), [x, y] = talukaPoint(id);
                return <text key={'tl' + id} className="k-tmap__taluka" x={x} y={y} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</text>;
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
      <div className="k-tmap__zoom">
        {/* TODO(copy): "Zoom in" and "Zoom out" are new; the buttons are the way to zoom without pinching */}
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

interface LayerProps { drawn: Place[]; script: Script; near: Set<string>; mapLayer?: MapLayer }

/** The village outlines, grouped by taluka so each group carries its house colours. */
const Villages = memo(function Villages({ drawn, paths, near, mapLayer }: LayerProps & { paths: VillagePaths | null }) {
  const today = new Date();
  return (
    <g className="k-tmap__villages">
      {TALUKA_IDS.map(t => (
        <g key={t} data-house={houseKey(t)}>
          {drawn.filter(v => v.parent === t).map(v => {
            const st = mapLayer && mapLayer.id !== 'names' ? layerState(v, mapLayer, today) : null;
            return <path key={v.id} data-village={v.id} className={'k-tmap__v' + (st ? ' is-' + st : '') + (near.size && !near.has(v.id) ? ' is-off' : '')} d={paths![v.id]} vectorEffect="non-scaling-stroke" />;
          })}
        </g>
      ))}
    </g>
  );
});

/** The names, one per outline, in the chosen script. */
const Names = memo(function Names({ drawn, script, near, mapLayer }: LayerProps) {
  const today = new Date();
  return (
    <g className="k-tmap__names">
      {TALUKA_IDS.map(t => (
        <g key={t} data-house={houseKey(t)}>
          {drawn.filter(v => v.parent === t).map(v => {
            const n = nameIn(v, script), m = v.map!, [x, y] = v.lp!;
            const st = mapLayer && mapLayer.id !== 'names' ? layerState(v, mapLayer, today) : null;
            const cls = 'k-tmap__name' + (n.fallback ? ' is-faint' : '') + (st ? ' is-' + st : '') + (near.size ? (near.has(v.id) ? ' is-near' : ' is-off') : '');
            const latin = n.kind !== 'deva';
            return (
              <text key={v.id} className={cls} fontSize={m.fs} lang={n.kind === 'deva' ? 'gom' : undefined} style={{ '--fs': m.fs } as CSSProperties}
                transform={`translate(${x} ${y})${m.a ? ` rotate(${m.a})` : ''}${latin ? ` scale(${NARROW} 1)` : ''}`}>{n.text}</text>
            );
          })}
        </g>
      ))}
    </g>
  );
});
