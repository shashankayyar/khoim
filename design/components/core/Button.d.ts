/** Soft-square button. On a house-colour surface pass the house's ink and paper so contrast stays AAA. */
export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost';
  /** l = 56px (default, phone), m = 48px */
  size?: 'l' | 'm';
  /** text/border colour for outline & ghost, fill for solid. Default var(--text) */
  ink?: string;
  /** label colour on solid. Default var(--surface-raised) */
  paper?: string;
  icon?: string;
  iconAfter?: string;
  full?: boolean;
  /** keeps focusability (aria-disabled) and shows a dashed border; never dims the label */
  disabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
