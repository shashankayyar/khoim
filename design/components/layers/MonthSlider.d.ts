/** Month slider for the Feasts and zatras layer. role="slider", 52px tall, drag or arrow keys; a dot under each month that has something. */
export interface MonthSliderProps {
  /** 1..12 */
  value?: number;
  onChange?: (month: number) => void;
  /** places per month, length 12 */
  counts?: number[];
  style?: React.CSSProperties;
}
export declare function MonthSlider(props: MonthSliderProps): JSX.Element;
