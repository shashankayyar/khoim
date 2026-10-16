/** Share menu for a place or a layer view. Send (system share menu), Copy link, Save image square and tall. Desktop: copy only, confirmed by a Toast. */
export interface ShareSheetProps {
  place?: string | object;
  /** share a layer view instead: its link opens with the same layer and part/month selected */
  layer?: { id: string; part?: string; month?: number };
  open?: boolean;
  onClose?: () => void;
  onCopied?: () => void;
  onSave?: (format: 'square' | 'story') => void;
  desktop?: boolean;
  style?: React.CSSProperties;
}
export declare function ShareSheet(props: ShareSheetProps): JSX.Element;
