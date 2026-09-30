/** Thin strip above everything while names are unreviewed. Remove when the first reviewed release ships. */
export interface DraftBannerProps {
  onTellUs?: () => void;
  style?: React.CSSProperties;
}
export declare function DraftBanner(props: DraftBannerProps): JSX.Element;
