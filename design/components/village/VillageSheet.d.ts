/** Village sheet in the fixed phase 2 order: name block, say it, meaning, name split, spellings, vaddos, facts, known for, video, sources, actions. Blocks with no data do not render (Facts always renders, with marked placeholders). */
export interface VillageSheetProps {
  /** village place id ('v626704') or place object */
  place: string | object;
  expanded?: boolean;
  /** first one shows a play button in the name block */
  recordings?: Array<{ speaker: string; village: string; src?: string }>;
  /** for feast dates; defaults to now */
  today?: Date;
  onExpand?: () => void;
  onClose?: () => void;
  onShare?: () => void;
  onSuggest?: () => void;
  onRecord?: () => void;
  onPickPlace?: (id: string) => void;
  headingLevel?: 1 | 2 | 3;
  style?: React.CSSProperties;
}
export declare function VillageSheet(props: VillageSheetProps): JSX.Element;
