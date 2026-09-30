/** Results across every form of every name. The matched part is marked; the house colour tab says which taluka it belongs to. */
export interface SearchResultsProps {
  query?: string;
  onPick?: (id: string) => void;
  limit?: number;
  style?: React.CSSProperties;
}
export declare function SearchResults(props: SearchResultsProps): JSX.Element;
