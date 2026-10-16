/** Meaning of a place name. Readings side by side, each with its source; tradition labelled as tradition. Renders nothing without data. */
export interface MeaningBlockProps {
  meaning?: { kind: 'roots' | 'options' | 'differ' | 'tradition' | 'single'; readings: Array<{ text: string; roots?: Array<{ from: string; gloss: string }>; note?: string; from?: string; gloss?: string; source: string }> };
  style?: React.CSSProperties;
}
export declare function MeaningBlock(props: MeaningBlockProps): JSX.Element;
