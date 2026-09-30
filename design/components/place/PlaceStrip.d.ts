/** Horizontal, snapping list of the places inside a level. Doubles as the keyboard and screen-reader route into the map. */
export interface PlaceStripProps {
  /** 'goa' or null for districts, a district id for talukas, a taluka id for villages */
  parent?: string | null;
  script?: 'official' | 'deva' | 'romi';
  /** id highlighted on the map */
  active?: string | null;
  /** fires as cards snap into view or get focus; drive the map's hot prop with it */
  onFocusPlace?: (id: string) => void;
  onPick?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function PlaceStrip(props: PlaceStripProps): JSX.Element;
