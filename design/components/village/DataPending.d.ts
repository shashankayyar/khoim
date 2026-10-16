/** Marked placeholder for data not loaded yet (Census 2011, PIN, panchayat, station). Dashed border in the ink colour; reads at full contrast. */
export interface DataPendingProps {
  label?: string;
  /** e.g. 'Census 2011' */
  source?: string;
  style?: React.CSSProperties;
}
export declare function DataPending(props: DataPendingProps): JSX.Element;
