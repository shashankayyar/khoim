/** Square 48px icon-only button. label is required and becomes the accessible name. */
export interface IconButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  /** raised = white tile with shadow over the map; soft = tinted, for use on house sheets; plain = no fill */
  tone?: 'raised' | 'soft' | 'plain';
  ink?: string;
  size?: number;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
