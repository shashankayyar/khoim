import { ICON_PATHS, type IconName } from './iconPaths';

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Only when the icon stands alone and carries meaning. Otherwise it is hidden from screen readers. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 20, strokeWidth = 2, label, className }: IconProps) {
  return (
    <svg
      className={className ? `k-icon ${className}` : 'k-icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
