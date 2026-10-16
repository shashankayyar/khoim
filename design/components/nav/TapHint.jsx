import React from 'react';
import { Icon } from '../core/Icon.jsx';
/* One short line that tells first-time visitors the map is the thing to touch. The caller hides it for good after the first tap. */
export function TapHint({ text = 'Tap any taluka', visible = true, style }) {
  return <p aria-hidden={!visible} style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px 10px 12px', borderRadius: 'var(--radius-m)', background: 'var(--hint-bg)', color: 'var(--hint-text)',
    font: 'var(--weight-strong) 16px/1.2 var(--font-latin)', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(6px)', transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)', pointerEvents: 'none', ...style }}>
    <Icon name="hand" size={18} />{text}</p>;
}
