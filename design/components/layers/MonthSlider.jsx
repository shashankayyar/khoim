import React from 'react';
const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/* Month picker for the Feasts layer. One large slider: drag along it, tap a month, or use the arrow keys. */
export function MonthSlider({ value = 1, onChange, counts = [], style }) {
  const ref = React.useRef(null), drag = React.useRef(false);
  const at = x => { const r = ref.current.getBoundingClientRect(); return Math.max(1, Math.min(12, Math.floor((x - r.left) / r.width * 12) + 1)); };
  const set = m => { if (m !== value && onChange) onChange(m); };
  const key = e => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d) { e.preventDefault(); set(((value - 1 + d + 12) % 12) + 1); } else if (e.key === 'Home') set(1); else if (e.key === 'End') set(12); };
  return (
    <div style={{ display: 'grid', gap: 8, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ font: 'var(--weight-strong) 26px/1.2 var(--font-latin)' }}>{NAMES[value - 1]}</span>
        <span style={{ font: 'var(--weight-regular) 15px/1.3 var(--font-latin)' }}>{(counts[value - 1] || 0) + ((counts[value - 1] || 0) === 1 ? ' place' : ' places')}</span>
      </div>
      <div ref={ref} role="slider" tabIndex={0} aria-label="Month" aria-valuemin={1} aria-valuemax={12} aria-valuenow={value} aria-valuetext={NAMES[value - 1] + ', ' + (counts[value - 1] || 0) + ' places'} onKeyDown={key}
        onPointerDown={e => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(at(e.clientX)); }} onPointerMove={e => drag.current && set(at(e.clientX))} onPointerUp={() => { drag.current = false; }}
        style={{ position: 'relative', height: 52, borderRadius: 'var(--radius-m)', background: 'var(--surface-sunk)', display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', touchAction: 'none', cursor: 'pointer' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 4, bottom: 4, left: 'calc(' + ((value - 1) / 12 * 100) + '% + 2px)', width: 'calc(' + (100 / 12) + '% - 4px)', borderRadius: 'var(--radius-s)', background: 'var(--surface-invert)', transition: 'left var(--dur-fast) var(--ease-out)' }}></span>
        {NAMES.map((n, i) => <span key={n} aria-hidden="true" style={{ position: 'relative', display: 'grid', placeItems: 'center', gap: 2, font: 'var(--weight-strong) 13px/1 var(--font-latin)', color: i + 1 === value ? 'var(--text-invert)' : 'var(--text)' }}>
          <span>{n[0]}</span><span style={{ width: 5, height: 5, borderRadius: 3, background: 'currentColor', visibility: counts[i] ? 'visible' : 'hidden' }}></span></span>)}
      </div>
    </div>
  );
}
