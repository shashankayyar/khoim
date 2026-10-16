/** Draggable bottom sheet, two snap points (peek, full). The handle row carries the current place name. Phone only; desktop uses a side panel. */
export interface SheetProps {
  snap?: 'peek' | 'full';
  onSnap: (s: 'peek' | 'full' | 'closed') => void;
  peek?: number;
  top?: number;
  height?: number;
  bg?: string;
  ink?: string;
  label: string;
  /** shown in the handle row, left of the grip, with More / Less on the right. Use the current place name */
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Sheet(props: SheetProps): JSX.Element;
