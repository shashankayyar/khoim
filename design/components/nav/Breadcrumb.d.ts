/** Goa, district, taluka, village. Doubles as the way back: each earlier step is a 44px button. Follows the script toggle. */
export interface BreadcrumbProps {
  /** current place id; null or 'goa' shows just Goa */
  id?: string | null;
  script?: 'official' | 'deva' | 'romi';
  /** called with the id to go to (null for Goa) */
  onNavigate?: (id: string | null) => void;
  /** raised = tiles over the map (phone); plain = underlined text links (desktop header) */
  tone?: 'raised' | 'plain';
  style?: React.CSSProperties;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
