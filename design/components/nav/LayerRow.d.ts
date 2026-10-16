/** Map layer picker: Names, Name parts, Feasts and zatras, Names we need, Population. A labelled sideways row of 44px tiles. */
export interface LayerRowProps {
  value?: 'names' | 'parts' | 'feasts' | 'need' | 'population';
  onChange?: (id: string) => void;
  /** defaults to KhoimData.MAP_LAYERS */
  layers?: Array<{ id: string; label: string; icon: string }>;
  style?: React.CSSProperties;
}
export declare function LayerRow(props: LayerRowProps): JSX.Element;
