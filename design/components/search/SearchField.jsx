import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function SearchField({ value = '', onChange, onCancel, autoFocus = false, placeholder = 'Canacona, काणकोण, Kannkonn', label = 'Search any name, in any script', inputRef, style }) {
  const id = React.useId ? React.useId() : 'khoim-q';
  return (
    <div role="search" style={{ display: 'grid', gridTemplateColumns: onCancel ? 'minmax(0,1fr) auto' : '1fr', gap: 8, alignItems: 'center', ...style }}>
      <label htmlFor={id} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{label}</label>
      <div data-khoim-field="1" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 56, borderRadius: 'var(--radius-l)', background: 'var(--surface-raised)', padding: '0 16px', boxShadow: 'var(--shadow-1)', color: 'var(--text)' }}>
        <Icon name="search" size={20} />
        <input id={id} ref={inputRef} type="search" enterKeyHint="search" autoComplete="off" autoCapitalize="off" spellCheck={false} value={value} autoFocus={autoFocus} placeholder={placeholder}
          onChange={e => onChange && onChange(e.target.value)} style={{ flex: 1, minWidth: 0, height: '100%', border: 0, outline: 'none', background: 'transparent', color: 'var(--text)', font: 'var(--weight-regular) 19px/1.5 var(--font-deva)' }} />
      </div>
      {onCancel && <button type="button" onClick={onCancel} style={{ height: 56, border: 0, background: 'transparent', color: 'var(--text)', font: 'var(--weight-strong) 17px/1 var(--font-latin)', padding: '0 8px', cursor: 'pointer', borderRadius: 'var(--radius-m)' }}>Cancel</button>}
    </div>
  );
}
