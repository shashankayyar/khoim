/** Name broken into parts. Only parts a source explains; each part lists villages that share it. */
export interface NameSplitProps {
  split?: { whole: string; source: string; parts: Array<{ part: string; sharedWith: Array<{ id: string; name: string }> }> };
  onPickPlace?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function NameSplit(props: NameSplitProps): JSX.Element;
