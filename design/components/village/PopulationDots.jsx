import React from 'react';
import { KhoimData, populationStep } from '../data/khoim.js';
/* One dot per village in Goa, placed by population, with this village picked out. Gives a single number its scale. */
export function PopulationDots({ placeId, placeholder = true, style }) {
  const W = 320, H = 46;
  const dots = React.useMemo(() => KhoimData.VILLAGES.map((v, i) => { const st = populationStep(v); const x = 8 + ((st - 1) * 0.2 + ((i * 37) % 97) / 97 * 0.2) * (W - 16); const y = 8 + ((i * 53) % 89) / 89 * (H - 16); return { id: v.id, x, y }; }), []);
  const me = dots.find(d => d.id === placeId);
  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      <div style={{ position: 'relative' }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} width="100%" height={H} aria-hidden="true" style={{ display: 'block' }}>
          <line x1="8" x2={W - 8} y1={H - 2} y2={H - 2} stroke="currentColor" strokeWidth="2" />
          {dots.map(d => <circle key={d.id} cx={d.x} cy={d.y} r="2" fill="currentColor" opacity=".55" />)}
          {me && <g><circle cx={me.x} cy={me.y} r="7" fill="none" stroke="currentColor" strokeWidth="2.5" /><circle cx={me.x} cy={me.y} r="3" fill="currentColor" /></g>}
        </svg>
        {placeholder && <span style={{ position: 'absolute', right: 0, top: -4, background: 'var(--surface-raised)', color: 'var(--text)', borderRadius: 'var(--radius-xs)', padding: '2px 8px', font: 'var(--weight-strong) 12px/1.4 var(--font-latin)' }}>Placeholder data</span>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--weight-regular) 14px/1.3 var(--font-latin)' }}><span>Fewest people</span><span>Most</span></div>
    </div>
  );
}
