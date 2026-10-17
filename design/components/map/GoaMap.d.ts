/**
 * Phase 3: the type map. Goa drawn with every village's name inside its own outline, so the map is made of names.
 * Pan with drag; zoom with wheel, pinch or the + and - buttons, around the pointer. A village name shows once it is
 * 7px tall; taluka names fade as you zoom in. Tapping a village opens it: the map frames it, outlines it, keeps its
 * neighbours named and dims the rest. A view changes the colours only, never the framing.
 * The SVG is aria-hidden; search, the lists and the plain links reach every place.
 * Live implementation: src/components/map/GoaMap.tsx. GoaMap.jsx in this folder is the phase 2 reference.
 */
export interface GoaMapProps {
  /** the open place: a district, a taluka or a village ('v626925'); null = all of Goa */
  selected?: string | null;
  /** the district or taluka you are in; framed when nothing is selected */
  focus?: string | null;
  /** a place to outline lightly (dashed), e.g. the one under the mouse in a list */
  hot?: string | null;
  script?: 'official' | 'deva' | 'romi';
  /** a tap on a village */
  onSelect?: (id: string) => void;
  /** a tap on the sea or outside Goa: put the card away */
  onBackground?: () => void;
  /** the first pan, zoom or tap: the hint goes */
  onInteract?: () => void;
  /** px kept clear for floating chrome, so what is framed fits between the panel, header and sheet */
  insetTop?: number;
  insetBottom?: number;
  insetLeft?: number;
  insetRight?: number;
  /** every village with an outline, with its label data (angle a, size fs, box b, neighbours nb), and their outlines */
  villages?: object[];
  paths?: Record<string, string> | null;
  /** 'names' | 'parts' (Spelling endings) | 'need' (Still unwritten) */
  mapLayer?: { id: string; part?: string };
  /** a live layer's tiles: count per place, and its icon */
  marks?: Record<string, number> | null;
  markIcon?: string;
  /** named rivers, railway and stations (scripts/map-lines.mjs) */
  lines?: { rivers: { n: string; w: number; d: string[]; label: string }[]; rail: string[]; stations: { n: string; code: string; at: [number, number] }[] } | null;
  /** once village facts load: the feast, monument and GI symbols at village zoom */
  factsReady?: boolean;
}
export declare function GoaMap(props: GoaMapProps): JSX.Element;
