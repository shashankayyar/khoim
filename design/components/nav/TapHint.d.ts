/** First-visit cue. Shown after the map's demo (one taluka lights up, its names show, then it settles). Gone after the first tap, for good (localStorage 'khoim-tapped'). */
export interface TapHintProps {
  text?: string;
  visible?: boolean;
  style?: React.CSSProperties;
}
export declare function TapHint(props: TapHintProps): JSX.Element;
