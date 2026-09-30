import React from 'react';
const OPTS = [['official', 'Official', 'var(--font-latin)'], ['deva', 'देवनागरी', 'var(--font-deva)'], ['romi', 'Romi', 'var(--font-latin)']];
export function ScriptToggle({ value = 'deva', onChange, width = 220, style }) {
  const i = Math.max(0, OPTS.findIndex(o => o[0] === value));
  const refs = React.useRef([]);
  const key = e => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return; e.preventDefault(); const n = (i + d + 3) % 3; onChange && onChange(OPTS[n][0]); refs.current[n] && refs.current[n].focus();
  };
  return (
    <div role="radiogroup" aria-label="Names on the map" onKeyDown={key}
      style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', width, height: 48, padding: 4, borderRadius: 'var(--radius-l)', background: 'var(--surface-raised)', boxShadow: 'var(--shadow-1)', ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: 4, bottom: 4, left: 4, width: 'calc((100% - 8px) / 3)', borderRadius: 'var(--radius-m)', background: 'var(--surface-invert)', transform: `translateX(${i * 100}%)`, transition: 'transform var(--dur-base) var(--ease-standard)' }}></span>
      {OPTS.map(([v, l, f], n) => (
        <button key={v} ref={el => refs.current[n] = el} type="button" role="radio" aria-checked={v === value} tabIndex={v === value ? 0 : -1} lang={v === 'deva' ? 'gom' : undefined} onClick={() => onChange && onChange(v)}
          style={{ position: 'relative', border: 0, background: 'transparent', borderRadius: 'var(--radius-m)', color: v === value ? 'var(--text-invert)' : 'var(--text)', font: `var(--weight-strong) 15px/1.5 ${f}`, cursor: 'pointer', transition: 'color var(--dur-fast)' }}>{l}</button>
      ))}
    </div>
  );
}
