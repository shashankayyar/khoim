/* Goa as a street of painted houses: each taluka lime-washed in its house colour, white trim between them.
   Tap selects, tap again goes inside (the parent decides). Press and drag scrubs with a loupe.
   Every label is a real button with a spoken name, so the map works with a keyboard and a screen reader.
   Ported from design/components/map/GoaMap.jsx. SVG only: no tiles, no WebGL, no pins. */
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { GEO, TALUKA_IDS, type VillagePaths } from '../../data/geo';
import { getPlace, houseOf, nameIn, spokenName } from '../../data/khoim';
import type { Box, Place, Point, Script } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import './map.css';

const T = GEO.talukas;
const GOA: Box = [20, 30, 985, 1400];
const NUDGE: Record<string, Point> = { mormugao: [-10, 4] };
const districtOf = (talukaId: string) => T[talukaId].district;
const houseKey = (id: string) => houseOf(getPlace(id)).key;

function boxFor(focus: string | null): Box {
  const b = focus ? (T[focus]?.view ?? T[focus]?.b ?? GEO.districts[focus]?.b) : null;
  if (!b) return GOA;
  const [x0, y0, x1, y1] = b, pad = Math.max(x1 - x0, y1 - y0) * 0.06;
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
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
  /** null = all Goa; a district id ('south-goa') or taluka id ('salcete') */
  focus?: string | null;
  /** selected place id: district, taluka or village ('v626925') */
  selected?: string | null;
  /** transient highlight while scrubbing or swiping a strip */
  hot?: string | null;
  script?: Script;
  /** (id, fromScrub) */
  onSelect?: (id: string, fromScrub: boolean) => void;
  onHot?: (id: string | null) => void;
  /** px kept clear for floating chrome, so Goa fits between the header and the sheet */
  insetTop?: number;
  insetBottom?: number;
  insetLeft?: number;
  insetRight?: number;
  /** repaint talukas north to south on mount (first load only). Skipped under reduced motion */
  paintIn?: boolean;
  /** Villages of the focused taluka that have an outline, once loaded. */
  villages?: Place[];
  /** Outlines of those villages, once loaded. */
  villagePaths?: VillagePaths | null;
}

export function GoaMap({
  focus = null, selected = null, hot = null, script = 'deva', onSelect, onHot,
  insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, paintIn = false, villages, villagePaths
}: GoaMapProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const prev = useRef<{ focus: string | null; s: number; ox: number; oy: number } | null>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean; u: string | null } | null>(null);
  const { w, h } = useSize(ref);
  const [painted, setPainted] = useState<Set<string>>(() => new Set(paintIn && !reduce ? [] : TALUKA_IDS));
  const [scrub, setScrub] = useState<{ x: number; y: number; u: string | null } | null>(null);

  useEffect(() => {
    if (!paintIn || reduce) { setPainted(new Set(TALUKA_IDS)); return; }
    const order = TALUKA_IDS.slice().sort((a, b) => T[a].lp[1] - T[b].lp[1]);
    const timers = order.map((id, i) => setTimeout(() => setPainted(p => new Set([...p, id])), 200 + i * 60));
    return () => timers.forEach(clearTimeout);
  }, [paintIn, reduce]);

  const box = boxFor(focus), bw = box[2] - box[0], bh = box[3] - box[1];
  const aw = Math.max(1, w - insetLeft - insetRight - 24), ah = Math.max(1, h - insetTop - insetBottom);
  const s = w && h ? Math.min(aw / bw, ah / bh) : 0;
  const ox = insetLeft + 12 + (aw - bw * s) / 2 - box[0] * s, oy = insetTop + (ah - bh * s) / 2 - box[1] * s;
  const P = ([x, y]: Point): Point => [x * s + ox, y * s + oy];

  /* one composited transform from the old view to the new one */
  useLayoutEffect(() => {
    const el = stage.current, pv = prev.current;
    if (el && pv && pv.s && s && !reduce && (pv.focus !== focus || Math.abs(pv.oy - oy) > 1 || Math.abs(pv.ox - ox) > 1 || Math.abs(pv.s - s) > 0.001)) {
      const k = pv.s / s;
      el.style.transition = 'none';
      el.style.transform = `translate(${pv.ox - ox * k}px,${pv.oy - oy * k}px) scale(${k})`;
      el.getBoundingClientRect();
      el.style.transition = `transform ${pv.focus !== focus ? 'var(--dur-zoom)' : 'var(--dur-sheet)'} var(--ease-out)`;
      el.style.transform = 'none';
    }
    prev.current = { focus, s, ox, oy };
  }, [focus, s, ox, oy, reduce]);

  const fp = focus ? getPlace(focus) : null;
  const level = fp ? fp.level : 'state';
  const active = hot || selected;
  const lit = (id: string) => {
    if (level === 'state') return !active || districtOf(id) === active;
    if (level === 'district') return districtOf(id) === focus && (!active || active === id);
    return id === focus;
  };

  const unitAt = (x: number, y: number) => document.elementFromPoint(x, y)?.closest('[data-unit]')?.getAttribute('data-unit') ?? null;
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button > 0 || (e.target as Element).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false, u: unitAt(e.clientX, e.clientY) };
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !ref.current) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    d.u = unitAt(e.clientX, e.clientY);
    const r = ref.current.getBoundingClientRect();
    setScrub({ x: e.clientX - r.left, y: e.clientY - r.top, u: d.u });
    onHot?.(d.u);
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setScrub(null);
    onHot?.(null);
    if (d.u) onSelect?.(d.u, d.moved);
  };

  const inFocus = level === 'district' ? TALUKA_IDS.filter(id => districtOf(id) === focus) : [];
  const shown = level === 'taluka' && villages && villagePaths ? villages.filter(v => villagePaths[v.id] && v.lp) : [];
  /* what a tap lands on: districts (drawn from their talukas), then talukas, then villages */
  const units: [key: string, unit: string, d: string][] =
    level === 'state' ? TALUKA_IDS.map(id => [id, districtOf(id), T[id].d])
    : level === 'district' ? inFocus.map(id => [id, id, T[id].d])
    : shown.map(v => [v.id, v.id, villagePaths![v.id]]);
  const labelIds = level === 'state' ? TALUKA_IDS : inFocus;
  const inv = s ? 1 / s : 1;
  const selV = level === 'taluka' && active && active[0] === 'v' ? getPlace(active) : null;
  const scrubP = scrub && scrub.u ? getPlace(scrub.u) : null;

  return (
    <div ref={ref} className="k-map" role="group" aria-label="Map of Goa" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div ref={stage} className="k-map__stage">
        {s > 0 && (
          <svg className="k-map__svg" width={w} height={h} aria-hidden="true">
            <defs>
              {TALUKA_IDS.map(id => {
                const b = T[id].b;
                return (
                  <clipPath key={id} id={'khoim-paint-' + id} clipPathUnits="userSpaceOnUse">
                    <rect className={painted.has(id) ? 'k-map__wipe is-painted' : 'k-map__wipe'} x={b[0] - 4} y={b[1] - 4} width={b[2] - b[0] + 8} height={b[3] - b[1] + 8} />
                  </clipPath>
                );
              })}
            </defs>
            <g transform={`translate(${ox},${oy}) scale(${s})`}>
              {TALUKA_IDS.map(id => <path key={'e' + id} className="k-map__empty" d={T[id].d} vectorEffect="non-scaling-stroke" />)}
              {TALUKA_IDS.map(id => (
                <path key={id} className={lit(id) ? 'k-map__taluka is-lit' : 'k-map__taluka'} data-house={houseKey(id)} d={T[id].d}
                  clipPath={`url(#khoim-paint-${id})`} strokeWidth={level === 'state' ? 2.5 : 3} vectorEffect="non-scaling-stroke" />
              ))}
              {shown.map(v => <path key={'vp' + v.id} className="k-map__village" d={villagePaths![v.id]} vectorEffect="non-scaling-stroke" />)}
              <g data-house={focus ? houseKey(focus) : undefined}>
                {shown.map(v => {
                  const on = v.id === active;
                  return <circle key={'vd' + v.id} className={on ? 'k-map__dot is-on' : 'k-map__dot'} cx={v.lp![0]} cy={v.lp![1]} r={(on ? 9 : v.town ? 5 : 4) * inv} strokeWidth={3 * inv} />;
                })}
              </g>
              {units.map(([key, unit, d]) => <path key={'h' + key} className="k-map__hit" data-unit={unit} d={d} />)}
            </g>
          </svg>
        )}
        <div className="k-map__labels">
          {s > 0 && labelIds.map(id => {
            const p = getPlace(id)!, n = nameIn(p, script), on = lit(id), nd = NUDGE[id] || [0, 0];
            const [x, y] = P([T[id].lp[0] + nd[0], T[id].lp[1] + nd[1]]);
            const big = level === 'district';
            const size = big ? (active === id ? 24 : 20) : (active && districtOf(id) === active ? 15 : 14);
            const target = level === 'state' ? districtOf(id) : id;
            return (
              <button key={id} type="button" lang={n.kind === 'deva' ? 'gom' : undefined}
                className={'k-map__label' + (n.kind === 'deva' ? ' k-map__label--deva' : '') + (on ? ' is-lit' : '')}
                data-house={houseKey(id)}
                aria-label={level === 'state' ? spokenName(getPlace(target)) + ' Includes ' + p.official + '.' : spokenName(p)}
                aria-pressed={selected === target}
                onClick={() => onSelect?.(target, false)}
                style={{ left: x, top: y, fontSize: n.fallback ? size - 2 : size, visibility: painted.has(id) ? 'visible' : 'hidden' }}>
                {n.text}
              </button>
            );
          })}
          {selV && selV.lp && (() => {
            const [x, y] = P(selV.lp);
            return <span className="k-map__tag" style={{ left: x, top: y - 20 }}>{selV.official}</span>;
          })()}
        </div>
      </div>
      {scrubP && scrub && <Loupe p={scrubP} x={scrub.x} y={scrub.y} w={w} script={script} />}
    </div>
  );
}

/* Follows the finger while scrubbing: the name under it, on its house colour, inside a trim frame. */
function Loupe({ p, x, y, w, script }: { p: Place; x: number; y: number; w: number; script: Script }) {
  const n = nameIn(p, script === 'official' ? 'deva' : script);
  const second = (p.romi && n.kind === 'deva' ? p.romi + ' · ' : '') + p.official;
  return (
    <div className="k-loupe" aria-hidden="true" data-house={houseOf(p).key} style={{ left: Math.max(12, Math.min(w - 232, x - 110)), top: Math.max(8, y - 150) }}>
      <div className="k-loupe__frame">
        <div className={n.kind === 'deva' ? 'k-loupe__name k-loupe__name--deva' : 'k-loupe__name'} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</div>
        {second !== n.text && <div className="k-loupe__more">{second}</div>}
      </div>
    </div>
  );
}
