/** All villages in a taluka, sortable. Full table on desktop (th buttons with aria-sort); compact list with Sort buttons on phones. The landing page for search visitors. */
export interface VillageTableProps {
  /** taluka id, e.g. 'bardez' */
  taluka: string;
  onPick?: (id: string) => void;
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function VillageTable(props: VillageTableProps): JSX.Element;
