import React from 'react';
import { SITE } from '../data/khoim.js';
export function Wordmark({ size = 22, color = 'var(--text)', style }) {
  return (
    <span aria-label={SITE.romi} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '.3em', color, ...style }}>
      <span lang="gom" aria-hidden="true" style={{ font: `var(--weight-strong) ${size}px/1.5 var(--font-deva)` }}>{SITE.deva}</span>
      <span aria-hidden="true" style={{ font: `var(--weight-strong) ${size}px/1.3 var(--font-latin)` }}>{SITE.romi}</span>
    </span>
  );
}
