import React from 'react';
/* Spellings over time (ordered) or by source (unordered), drawn as a small vertical line with stops. */
export function SpellingTimeline({ spellings, style }) {
  if (!spellings || !spellings.items || !spellings.items.length) return null;
  const items = spellings.items;
  return (
    <div style={{ display: 'grid', gap: 8, ...style }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid' }}>
        {items.map((it, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '20px minmax(0,1fr)', gap: 12 }}>
            <span aria-hidden="true" style={{ position: 'relative', display: 'grid', justifyItems: 'center' }}>
              <span style={{ position: 'absolute', top: i === 0 ? 14 : 0, bottom: i === items.length - 1 ? 'calc(100% - 14px)' : 0, width: 2, background: 'currentColor' }}></span>
              <span style={{ position: 'relative', marginTop: 8, width: 12, height: 12, borderRadius: 6, border: '2px solid currentColor', background: i === items.length - 1 && spellings.ordered ? 'currentColor' : 'var(--sheet-bg, transparent)' }}></span>
            </span>
            <span style={{ display: 'grid', padding: '0 0 12px' }}>
              <span lang={it.lang} style={{ font: 'var(--weight-strong) ' + (it.lang ? 22 : 20) + 'px/' + (it.lang ? 1.5 : 1.35) + ' ' + (it.lang ? 'var(--font-deva)' : 'var(--font-latin)') }}>{it.form}</span>
              <span style={{ font: 'var(--weight-regular) 15px/1.4 var(--font-latin)' }}>{it.source}{it.year ? ', ' + it.year : ''}{it.note ? ', ' + it.note : ''}</span>
            </span>
          </li>
        ))}
      </ol>
      <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)' }}>{spellings.caption || (spellings.ordered ? 'Earliest at the top, in the order the source gives.' : 'How each source spells it.')}</span>
    </div>
  );
}
