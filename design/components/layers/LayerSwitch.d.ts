/** Map layers: Names (live), Voices (next), Crops, Food, Music, Landmarks (planned). Future layers are visible but not switchable. */
export interface LayerSwitchProps {
  value?: string;
  onChange?: (id: string) => void;
  /** defaults to KhoimData.LAYERS */
  layers?: Array<{ id: string; label: string; icon: string; status: 'live' | 'next' | 'planned'; note: string }>;
  style?: React.CSSProperties;
}
export declare function LayerSwitch(props: LayerSwitchProps): JSX.Element;
