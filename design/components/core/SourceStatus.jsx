import React from 'react';
const TXT = { agree: 'Sources agree', differ: 'Sources differ', pending: 'Official name only', review: 'Needs review' };
export function SourceStatus({ status = 'agree', color = 'currentColor', size = 17, style }) {
  const ring = { width: 12, height: 12, borderRadius: 6, border: '2px solid ' + color, flex: '0 0 auto', boxSizing: 'border-box', display: 'grid', placeItems: 'center' };
  const fill = status === 'agree' ? { background: color } : status === 'differ' ? { background: 'linear-gradient(90deg, ' + color + ' 50%, transparent 50%)' } : null;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color, font: 'var(--weight-strong) ' + size + 'px/1.4 var(--font-latin)', ...style }}>
    <span aria-hidden="true" style={{ ...ring, ...fill, borderStyle: status === 'review' ? 'dashed' : 'solid' }}>{status === 'review' && <span style={{ width: 4, height: 4, borderRadius: 2, background: color }}></span>}</span>{TXT[status]}</span>;
}
