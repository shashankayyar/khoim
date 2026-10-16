import React from 'react';
import { trailOf, nameIn } from '../data/khoim.js';
/* Goa / district / taluka / village. Every step but the last goes back to that level. */
export function Breadcrumb({ id, script = 'official', onNavigate, tone = 'raised', style }) {
  const trail = trailOf(id || 'goa');
  return (
    <nav aria-label="Where you are" style={{ ...style }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {trail.map((p, i) => { const last = i === trail.length - 1, n = nameIn(p, script);
          return <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 2, flex: '0 0 auto' }}>
            {i > 0 && <span aria-hidden="true" style={{ font: 'var(--weight-strong) 15px/1 var(--font-latin)', padding: '0 2px' }}>/</span>}
            <button type="button" aria-current={last ? 'page' : undefined} onClick={() => !last && onNavigate && onNavigate(p.id === 'goa' ? null : p.id)} lang={n.kind === 'deva' ? 'gom' : undefined}
              style={{ minHeight: 44, padding: '0 10px', border: 0, borderRadius: 'var(--radius-m)', cursor: last ? 'default' : 'pointer', whiteSpace: 'nowrap',
                background: tone === 'raised' ? (last ? 'var(--surface-invert)' : 'var(--surface-raised)') : 'transparent', color: tone === 'raised' && last ? 'var(--text-invert)' : 'var(--text)',
                boxShadow: tone === 'raised' && !last ? 'var(--shadow-1)' : 'none', textDecoration: !last && tone !== 'raised' ? 'underline' : 'none', textUnderlineOffset: 4,
                font: 'var(--weight-strong) ' + (n.kind === 'deva' ? 16 : 15) + 'px/1.5 ' + (n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)') }}>{n.text}</button>
          </li>; })}
      </ol>
    </nav>
  );
}
