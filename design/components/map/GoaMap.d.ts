/**
 * Goa as a street of painted houses: each taluka lime-washed in its house colour, white trim between them.
 * Tap selects, tap again goes inside (the parent decides). Press and drag scrubs with a loupe.
 * Every label is a real button with a spoken name, so the map works with a keyboard and a screen reader.
 */
export interface GoaMapProps {
  /** null = all Goa; a district id ('south-goa') or taluka id ('salcete') */
  focus?: string | null;
  /** selected place id: district, taluka or village ('v626925') */
  selected?: string | null;
  /** transient highlight while scrubbing or swiping a strip */
  hot?: string | null;
  script?: 'official' | 'deva' | 'romi';
  /** (id, fromScrub) */
  onSelect?: (id: string, fromScrub: boolean) => void;
  onHot?: (id: string | null) => void;
  /** px kept clear for floating chrome, so Goa fits between the header and the sheet */
  insetTop?: number;
  insetBottom?: number;
  insetLeft?: number;
  insetRight?: number;
  /** repaint talukas north to south on mount (first load only). Skipped under reduced motion */
  paintIn?: boolean;
  style?: React.CSSProperties;
}
export declare function GoaMap(props: GoaMapProps): JSX.Element;
