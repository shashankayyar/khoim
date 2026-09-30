/** Search input for any script. The placeholder shows one name in all three forms. */
export interface SearchFieldProps {
  value?: string;
  onChange?: (v: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  /** visually hidden label */
  label?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  style?: React.CSSProperties;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
