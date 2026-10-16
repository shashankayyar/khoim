/** List of vaddos (wards) in a village. Never drawn as shapes. */
export interface VaddoListProps {
  vaddos?: { source: string; items: string[] };
  style?: React.CSSProperties;
}
export declare function VaddoList(props: VaddoListProps): JSX.Element;
