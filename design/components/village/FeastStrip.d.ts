/** 12-month strip for a feast or zatra: the month filled, a tick at this year's date, a small marker for today. Computes moveable dates (Easter-based) and shows lunar rules as dashed months. */
export interface FeastStripProps {
  /** { month, day } | { easterSaturday: n } | { lunar: true, months: number[] } */
  when: object;
  /** the rule as the source states it, e.g. 'Third Saturday after Easter' */
  whenText: string;
  today?: Date;
  style?: React.CSSProperties;
}
export declare function FeastStrip(props: FeastStripProps): JSX.Element;
