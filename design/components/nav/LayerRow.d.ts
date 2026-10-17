/** Phase 3: the map views, Names · Spelling endings · Still unwritten, as a segmented row (44px), one at a time.
 *  Never hidden or covered. Live: src/components/layers/LayerRow.tsx. LayerRow.jsx here is the phase 2 reference. */
export interface LayerRowProps {
  value?: 'names' | 'parts' | 'need';
  onChange?: (id: 'names' | 'parts' | 'need') => void;
  style?: React.CSSProperties;
}
export declare function LayerRow(props: LayerRowProps): JSX.Element;
