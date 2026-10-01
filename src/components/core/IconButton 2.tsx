import type { CSSProperties } from 'react';
import { Icon } from './Icon';
import type { IconName } from './iconPaths';
import './core.css';

export interface IconButtonProps {
  icon: IconName;
  /** Always labelled. Read by screen readers and shown as a tooltip. */
  label: string;
  onClick?: () => void;
  /** raised = white tile with a shadow (on the map). soft = tinted with the current ink (on a house colour). */
  tone?: 'raised' | 'soft' | 'plain';
  ink?: string;
  /** px. 48 by default, never under 44. */
  size?: number;
}

/** Back, close, theme. */
export function IconButton({ icon, label, onClick, tone = 'raised', ink, size = 48 }: IconButtonProps) {
  const style = { '--icon-button-size': `${size}px`, ...(ink ? { color: ink } : null) } as CSSProperties;
  return (
    <button type="button" className={`k-icon-button k-icon-button--${tone}`} style={style} aria-label={label} title={label} onClick={onClick}>
      <Icon name={icon} size={20} />
    </button>
  );
}
