import React from 'react';
export function Credit({ full = false, style }) {
  const p = { margin: 0, font: 'var(--weight-regular) var(--size-caption)/1.5 var(--font-latin)', color: 'var(--text-2)' };
  return (
    <div style={{ display: 'grid', gap: 4, ...style }}>
      <p style={p}>Khoim is a non-profit initiative by Pangolin Marketing. Boundaries and official names: Local Government Directory, Government of India.</p>
      {full && <p style={p}>Konkani names: Goa district websites, Konkani Vishwakosh (Goa University), Konkani Wikipedia. Data licence to be confirmed.</p>}
    </div>
  );
}
