import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './iconPaths';
import './core.css';

export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  /** l = 56px (default, phone), m = 48px */
  size?: 'l' | 'm';
  /** Text/border colour for outline and ghost, fill for solid. On a house colour pass its ink. */
  ink?: string;
  /** Label colour on solid. */
  paper?: string;
  icon?: IconName;
  iconAfter?: IconName;
  full?: boolean;
  /** Keeps focus (aria-disabled) and shows a dashed border. Never dims the label. */
  disabled?: boolean;
  /** Renders a link that looks like a button, for mailto and page links. */
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children?: ReactNode;
}

/** Soft-square button. */
export function Button({
  variant = 'solid', size = 'l', ink, paper, icon, iconAfter, full = false, disabled = false,
  href, onClick, type = 'button', children
}: ButtonProps) {
  const className = [
    'k-button', `k-button--${variant}`, `k-button--${size}`,
    full && 'k-button--full', disabled && 'k-button--disabled'
  ].filter(Boolean).join(' ');
  const style = {
    ...(ink ? { '--button-ink': ink } : null),
    ...(paper ? { '--button-paper': paper } : null)
  } as CSSProperties;
  const inner = <>{icon && <Icon name={icon} />}{children}{iconAfter && <Icon name={iconAfter} />}</>;
  if (href && !disabled) return <a className={className} style={style} href={href}>{inner}</a>;
  return (
    <button className={className} style={style} type={type} aria-disabled={disabled || undefined} onClick={disabled ? undefined : onClick}>
      {inner}
    </button>
  );
}
