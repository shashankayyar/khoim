/** Lucide icon from the copied set in assets/lucide/. Inherits currentColor. Decorative unless label is given. */
export interface IconProps {
  name: 'search' | 'x' | 'arrow-left' | 'arrow-right' | 'chevron-up' | 'chevron-down' | 'languages' | 'mic' | 'wheat' | 'soup' | 'music' | 'landmark' | 'play' | 'pause' | 'info' | 'mail' | 'sun' | 'moon' | 'layers' | 'volume-2' | 'check' | 'circle-help';
  size?: number;
  strokeWidth?: number;
  /** give a label only when the icon is the only content; otherwise it is hidden from screen readers */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
