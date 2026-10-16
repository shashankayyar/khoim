import React from 'react';
const KIND = { roots: null, options: 'Two readings', differ: 'Sources differ', tradition: 'Local tradition', single: 'One interpretation' };
/* What a name means. Each claim carries its source. Competing readings sit side by side at the same size. */
export function MeaningBlock({ meaning, style }) {
  if (!meaning || !meaning.readings || !meaning.readings.length) return null;
  const two = meaning.readings.length > 1;
  return (
    <div style={{ display: 'grid', gap: 10, ...style }}>
      {KIND[meaning.kind] && <span style={{ font: 'var(--weight-regular) 16px/1.4 var(--font-latin)' }}>{KIND[meaning.kind]}</span>}
      <div style={{ display: 'grid', gridTemplateColumns: two ? '1fr 1fr' : '1fr', gap: 8 }}>
        {meaning.readings.map((r, i) => (
          <div key={i} style={{ border: '2px solid currentColor', borderRadius: 'var(--radius-l)', padding: '10px 12px 12px', display: 'grid', gap: 4, alignContent: 'start' }}>
            {meaning.kind === 'tradition' && <span style={{ justifySelf: 'start', font: 'var(--weight-heavy) 12px/1.3 var(--font-latin)', border: '2px solid currentColor', borderRadius: 'var(--radius-xs)', padding: '1px 6px' }}>Tradition</span>}
            <span style={{ font: 'var(--weight-strong) 22px/1.3 var(--font-latin)' }}>{r.text}</span>
            {r.roots && <span style={{ font: 'var(--weight-regular) 17px/1.5 var(--font-latin)' }}>{'from '}{r.roots.map((x, j) => <React.Fragment key={j}>{j > 0 && ' or '}<strong style={{ fontWeight: 700 }}>{x.from}</strong>{' (' + x.gloss + ')'}</React.Fragment>)}{'. ' + (r.note || '')}</span>}
            {r.from && <span style={{ font: 'var(--weight-regular) 16px/1.45 var(--font-latin)' }}>from <strong style={{ fontWeight: 700 }}>{r.from}</strong>, {r.gloss}</span>}
            {!r.from && !r.roots && r.gloss && <span style={{ font: 'var(--weight-regular) 16px/1.45 var(--font-latin)' }}>{r.gloss}</span>}
            <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)', marginTop: 2 }}>{r.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
