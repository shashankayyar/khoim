/* Goa as a street of painted houses, shown one level at a time.
   - All of Goa: three districts, each in its district colour, named, with a faint hint of the talukas inside.
   - Inside a district: its talukas in their own house colours, named. The other districts stay in their
     district colours, dimmed, and can be tapped to move across.
   - Inside a taluka: its villages as dots.
   A white trim line always runs between districts. Labels show the name in the chosen script only.
   Tapping a place opens it (the parent decides what that means).
   Press and drag scrubs with a loupe. Every label is a real button with a spoken name, so the map works with a
   keyboard and a screen reader. Based on design/components/map/GoaMap.jsx. SVG only: no tiles, no WebGL, no pins.

   With a layer other than Names switched on, a place that has something in that layer carries a small white
   tile with the layer's icon and a count (the design's plan for layer marks: white trim tiles, never pins).
   The tile is not a button of its own: tapping the place opens its card, where the things are. */
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { DISTRICT_IDS, GEO, TALUKA_IDS, type VillagePaths } from '../../data/geo';
import { STATUS_TEXT, childCount, getPlace, houseOf, nameIn, whereLabel } from '../../data/khoim';
import type { Box, Place, Point, Script } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import { Icon } from '../core/Icon';
import type { IconName } from '../core/iconPaths';
import './map.css';

const T = GEO.talukas, D = GEO.districts;
const GOA: Box = [20, 30, 985, 1400];
/* Where a label sits better a little away from the shape's label point:
   South Goa in its wide southern half instead of the narrow neck, Quepem in its main body instead of on its edge. */
const NUDGE: Record<string, Point> = { mormugao: [-10, 4], 'south-goa': [10, 30], quepem: [-45, 95] };
const labelPoint = (id: string, lp: Point): Point => { const n = NUDGE[id] || [0, 0]; return [lp[0] + n[0], lp[1] + n[1]]; };
const districtOf = (talukaId: string) => T[talukaId].district;
const houseKey = (id: string) => houseOf(getPlace(id)).key;

function boxFor(focus: string | null): Box {
  const b = focus ? (T[focus]?.view ?? T[focus]?.b ?? D[focus]?.b) : null;
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
  /** transient highlight while scrubbing, hovering or swiping a strip */
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
  /** With a layer other than Names on: how many things each place holds in it (counting the places inside it),
      and that layer's icon and name. */
  marks?: Record<string, number> | null;
  markIcon?: IconName;
  markLabel?: string;
}

export function GoaMap({
  focus = null, selected = null, hot = null, script = 'deva', onSelect, onHot,
  insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, paintIn = false, villages, villagePaths, marks, markIcon, markLabel
}: GoaMapProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null), labelLayer = useRef<HTMLDivElement>(null);
  const prev = useRef<{ focus: string | null; s: number; ox: number; oy: number } | null>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean; u: string | null } | null>(null);
  const hover = useRef<string | null>(null);
  const { w, h } = useSize(ref);
  const [painted, setPainted] = useState<Set<string>>(() => new Set(paintIn && !reduce ? [] : TALUKA_IDS));
  const [scrub, setScrub] = useState<{ x: number; y: number; u: string | null } | null>(null);
  /* For the current view (place, script, size): how many extra lines each label has room for, and how many
     times this has been checked (twice is enough: all lines, then one fewer). */
  const [fit, setFit] = useState<{ view: string; pass: number; max: Record<string, number> } | null>(null);

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
  /* the district you are in, at district and taluka level */
  const home = level === 'district' ? focus : level === 'taluka' ? districtOf(focus!) : null;
  /* what is highlighted, other than the place you are already inside */
  const act = (hot || selected) === focus ? null : (hot || selected);

  /* A taluka shows its own colour only inside the district you are in. Everywhere else it wears its district's colour. */
  const detailed = (id: string) => home !== null && districtOf(id) === home;
  const lit = (id: string) => {
    if (level === 'state') return !act || districtOf(id) === act;
    if (level === 'district') return detailed(id) && (!act || act === id);
    return id === focus;
  };
  /* what a tap on a taluka's shape opens: the taluka inside your district, the district everywhere else */
  const targetOf = (id: string) => (detailed(id) ? id : districtOf(id));

  const unitAt = (x: number, y: number) => document.elementFromPoint(x, y)?.closest('[data-unit]')?.getAttribute('data-unit') ?? null;
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button > 0 || (e.target as Element).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, moved: false, u: unitAt(e.clientX, e.clientY) };
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!ref.current) return;
    if (!d) {
      /* a mouse resting on a place lights it up, so you can see it will respond */
      if (e.pointerType !== 'mouse') return;
      const u = (e.target as Element).closest('button') ? hover.current : unitAt(e.clientX, e.clientY);
      if (u !== hover.current) { hover.current = u; onHot?.(u); }
      return;
    }
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    d.u = unitAt(e.clientX, e.clientY);
    const r = ref.current.getBoundingClientRect();
    setScrub({ x: e.clientX - r.left, y: e.clientY - r.top, u: d.u });
    onHot?.(d.u);
  };
  const end = (pick: boolean) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setScrub(null);
    hover.current = null;
    onHot?.(null);
    if (pick && d.u) onSelect?.(d.u, d.moved);
  };
  const leave = () => { if (!drag.current && hover.current) { hover.current = null; onHot?.(null); } };
  const hoverLabel = (id: string | null) => (e: PointerEvent) => { if (e.pointerType === 'mouse' && !drag.current) { hover.current = id; onHot?.(id); } };

  const shown = level === 'taluka' && villages && villagePaths ? villages.filter(v => villagePaths[v.id] && v.lp) : [];
  const inv = s ? 1 / s : 1;
  const selV = level === 'taluka' && act && act[0] === 'v' ? getPlace(act) : null;
  const scrubP = scrub && scrub.u ? getPlace(scrub.u) : null;
  const markAt = (id: string) => (markIcon && marks?.[id]) || 0;
  const allPainted = painted.size === TALUKA_IDS.length;

  /* On a small map (a narrow or short phone) Goa's district labels shrink and drop their count, so they do not
     collide. On a very small one they show the name only. */
  const mapWidth = bw * s, roomy = mapWidth >= 270, tiny = mapWidth < 230;

  /* The line under a district's name (its taluka count) is worth having only where it fits.
     After laying the labels out, work out where each will sit. A label loses its extra line if it would run
     outside its own shape or into another label. */
  const view = `${focus}|${script}|${Math.round(s * 1000)}|${w}|${h}`;
  const pass = fit?.view === view ? fit.pass : 0;
  const maxLines = fit?.view === view ? fit.max : {};
  useLayoutEffect(() => {
    const layer = labelLayer.current, svg = ref.current?.querySelector('svg');
    if (pass >= 2 || !layer || !svg || !s) return;
    type Rect = { x0: number; y0: number; x1: number; y1: number };
    const found = [...layer.querySelectorAll<HTMLElement>('.k-map__label')].map(el => {
      const id = el.dataset.id!, name = el.querySelector<HTMLElement>('.k-map__label-name')!, sub = el.querySelector<HTMLElement>('.k-map__label-sub');
      /* positions from the layout, not from the screen: the map may be mid-zoom */
      const cx = parseFloat(el.style.left), cy = parseFloat(el.style.top);
      const nameBox: Rect = { x0: cx - name.offsetWidth / 2, y0: cy - name.offsetHeight / 2, x1: cx + name.offsetWidth / 2, y1: cy + name.offsetHeight / 2 };
      const top = cy + el.offsetHeight / 2 - 12;
      const subBox: Rect | null = sub ? { x0: cx - sub.offsetWidth / 2, y0: top, x1: cx + sub.offsetWidth / 2, y1: top + sub.offsetHeight } : null;
      return { id, nameBox, subBox, lines: sub ? sub.children.length : 0 };
    });
    const hits = (a: Rect, b: Rect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const inside = (id: string, r: Rect) => {
      const shape = svg.querySelector<SVGGeometryElement>(`[data-shape="${id}"]`);
      if (!shape) return true;
      return [[r.x0, r.y0], [r.x1, r.y0], [r.x0, r.y1], [r.x1, r.y1]].every(([x, y]) => shape.isPointInFill(new DOMPoint((x - ox) / s, (y - oy) / s)));
    };
    const max = { ...maxLines };
    for (const a of found) {
      if (!a.subBox) continue;
      const fits = inside(a.id, a.subBox) && !found.some(b => b !== a && (hits(a.subBox!, b.nameBox) || (b.subBox ? hits(a.subBox!, b.subBox) : false)));
      if (!fits) max[a.id] = a.lines - 1;
    }
    setFit({ view, pass: pass + 1, max });
  });

  /* Labels: districts over all of Goa, talukas inside a district. Each is a button. */
  const labels: { id: string; at: Point; size: number; sub: string | null; on: boolean; shownNow: boolean }[] =
    level === 'state'
      ? DISTRICT_IDS.map(id => ({ id, at: labelPoint(id, D[id].lp), size: roomy ? 24 : tiny ? 18 : 20, sub: roomy ? `${childCount(getPlace(id)!)} talukas` : null, on: !act || act === id, shownNow: allPainted }))
      : level === 'district'
        ? TALUKA_IDS.filter(detailed).map(id => ({ id, at: labelPoint(id, T[id].lp), size: act === id ? 24 : 20, sub: null, on: lit(id), shownNow: painted.has(id) }))
        : [];

  return (
    <div ref={ref} className="k-map" role="group" aria-label="Map of Goa"
      onPointerDown={down} onPointerMove={move} onPointerUp={() => end(true)} onPointerCancel={() => end(false)} onPointerLeave={leave}>
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
                <path key={id} data-shape={detailed(id) ? id : undefined} className={'k-map__taluka' + (lit(id) ? ' is-lit' : '') + (detailed(id) ? '' : ' k-map__taluka--hint')}
                  data-house={houseKey(detailed(id) ? id : districtOf(id))} d={T[id].d}
                  clipPath={`url(#khoim-paint-${id})`} vectorEffect="non-scaling-stroke" />
              ))}
              {DISTRICT_IDS.map(id => <path key={'d' + id} data-shape={level === 'state' ? id : undefined} className="k-map__district" d={D[id].d} vectorEffect="non-scaling-stroke" />)}
              {shown.map(v => <path key={'vp' + v.id} className="k-map__village" d={villagePaths![v.id]} vectorEffect="non-scaling-stroke" />)}
              <g data-house={focus ? houseKey(focus) : undefined}>
                {shown.map(v => {
                  const on = v.id === act;
                  return <circle key={'vd' + v.id} className={on ? 'k-map__dot is-on' : 'k-map__dot'} cx={v.lp![0]} cy={v.lp![1]} r={(on ? 9 : v.town ? 5 : 4) * inv} strokeWidth={3 * inv} />;
                })}
              </g>
              {/* what a tap lands on: every taluka shape, then the villages on top inside a taluka */}
              {TALUKA_IDS.filter(id => id !== focus).map(id => <path key={'h' + id} className="k-map__hit" data-unit={targetOf(id)} d={T[id].d} />)}
              {shown.map(v => <path key={'h' + v.id} className="k-map__hit" data-unit={v.id} d={villagePaths![v.id]} />)}
            </g>
          </svg>
        )}
        <div ref={labelLayer} className="k-map__labels">
          {s > 0 && labels.map(l => {
            const p = getPlace(l.id)!, n = nameIn(p, script);
            const [x, y] = P(l.at);
            /* under a Konkani name, the official spelling, for anyone who does not read the script yet */
            /* The map shows each name in the script chosen in the toggle, and nothing else. All the forms are on
               the card. The only second line is a district's taluka count, where it fits. */
            const lines = tiny || !l.sub ? [] : [l.sub].slice(0, maxLines[l.id] ?? 1);
            const sub = lines.join(' ');
            /* What a screen reader adds after the words on screen: the name forms not shown, what kind of place
               it is, how sure the sources are, and how many places are inside. The spoken name starts with the
               visible words, so voice control users can say what they see. */
            const said = sub + ' ' + n.text;
            const more = [
              said.includes(p.official) ? null : p.official,
              p.deva && n.kind !== 'deva' ? 'Konkani ' + p.deva : null,
              p.romi && n.kind !== 'romi' ? 'Romi ' + p.romi : null,
              whereLabel(p),
              STATUS_TEXT[p.status] || null,
              level === 'state' && !(l.sub && lines.includes(l.sub)) ? `${childCount(p)} talukas` : null,
              markAt(l.id) ? `${markLabel}: ${markAt(l.id)}` : null
            ].filter(Boolean).join('. ') + '.';
            return (
              <button key={l.id} type="button" data-id={l.id}
                className={'k-map__label' + (l.on ? ' is-lit' : '')} data-house={houseKey(l.id)}
                aria-pressed={selected === l.id}
                onClick={() => onSelect?.(l.id, false)} onPointerEnter={hoverLabel(l.id)} onPointerLeave={hoverLabel(null)}
                style={{ left: x, top: y, visibility: l.shownNow ? 'visible' : 'hidden' }}>
                <span className={n.kind === 'deva' ? 'k-map__label-name k-map__label-name--deva' : 'k-map__label-name'} lang={n.kind === 'deva' ? 'gom' : undefined}
                  style={{ fontSize: n.fallback ? l.size - 2 : l.size }}>{n.text}</span>
                {' '}
                {lines.length > 0 && <span className="k-map__label-sub">{lines.map(t => <span key={t}>{t} </span>)}</span>}
                <span className="k-visually-hidden">. {more}</span>
              </button>
            );
          })}
          {/* the layer that is on: a tile above the name of each place that has something in it, and on each such village */}
          {s > 0 && markIcon && labels.filter(l => l.shownNow && markAt(l.id) > 0).map(l => {
            const [x, y] = P(l.at);
            return <span key={'m' + l.id} className="k-map__mark" aria-hidden="true" style={{ left: x, top: y - l.size * 0.75 - 4 }}><Icon name={markIcon} size={16} />{markAt(l.id)}</span>;
          })}
          {s > 0 && markIcon && shown.filter(v => markAt(v.id) > 0 && v.id !== selV?.id).map(v => {
            const [x, y] = P(v.lp!);
            return <span key={'m' + v.id} className="k-map__mark k-map__mark--village" aria-hidden="true" style={{ left: x, top: y }}><Icon name={markIcon} size={16} />{markAt(v.id) > 1 ? markAt(v.id) : null}</span>;
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
