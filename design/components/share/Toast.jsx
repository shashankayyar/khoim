import React from 'react';
import { Icon } from '../core/Icon.jsx';
/* Short confirmation, e.g. "Link copied". Polite live region; caller removes it after 2400ms. */
export function Toast({ text, visible = true, style }) {
  return <div role="status" aria-live="polite" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--radius-m)', background: 'var(--toast-bg)', color: 'var(--toast-text)', boxShadow: 'var(--shadow-2)', font: 'var(--weight-strong) 16px/1.2 var(--font-latin)', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(8px)', transition: 'opacity var(--dur-fast), transform var(--dur-fast) var(--ease-out)', pointerEvents: 'none', ...style }}>{visible && <><Icon name="check" size={18} />{text}</>}</div>;
}
