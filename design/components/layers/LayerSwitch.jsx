import React from 'react';
import { LAYERS } from '../data/khoim.js';
import { Icon } from '../core/Icon.jsx';
/* The layers Khoim will grow into. Only live layers can be switched on; the rest say when they are coming. */
export function LayerSwitch({ value = 'names', onChange, layers = LAYERS, style }) {
  return (
    <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, ...style }}>
      {layers.map(l => {
        const live = l.status === 'live', on = value === l.id;
        return (
          <li key={l.id}>
            <button type="button" aria-pressed={live ? on : undefined} aria-disabled={!live || undefined} onClick={() => live && onChange && onChange(l.id)}
              style={{ width: '100%', display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) auto', gap: 12, alignItems: 'center', textAlign: 'left', padding: '10px 14px 10px 10px', borderRadius: 'var(--radius-l)', cursor: live ? 'pointer' : 'default',
                border: '2px ' + (live ? 'solid ' : 'dashed ') + (on ? 'var(--text)' : 'var(--line)'), background: on ? 'var(--surface-invert)' : 'var(--surface-raised)', color: on ? 'var(--text-invert)' : 'var(--text)' }}>
              <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 'var(--radius-m)', display: 'grid', placeItems: 'center', background: on ? 'var(--surface-raised)' : 'var(--surface-sunk)', color: 'var(--text)' }}><Icon name={l.icon} size={20} /></span>
              <span style={{ display: 'grid', gap: 2 }}><span style={{ font: 'var(--weight-strong) 17px/1.3 var(--font-latin)' }}>{l.label}</span><span style={{ font: 'var(--weight-regular) 15px/1.45 var(--font-latin)' }}>{l.note}</span></span>
              <span style={{ font: 'var(--weight-strong) 14px/1 var(--font-latin)' }}>{live ? (on ? 'On' : 'Off') : l.status === 'next' ? 'Next' : 'Planned'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
