/**
 * A place's names on its house colour, inside a white-trim frame. Order is fixed: Devanagari (largest), Romi, official, then say it, sources, details.
 */
export interface PlaceCardProps {
  /** place id ('canacona', 'v626925') or a place object */
  place: string | object;
  /** false = peek (names + two actions), true = full (say it, sources, details) */
  expanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  onGoInside?: (id: string) => void;
  /** "Tell us" on places with no Konkani name */
  onSuggest?: () => void;
  /** future: [{ speaker, village, src, duration }] */
  recordings?: Array<{ speaker: string; village: string; src?: string; duration?: string }>;
  headingLevel?: 1 | 2 | 3;
  style?: React.CSSProperties;
}
export declare function PlaceCard(props: PlaceCardProps): JSX.Element;
