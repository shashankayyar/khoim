/** Phase 4 (B3): what the map shows, one control for the views and the layers. Names and Spelling endings always;
 *  Feasts and zatras, Landmarks, Voices, Crops, Food and Music only with 10 or more entries, each with its count.
 *  Desktop: a segmented row (44px) that wraps, with "Show" in front. Phone (compact): "Show" and a native list in one
 *  row. Never hidden or covered. Live: src/components/layers/ShowControl.tsx; choices from showOptions() in
 *  src/lib/layers.ts. Replaces LayerRow. */
export interface ShowOption { id: string; label: string; icon?: string; count?: number; kind: 'view' | 'live' }
export interface ShowControlProps {
  options: ShowOption[];
  value: string;
  onChange: (id: string) => void;
  /** a phone: one row with a native list */
  compact?: boolean;
}
export declare function ShowControl(props: ShowControlProps): JSX.Element;
