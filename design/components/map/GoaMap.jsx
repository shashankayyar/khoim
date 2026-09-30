import React from 'react';
import { DISTRICT_SHAPES, TALUKA_SHAPES, VILLAGES } from '../data/goaGeo.js';
import { getPlace, nameIn, spokenName, houseOf } from '../data/khoim.js';
import { useReducedMotion } from '../core/motion.js';

const TIDS = Object.keys(TALUKA_SHAPES);
const DIDS = Object.keys(DISTRICT_SHAPES);
const GOA = [20, 30, 985, 1400];
const NUDGE = { mormugao: [-10, 4] };

function boxFor(focus) {
  const s = focus && (TALUKA_SHAPES[focus] || DISTRICT_SHAPES[focus]);
  if (!s) return GOA;
  const [x0, y0, x1, y1] = s.b, pad = Math.max(x1 - x0, y1 - y0) * 0.06;
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
}
function useSize(ref) {
  const [z, set] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const u = () => set({ w: el.clientWidth, h: el.clientHeight }); u(); const ro = new ResizeObserver(u); ro.observe(el); return () => ro.disconnect(); }, []);
  return z;
}
const hk = id => houseOf(getPlace(id)).key;

export function GoaMap({ focus = null, selected = null, hot = null, script = 'deva', onSelect, onHot, insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, paintIn = false, style }) {
  const reduce = useReducedMotion();
  const ref = React.useRef(null), stage = React.useRef(null), prev = React.useRef(null), drag = React.useRef(null);
  const { w, h } = useSize(ref);
  const [painted, setPainted] = React.useState(() => new Set(paintIn && !reduce ? [] : TIDS));
  const [scrub, setScrub] = React.useState(null);

  React.useEffect(() => {
    if (!paintIn || reduce) { setPainted(new Set(TIDS)); return; }
    const order = TIDS.slice().sort((a, b) => TALUKA_SHAPES[a].lp[1] - TALUKA_SHAPES[b].lp[1]);
    const t = order.map((id, i) => setTimeout(() => setPainted(p => new Set([...p, id])), 200 + i * 60));
    return () => t.forEach(clearTimeout);
  }, [paintIn, reduce]);

  const box = boxFor(focus), bw = box[2] - box[0], bh = box[3] - box[1];
  const aw = Math.max(1, w - insetLeft - insetRight - 24), ah = Math.max(1, h - insetTop - insetBottom);
  const s = w && h ? Math.min(aw / bw, ah / bh) : 0;
  const ox = insetLeft + 12 + (aw - bw * s) / 2 - box[0] * s, oy = insetTop + (ah - bh * s) / 2 - box[1] * s;
  const P = ([x, y]) => [x * s + ox, y * s + oy];

  /* one composited transform from the old view to the new one */
  React.useLayoutEffect(() => {
    const el = stage.current, pv = prev.current;
    if (el && pv && pv.s && s && !reduce && (pv.focus !== focus || Math.abs(pv.oy - oy) > 1 || Math.abs(pv.s - s) > 0.001)) {
      const k = pv.s / s;
      el.style.transition = 'none'; el.style.transform = `translate(${pv.ox - ox * k}px,${pv.oy - oy * k}px) scale(${k})`;
      el.getBoundingClientRect();
      el.style.transition = `transform ${pv.focus !== focus ? 'var(--dur-zoom)' : 'var(--dur-sheet)'} var(--ease-out)`; el.style.transform = 'none';
    }
    prev.current = { focus, s, ox, oy };
  }, [focus, s, ox, oy, reduce]);

  const fp = focus ? getPlace(focus) : null;
  const level = fp ? fp.level : 'state';
  const dOf = id => TALUKA_SHAPES[id].district;
  const active = hot || selected;
  const lit = id => {
    if (level === 'state') return !active || dOf(id) === active;
    if (level === 'district') return dOf(id) === focus && (!active || active === id);
    return id === focus;
  };

  const unitAt = (x, y) => { const el = document.elementFromPoint(x, y); const u = el && el.closest && el.closest('[data-unit]'); return u ? u.getAttribute('data-unit') : null; };
  const down = e => { if (e.button > 0 || e.target.closest('button')) return; e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, moved: false, u: unitAt(e.clientX, e.clientY) }; };
  const move = e => {
    const d = drag.current; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true; d.u = unitAt(e.clientX, e.clientY);
    const r = ref.current.getBoundingClientRect(); setScrub({ x: e.clientX - r.left, y: e.clientY - r.top, u: d.u }); onHot && onHot(d.u);
  };
  const up = () => { const d = drag.current; drag.current = null; if (!d) return; setScrub(null); onHot && onHot(null); if (d.u && onSelect) onSelect(d.u, d.moved); };

  const units = level === 'state' ? DIDS.map(id => [id, DISTRICT_SHAPES[id].d]) : level === 'district' ? TIDS.filter(id => dOf(id) === focus).map(id => [id, TALUKA_SHAPES[id].d]) : VILLAGES.filter(v => v.t === focus).map(v => ['v' + v.id, v.d]);
  const labelIds = level === 'state' ? TIDS : level === 'district' ? TIDS.filter(id => dOf(id) === focus) : [];
  const inv = s ? 1 / s : 1;
  const selV = level === 'taluka' && active && active[0] === 'v' ? getPlace(active) : null;
  const scrubP = scrub && scrub.u ? getPlace(scrub.u) : null;

  return (
    <div ref={ref} role="group" aria-label="Map of Goa" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent', ...style }}>
      <div ref={stage} style={{ position: 'absolute', inset: 0, transformOrigin: '0 0' }}>
        {s > 0 && <svg width={w} height={h} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <defs>{TIDS.map(id => { const b = TALUKA_SHAPES[id].b; return (
            <clipPath key={id} id={'khoim-paint-' + id} clipPathUnits="userSpaceOnUse">
              <rect x={b[0] - 4} y={b[1] - 4} width={b[2] - b[0] + 8} height={b[3] - b[1] + 8} style={{ transformBox: 'fill-box', transformOrigin: '0% 50%', transform: painted.has(id) ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform var(--dur-paint) var(--ease-out)' }} />
            </clipPath>); })}</defs>
          <g transform={`translate(${ox},${oy}) scale(${s})`}>
            {TIDS.map(id => <path key={'e' + id} d={TALUKA_SHAPES[id].d} fill="var(--map-empty)" stroke="var(--map-edge)" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
            {TIDS.map(id => { const k = hk(id);
              return <path key={id} d={TALUKA_SHAPES[id].d} clipPath={`url(#khoim-paint-${id})`} fill={lit(id) ? `var(--house-${k})` : `var(--map-${k}-dim)`} stroke="var(--trim)" strokeWidth={level === 'state' ? 2.5 : 3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ transition: 'fill var(--dur-base) var(--ease-out)' }} />; })}
            {level === 'taluka' && VILLAGES.filter(v => v.t === focus).map(v => <path key={'vp' + v.id} d={v.d} fill="none" stroke="var(--trim)" strokeOpacity={0.45} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
            {level === 'taluka' && VILLAGES.filter(v => v.t === focus).map(v => { const on = 'v' + v.id === active;
              return <circle key={'vd' + v.id} cx={v.lp[0]} cy={v.lp[1]} r={(on ? 9 : v.town ? 5 : 4) * inv} fill="var(--trim)" stroke={on ? `var(--house-${hk(focus)}-on)` : 'none'} strokeWidth={3 * inv} />; })}
            {units.map(([id, d]) => <path key={'h' + id} data-unit={id} d={d} fill="transparent" style={{ cursor: 'pointer' }} />)}
          </g>
        </svg>}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {s > 0 && labelIds.map(id => {
            const p = getPlace(id), n = nameIn(p, script), k = hk(id), on = lit(id), nd = NUDGE[id] || [0, 0];
            const [x, y] = P([TALUKA_SHAPES[id].lp[0] + nd[0], TALUKA_SHAPES[id].lp[1] + nd[1]]);
            const big = level === 'district', size = big ? (active === id ? 24 : 20) : (active && dOf(id) === active ? 15 : 14);
            const target = level === 'state' ? dOf(id) : id;
            return (
              <button key={id} type="button" lang={n.kind === 'deva' ? 'gom' : undefined} aria-label={level === 'state' ? spokenName(getPlace(target)) + ' Includes ' + p.official + '.' : spokenName(p)} aria-pressed={selected === target}
                onClick={() => onSelect && onSelect(target, false)}
                style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', pointerEvents: 'auto', border: 0, background: 'transparent', padding: '6px 8px', borderRadius: 'var(--radius-s)', cursor: 'pointer', whiteSpace: 'nowrap',
                  visibility: painted.has(id) ? 'visible' : 'hidden', color: on ? `var(--house-${k}-on)` : 'var(--text)',
                  font: `var(--weight-strong) ${n.fallback ? size - 2 : size}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`, transition: 'color var(--dur-base) var(--ease-out)' }}>{n.text}</button>
            );
          })}
          {selV && (() => { const [x, y] = P(selV.lp); return <span style={{ position: 'absolute', left: x, top: y - 20, transform: 'translate(-50%,-100%)', background: 'var(--surface-raised)', color: 'var(--text)', padding: '4px 10px', borderRadius: 'var(--radius-m)', font: 'var(--weight-strong) 15px/1.4 var(--font-latin)', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-2)' }}>{selV.official}</span>; })()}
        </div>
      </div>
      {scrubP && <Loupe p={scrubP} x={scrub.x} y={scrub.y} w={w} script={script} />}
    </div>
  );
}

function Loupe({ p, x, y, w, script }) {
  const hs = houseOf(p), n = nameIn(p, script === 'official' ? 'deva' : script);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: Math.max(12, Math.min(w - 232, x - 110)), top: Math.max(8, y - 150), width: 220, pointerEvents: 'none', background: hs.bg, color: hs.on, borderRadius: 'var(--radius-xl)', padding: 'var(--trim-inset)', boxShadow: 'var(--shadow-3)' }}>
      <div style={{ border: 'var(--trim-width) solid currentColor', borderRadius: 'var(--radius-l)', padding: '6px 12px 8px' }}>
        <div lang={n.kind === 'deva' ? 'gom' : undefined} style={{ font: `var(--weight-strong) ${n.kind === 'deva' ? 32 : 26}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}` }}>{n.text}</div>
        <div style={{ font: 'var(--weight-regular) 15px/1.35 var(--font-latin)' }}>{p.romi && n.kind === 'deva' ? p.romi + ' · ' : ''}{p.official}</div>
      </div>
    </div>
  );
}
