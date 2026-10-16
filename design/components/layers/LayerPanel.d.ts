/** Controls and readout for a map layer: part picker (Name parts), month slider and list (Feasts and zatras), counts and legend (Names we need), shading legend (Population). */
export interface LayerPanelProps {
  layer: { id: 'names' | 'parts' | 'feasts' | 'need' | 'population'; part?: string; month?: number };
  onChange: (layer: object) => void;
  onShare?: () => void;
  onPickPlace?: (id: string) => void;
  onHelp?: () => void;
  year?: number;
  style?: React.CSSProperties;
}
export declare function LayerPanel(props: LayerPanelProps): JSX.Element;
