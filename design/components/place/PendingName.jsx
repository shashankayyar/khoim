import React from 'react';
/* A name we do not have yet, drawn as an oyster-shell (carepa) window: panes of light, no glass. */
export function PendingName({ label = 'Konkani name not recorded yet', ink = 'currentColor', style }) {
  return (
    <div role="note" style={{ position: 'relative', borderRadius: 'var(--radius-l)', padding: 6, border: '2px solid ' + ink, ...style }}>
      <div aria-hidden="true" style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 3 }}>
        {Array.from({ length: 16 }).map((_, i) => <span key={i} style={{ aspectRatio: '1', borderRadius: 3, background: 'rgba(255,255,255,.5)', animation: `khoim-shell 4.2s ${(i % 8) * 0.14 + Math.floor(i / 8) * 0.35}s ease-in-out infinite` }}></span>)}
      </div>
      <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span style={{ background: 'var(--surface-raised)', color: 'var(--text)', padding: '4px 12px', borderRadius: 'var(--radius-s)', font: 'var(--weight-strong) 15px/1.4 var(--font-latin)' }}>{label}</span>
      </span>
    </div>
  );
}
