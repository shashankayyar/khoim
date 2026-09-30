import React from 'react';
export function DraftBanner({ onTellUs, style }) {
  return (
    <div role="note" style={{ background: 'var(--surface-invert)', color: 'var(--text-invert)', padding: '8px var(--gutter)', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 10px', font: 'var(--weight-regular) 14px/1.45 var(--font-latin)', ...style }}>
      <strong style={{ fontWeight: 700 }}>Draft for review.</strong>
      <span>Names and pronunciation guides are not final.</span>
      {onTellUs && <button type="button" onClick={onTellUs} style={{ border: 0, background: 'transparent', padding: '6px 0', margin: '-6px 0', color: 'inherit', font: 'inherit', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>Tell us what is wrong</button>}
    </div>
  );
}
