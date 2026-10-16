/** Spellings over time, or by source when there is no order. Vertical line with a stop per spelling; the current form is the filled stop. */
export interface SpellingTimelineProps {
  spellings?: { ordered: boolean; items: Array<{ form: string; source: string; year?: string; lang?: string; note?: string }> };
  style?: React.CSSProperties;
}
export declare function SpellingTimeline(props: SpellingTimelineProps): JSX.Element;
