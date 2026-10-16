import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FeastStrip } from './FeastStrip.jsx';
/* Monument, GI produce, parish feast, zatra, festival. Same glyph as the map mark. */
export function KnownFor({ items, today, style }) {
  if (!items || !items.length) return null;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 14, ...style }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 12, alignItems: 'start' }}>
          <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 'var(--radius-m)', background: 'var(--glyph-bg)', color: 'var(--glyph-ink)', border: '2px solid var(--glyph-ink)', display: 'grid', placeItems: 'center' }}><Icon name={it.icon} size={20} /></span>
          <div style={{ display: 'grid', gap: 4 }}>
            <span style={{ font: 'var(--weight-strong) 19px/1.3 var(--font-latin)' }}>{it.title}</span>
            {it.detail && <span style={{ font: 'var(--weight-regular) 16px/1.45 var(--font-latin)' }}>{it.detail}</span>}
            {it.when && <FeastStrip when={it.when} whenText={it.whenText} today={today} style={{ marginTop: 6 }} />}
            <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)' }}>{it.source}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
