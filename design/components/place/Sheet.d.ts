/** Draggable bottom sheet, two snap points (peek, full). Phone only; desktop uses a side panel. */
export interface SheetProps {
  snap?: 'peek' | 'full';
  /** called with 'peek' | 'full' | 'closed' (drag down from peek, or Escape) */
  onSnap: (s: 'peek' | 'full' | 'closed') => void;
  /** visible height in px when peeking */
  peek?: number;
  /** px from the top of the screen when full */
  top?: number;
  /** screen height, px */
  height?: number;
  bg?: string;
  ink?: string;
  /** accessible name, e.g. the place's official name */
  label: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Sheet(props: SheetProps): JSX.Element;
