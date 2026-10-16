import React from 'react';
import { DISTRICT_SHAPES, TALUKA_SHAPES, VILLAGES } from '../data/goaGeo.js';
import { getPlace, nameIn, spokenName, houseOf, neighboursOf, layerState, glyphsFor, linesFor } from '../data/khoim.js';
import { useReducedMotion } from '../core/motion.js';
import { Icon } from '../core/Icon.jsx';

const TIDS = Object.keys(TALUKA_SHAPES);
const DIDS = Object.keys(DISTRICT_SHAPES);
const GOA = [20, 30, 985, 1400];
const NUDGE = { mormugao: [-10, 4] };
const YEAR = new Date().getFullYear();

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
const VBOX = {};
function vbox(id) {
  if (VBOX[id]) return VBOX[id];
  const v = VILLAGES.find(x => 'v' + x.id === id); if (!v) return null;
  const n = (v.d.match(/-?\d+(\.\d+)?/g) || []).map(Number); const b = [1e9, 1e9, -1e9, -1e9];
  for (let i = 0; i < n.length - 1; i += 2) { b[0] = Math.min(b[0], n[i]); b[1] = Math.min(b[1], n[i + 1]); b[2] = Math.max(b[2], n[i]); b[3] = Math.max(b[3], n[i + 1]); }
  return (VBOX[id] = b);
}
/* selected village: frame it with its neighbours so names have room */
function hoodBox(id) {
  const ids = [id].concat(neighboursOf(id).map(n => n.id)); const b = [1e9, 1e9, -1e9, -1e9];
  ids.forEach(i => { const x = vbox(i); if (x) { b[0] = Math.min(b[0], x[0]); b[1] = Math.min(b[1], x[1]); b[2] = Math.max(b[2], x[2]); b[3] = Math.max(b[3], x[3]); } });
  const pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.08; return [b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad];
}

export function GoaMap({ focus = null, selected = null, hot = null, script = 'deva', layer = null, onSelect, onHot, insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0, paintIn = false, style }) {
  const reduce = useReducedMotion();
  const ref = React.useRef(null), stage = React.useRef(null), prev = React.useRef(null), drag = React.useRef(null);
  const { w, h } = useSize(ref);
  const [painted, setPainted] = React.useState(() => new Set(paintIn && !reduce ? [] : TIDS));
  const [scrub, setScrub] = React.useState(null);
  const [pressed, setPressed] = React.useState(null);

  React.useEffect(() => {
    if (!paintIn || reduce) { setPainted(new Set(TIDS)); return; }
    const order = TIDS.slice().sort((a, b) => TALUKA_SHAPES[a].lp[1] - TALUKA_SHAPES[b].lp[1]);
    const t = order.map((id, i) => setTimeout(() => setPainted(p => new Set([...p, id])), 200 + i * 60));
    return () => t.forEach(clearTimeout);
  }, [paintIn, reduce]);

  const fp0 = focus ? getPlace(focus) : null;
  const box = fp0 && fp0.level === 'taluka' && selected && selected[0] === 'v' ? hoodBox(selected) : boxFor(focus), bw = box[2] - box[0], bh = box[3] - box[1];
  const aw = Math.max(1, w - insetLeft - insetRight - 24), ah = Math.max(1, h - insetTop - insetBottom);
  const s = w && h ? Math.min(aw / bw, ah / bh) : 0;
  const ox = insetLeft + 12 + (aw - bw * s) / 2 - box[0] * s, oy = insetTop + (ah - bh * s) / 2 - box[1] * s;
  const P = ([x, y]) => [x * s + ox, y * s + oy];

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
  const ap = active ? getPlace(active) : null;
  const layered = layer && layer.id !== 'names';
  const lit = id => {
    if (layered) return level === 'state' || (level === 'district' ? dOf(id) === focus : id === focus);
    if (level === 'state') return !ap || (ap.level === 'district' ? dOf(id) === active : ap.level === 'taluka' ? id === active : true);
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
  const press = id => ({ onPointerDown: () => setPressed(id), onPointerUp: () => setPressed(null), onPointerLeave: () => setPressed(null), onPointerCancel: () => setPressed(null) });

  const focusVillages = level === 'taluka' ? VILLAGES.filter(v => v.t === focus) : [];
  const layerVillages = layered ? (level === 'state' ? VILLAGES : level === 'district' ? VILLAGES.filter(v => dOf(v.t) === focus) : focusVillages) : [];
  const units = level === 'state' ? TIDS.map(id => [id, TALUKA_SHAPES[id].d]) : level === 'district' ? TIDS.filter(id => dOf(id) === focus).map(id => [id, TALUKA_SHAPES[id].d]) : focusVillages.map(v => ['v' + v.id, v.d]);
  const labelIds = layered && level === 'state' ? [] : level === 'state' ? TIDS : level === 'district' ? TIDS.filter(id => dOf(id) === focus) : [];
  const inv = s ? 1 / s : 1;
  const selV = level === 'taluka' && active && active[0] === 'v' ? getPlace(active) : null;
  const nbrs = selV && selected === selV.id ? neighboursOf(selV.id) : [];
  const scrubP = scrub && scrub.u ? getPlace(scrub.u) : null;
  const glyphs = level === 'taluka' ? focusVillages.map(v => ({ p: getPlace('v' + v.id), items: glyphsFor(getPlace('v' + v.id)) })).filter(g => g.items.length && g.p.lp) : [];
  const lines = level === 'taluka' ? linesFor(focus) : [];

  const vFill = (v, st) => {
    const k = hk(v.t);
    if (st === 'lit') return `var(--house-${k})`;
    if (st === 'review') return `var(--map-${k}-dim)`;
    if (st === 'dim') return 'var(--map-fade)';
    if (st && st.startsWith('step')) return `var(--pop-${st.slice(4)})`;
    return 'var(--map-unlit)';
  };
  const labelBase = { position: 'absolute', transform: 'translate(-50%,-50%)', pointerEvents: 'auto', border: 0, minHeight: 'var(--label-hit)', minWidth: 'var(--label-hit)', display: 'grid', placeItems: 'center', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: 'var(--radius-s)' };
  const pressedStyle = id => pressed === id ? { background: 'var(--surface-raised)', color: 'var(--text)', boxShadow: 'var(--shadow-1)', transform: 'translate(-50%,-50%) scale(.94)', transition: 'none' } : null;

  return (
    <div ref={ref} role="group" aria-label="Map of Goa" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTapHighlightColor: 'transparent', ...style }}>
      <div ref={stage} style={{ position: 'absolute', inset: 0, transformOrigin: '0 0' }}>
        {s > 0 && <svg width={w} height={h} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            {TIDS.map(id => { const b = TALUKA_SHAPES[id].b; return (
              <clipPath key={id} id={'khoim-paint-' + id} clipPathUnits="userSpaceOnUse">
                <rect x={b[0] - 4} y={b[1] - 4} width={b[2] - b[0] + 8} height={b[3] - b[1] + 8} style={{ transformBox: 'fill-box', transformOrigin: '0% 50%', transform: painted.has(id) ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform var(--dur-paint) var(--ease-out)' }} />
              </clipPath>); })}
          </defs>
          <g transform={`translate(${ox},${oy}) scale(${s})`}>
            {TIDS.map(id => <path key={'e' + id} d={TALUKA_SHAPES[id].d} fill="var(--map-empty)" stroke="var(--map-edge)" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
            {!layered && TIDS.map(id => { const k = hk(id);
              return <path key={id} d={TALUKA_SHAPES[id].d} clipPath={`url(#khoim-paint-${id})`} fill={lit(id) ? `var(--house-${k})` : `var(--map-${k}-dim)`} stroke="var(--trim)" strokeWidth={level === 'state' ? 2.5 : 3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ transition: 'fill var(--dur-base) var(--ease-out)' }} />; })}
            {layered && layerVillages.slice().sort((a, b) => (layerState(getPlace('v' + a.id), layer, YEAR) === 'lit') - (layerState(getPlace('v' + b.id), layer, YEAR) === 'lit')).map(v => { const p = getPlace('v' + v.id), st = layerState(p, layer, YEAR);
              return <path key={'lv' + v.id} d={v.d} fill={vFill(v, st)} stroke={st === 'outline' || st === 'review' ? 'var(--map-outline)' : st === 'lit' && layer.id !== 'need' && layer.id !== 'population' ? 'var(--map-lit-outline)' : st === 'dim' ? 'var(--map-fade-edge)' : 'var(--trim)'} strokeWidth={st === 'review' ? 1.5 : st === 'outline' ? 0.6 : st === 'lit' && layer.id !== 'need' && layer.id !== 'population' ? 1.75 : 0.75} strokeDasharray={st === 'review' ? '3 2' : undefined} vectorEffect="non-scaling-stroke" style={{ transition: 'fill var(--dur-base) var(--ease-out)' }} />; })}
            {layered && TIDS.map(id => <path key={'lt' + id} d={TALUKA_SHAPES[id].d} fill="none" stroke="var(--map-fade-edge)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" opacity={lit(id) ? 1 : 0.6} pointerEvents="none" />)}
            {level === 'taluka' && !layered && focusVillages.map(v => <path key={'vp' + v.id} d={v.d} fill={nbrs.some(n => n.id === 'v' + v.id) ? 'rgba(255,255,255,.14)' : 'none'} stroke="var(--trim)" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />)}
            {selV && <path d={VILLAGES.find(v => 'v' + v.id === selV.id).d} fill="none" stroke="var(--trim)" strokeWidth={3} vectorEffect="non-scaling-stroke" />}
            {lines.map(l => l.kind === 'river'
              ? <g key={l.id}><path d={l.d} fill="none" stroke="var(--map-river-casing)" strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" /><path d={l.d} fill="none" stroke="var(--map-river)" strokeWidth={3} strokeLinecap="round" strokeDasharray={l.placeholder ? '8 5' : undefined} vectorEffect="non-scaling-stroke" /></g>
              : <g key={l.id}><path d={l.d} fill="none" stroke="var(--map-rail-tie)" strokeWidth={6} vectorEffect="non-scaling-stroke" /><path d={l.d} fill="none" stroke="var(--map-rail)" strokeWidth={2} strokeDasharray={l.placeholder ? '8 5' : undefined} vectorEffect="non-scaling-stroke" />
                  {l.station && <rect x={l.station.at[0] - 5 * inv} y={l.station.at[1] - 5 * inv} width={10 * inv} height={10 * inv} fill="var(--trim)" stroke="var(--map-rail)" strokeWidth={2 * inv} />}</g>)}
            {level === 'taluka' && focusVillages.map(v => { const on = 'v' + v.id === active;
              return <circle key={'vd' + v.id} cx={v.lp[0]} cy={v.lp[1]} r={(on ? 9 : 4) * inv} fill="var(--trim)" stroke={on ? `var(--house-${hk(focus)}-on)` : 'none'} strokeWidth={3 * inv} />; })}
            {units.map(([id, d]) => <path key={'h' + id} data-unit={id} d={d} fill="transparent" style={{ cursor: 'pointer' }} />)}
          </g>
        </svg>}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {s > 0 && labelIds.map(id => {
            const p = getPlace(id), n = nameIn(p, script), k = hk(id), on = lit(id), nd = NUDGE[id] || [0, 0];
            const [x, y] = P([TALUKA_SHAPES[id].lp[0] + nd[0], TALUKA_SHAPES[id].lp[1] + nd[1]]);
            const size = level === 'district' ? (active === id ? 24 : 20) : (active === id ? 16 : 14);
            return (
              <button key={id} type="button" lang={n.kind === 'deva' ? 'gom' : undefined} aria-label={spokenName(p)} aria-pressed={selected === id} onClick={() => onSelect && onSelect(id, false)} {...press(id)}
                style={{ ...labelBase, left: x, top: y, padding: '0 8px', background: 'transparent', visibility: painted.has(id) ? 'visible' : 'hidden', color: on ? `var(--house-${k}-on)` : 'var(--text)',
                  font: `var(--weight-strong) ${n.fallback ? size - 2 : size}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`, transition: 'color var(--dur-base) var(--ease-out)', ...pressedStyle(id) }}>{n.text}</button>
            );
          })}
          {s > 0 && nbrs.map(nb => { if (!nb.lp) return null; const [x, y] = P(nb.lp); if (x < 0 || y < insetTop || x > w || y > h - insetBottom) return null; const n = nameIn(nb, script);
            return <button key={nb.id} type="button" aria-label={spokenName(nb) + ' Next to ' + selV.official + '.'} onClick={() => onSelect && onSelect(nb.id, false)} {...press(nb.id)}
              style={{ ...labelBase, left: x, top: y, padding: '0 6px', background: 'transparent', color: 'var(--text)', font: `var(--weight-strong) 13px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`, ...pressedStyle(nb.id) }}>
              <span style={{ background: 'var(--surface-raised)', padding: '1px 7px', borderRadius: 'var(--radius-xs)' }}>{n.text}</span></button>; })}
          {s > 0 && glyphs.map(g => { const [x, y] = P(g.p.lp);
            return <div key={'g' + g.p.id} style={{ position: 'absolute', left: x + 8, top: y + 8, display: 'flex', gap: 2, pointerEvents: 'auto' }}>
              {g.items.map((it, i) => <button key={i} type="button" aria-label={it.title + ', ' + g.p.official} onClick={() => onSelect && onSelect(g.p.id, false)} {...press(g.p.id + i)}
                style={{ width: 'var(--glyph-hit)', height: 'var(--glyph-hit)', margin: -7, border: 0, background: 'transparent', padding: 7, cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                <span style={{ width: 'var(--glyph-tile)', height: 'var(--glyph-tile)', borderRadius: 'var(--radius-s)', background: 'var(--glyph-bg)', color: 'var(--glyph-ink)', border: '2px solid var(--glyph-ink)', display: 'grid', placeItems: 'center', transform: pressed === g.p.id + i ? 'scale(.9)' : 'none' }}><Icon name={it.icon} size={16} /></span>
              </button>)}
            </div>; })}
          {s > 0 && lines.map(l => { const at = l.station ? l.station.at : null; if (!at) return null; const [x, y] = P(at);
            return <span key={'st' + l.id} style={{ position: 'absolute', left: x + 10, top: y, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-raised)', color: 'var(--text)', padding: '2px 7px', borderRadius: 'var(--radius-xs)', font: 'var(--weight-strong) 12px/1.4 var(--font-latin)', whiteSpace: 'nowrap' }}><Icon name="train-front" size={13} />{l.station.label}{l.placeholder ? ' (to load)' : ''}</span>; })}
          {selV && (() => { const [x, y] = P(selV.lp); const n = nameIn(selV, script);
            return <span style={{ position: 'absolute', left: x, top: y - 18, transform: 'translate(-50%,-100%)', background: 'var(--surface-raised)', color: 'var(--text)', padding: '4px 12px', borderRadius: 'var(--radius-m)', font: `var(--weight-strong) 17px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`, whiteSpace: 'nowrap', boxShadow: 'var(--shadow-2)' }} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</span>; })()}
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
