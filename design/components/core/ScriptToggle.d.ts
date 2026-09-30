/** Official / देवनागरी / Romi. A radio group with a sliding thumb; arrow keys move between options. */
export interface ScriptToggleProps {
  value?: 'official' | 'deva' | 'romi';
  onChange?: (v: 'official' | 'deva' | 'romi') => void;
  width?: number;
  style?: React.CSSProperties;
}
export declare function ScriptToggle(props: ScriptToggleProps): JSX.Element;
