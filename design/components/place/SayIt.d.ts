/** Pronunciation as syllable beats. The stressed syllable is the one written in capitals in the data. */
export interface SayItProps {
  /** e.g. 'KAAN-kon' */
  say: string;
  /** e.g. 'both n sounds are retroflex' */
  note?: string;
  reviewed?: boolean;
  /** colour of text and outlines; pass the house's -on ink on a sheet */
  ink?: string;
  /** fill colour for the active beat's text; pass the house colour on a sheet */
  paper?: string;
  style?: React.CSSProperties;
}
export declare function SayIt(props: SayItProps): JSX.Element;
