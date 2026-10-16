import React from 'react';
/* Vaddos are a list, never shapes: their only boundaries are electoral wards. */
export function VaddoList({ vaddos, style }) {
  if (!vaddos || !vaddos.items || !vaddos.items.length) return null;
  return (
    <div style={{ display: 'grid', gap: 8, ...style }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {vaddos.items.map(v => <li key={v} style={{ padding: '10px 12px', border: '2px solid currentColor', borderRadius: 'var(--radius-m)', font: 'var(--weight-strong) 17px/1.35 var(--font-latin)' }}>{v}</li>)}
      </ul>
      <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)' }}>{vaddos.items.length + ' vaddos listed in the ' + vaddos.source + '. We do not draw their edges.'}</span>
    </div>
  );
}
