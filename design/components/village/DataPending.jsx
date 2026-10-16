import React from 'react';
/* A value we know we need but have not loaded yet. Always visibly marked, never a made-up number. */
export function DataPending({ label = 'To load', source, style }) {
  return <span title={source ? 'From ' + source + ', not loaded yet' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'var(--placeholder-border)', borderRadius: 'var(--radius-s)', padding: '2px 8px', font: 'var(--weight-strong) 14px/1.4 var(--font-latin)', ...style }}>{label}{source ? ', ' + source : ''}</span>;
}
