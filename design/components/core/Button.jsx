import React from 'react';
import { usePress } from './motion.js';
import { Icon } from './Icon.jsx';
export function Button({ variant = 'solid', size = 'l', ink = 'var(--text)', paper = 'var(--surface-raised)', icon, iconAfter, full = false, disabled = false, onClick, children, type = 'button', style, ...rest }) {
  const [pressed, press] = usePress();
  const h = size === 'l' ? 56 : 48;
  const v = {
    solid: { background: ink, color: paper, border: '2px solid ' + ink },
    outline: { background: 'transparent', color: ink, border: '2px solid ' + ink },
    ghost: { background: 'transparent', color: ink, border: '2px solid transparent', textDecoration: 'underline', textUnderlineOffset: 5, textDecorationThickness: 2 }
  }[variant];
  return (
    <button type={type} onClick={disabled ? undefined : onClick} aria-disabled={disabled || undefined} {...press} {...rest}
      style={{ minHeight: h, padding: '0 20px', borderRadius: 'var(--radius-l)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: full ? '100%' : 'auto',
        font: `var(--weight-strong) ${size === 'l' ? 18 : 17}px/1.2 var(--font-latin)`, cursor: disabled ? 'not-allowed' : 'pointer',
        transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'none', transition: 'transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) var(--ease-out)', ...v,
        ...(disabled ? { borderStyle: 'dashed', background: 'transparent', color: ink } : null), ...style }}>
      {icon && <Icon name={icon} size={20} />}{children}{iconAfter && <Icon name={iconAfter} size={20} />}
    </button>
  );
}
