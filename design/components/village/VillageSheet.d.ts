/** Phase 3 village sheet, on the page colour: the outline beside the name; Official, देवनागरी and Romi listed together
 *  ("not written yet" where empty; a Gazetteer-only form here only, marked Needs review); the ask; say it and the phase 2
 *  blocks (meaning, spellings, vaddos, facts, known for, video); Next to; sources, boundary, share, correction.
 *  Live: src/components/village/VillageSheet.tsx. VillageSheet.jsx here is the phase 2 reference. */
export interface VillageSheetProps {
  /** village place object */
  place: object;
  /** the chosen script: the big name follows it */
  script: 'official' | 'deva' | 'romi';
  /** the village's outline (SVG path on the map plane) */
  outline?: string | null;
  facts?: object | null;
  /** allowed recordings and notes for this village */
  live?: object[];
  layer?: string;
  headingLevel?: 1 | 2 | 3;
  onClose?: () => void;
  /** opens the contribution form; without it the ask and the correction open an email */
  onTell?: (kind?: string) => void;
  /** a Next to button: open that village and move the map there */
  onPick?: (id: string) => void;
  onShare?: () => void;
  /** no JavaScript: neighbours are links */
  plain?: boolean;
}
export declare function VillageSheet(props: VillageSheetProps): JSX.Element;
