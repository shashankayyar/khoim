import React from 'react';
import { MAP_LAYERS } from '../data/khoim.js';
import { Icon } from '../core/Icon.jsx';
/* The map layers as a visible, labelled row. Never hidden behind an icon. */
export function LayerRow({ value = 'names', onChange, layers = MAP_LAYERS, style }) {
  return (
    <div role="radiogroup" aria-label="Map layers" style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', padding: '2px 16px 6px', ...style }}>
      {layers.map(l => { const on = l.id === value;
        return <button key={l.id} type="button" role="radio" aria-checked={on} onClick={() => onChange && onChange(l.id)}
          style={{ flex: '0 0 auto', height: 'var(--chip-height)', padding: '0 14px 0 12px', borderRadius: 'var(--chip-radius)', border: 0, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            background: on ? 'var(--surface-invert)' : 'var(--surface-raised)', color: on ? 'var(--text-invert)' : 'var(--text)', boxShadow: on ? 'none' : 'var(--shadow-1)',
            font: 'var(--weight-strong) 15px/1 var(--font-latin)', transition: 'background-color var(--dur-fast), color var(--dur-fast)' }}>
          <Icon name={l.icon} size={18} />{l.label}</button>; })}
    </div>
  );
}
