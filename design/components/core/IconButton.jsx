import React from 'react';
import { usePress } from './motion.js';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, onClick, tone = 'raised', ink = 'var(--text)', size = 48, style, ...rest }) {
  const [pressed, press] = usePress();
  const bg = tone === 'raised' ? 'var(--surface-raised)' : tone === 'soft' ? 'color-mix(in srgb, currentColor 14%, transparent)' : 'transparent';
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} {...press} {...rest}
      style={{ width: size, height: size, flex: '0 0 auto', borderRadius: 'var(--radius-l)', border: 0, display: 'grid', placeItems: 'center', cursor: 'pointer', color: ink, background: bg,
        boxShadow: tone === 'raised' ? 'var(--shadow-1)' : 'none', transform: pressed ? 'scale(var(--press-scale))' : 'none', transition: 'transform var(--dur-press) var(--ease-out)', ...style }}>
      <Icon name={icon} size={20} />
    </button>
  );
}
