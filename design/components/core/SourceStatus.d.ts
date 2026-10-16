/** Where a name stands with its sources. The mark (full, half, dashed ring, empty) carries the meaning without colour. */
export interface SourceStatusProps {
  /** agree, differ, pending (official name only) or review (a Konkani form exists but nobody has checked it yet) */
  status?: 'agree' | 'differ' | 'pending' | 'review';
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}
export declare function SourceStatus(props: SourceStatusProps): JSX.Element;
