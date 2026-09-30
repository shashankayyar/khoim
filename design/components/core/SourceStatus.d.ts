/** Where a name stands with its sources. The mark (full, half, empty) carries the meaning without colour. */
export interface SourceStatusProps {
  status?: 'agree' | 'differ' | 'pending';
  /** ink colour; defaults to currentColor so it follows house sheets */
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}
export declare function SourceStatus(props: SourceStatusProps): JSX.Element;
