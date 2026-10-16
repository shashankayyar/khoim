/** Short confirmation such as "Link copied". role="status". Never a share or like count. */
export interface ToastProps {
  text: string;
  visible?: boolean;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
