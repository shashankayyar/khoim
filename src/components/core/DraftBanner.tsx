import './core.css';

export interface DraftBannerProps {
  /** Opens help in the app. */
  onTellUs?: () => void;
  /** Where "Tell us what is wrong" goes when there is no app to open (static pages). */
  tellUsHref?: string;
}

/** Thin strip above everything while names are unreviewed. Remove when the first reviewed release ships. */
export function DraftBanner({ onTellUs, tellUsHref }: DraftBannerProps) {
  return (
    <div className="k-draft-banner" role="note">
      <strong>Draft for review.</strong>
      <span>Names and pronunciation guides are not final.</span>
      {tellUsHref ? (
        <a className="k-draft-banner__action" href={tellUsHref}>Tell us what is wrong</a>
      ) : onTellUs ? (
        <button className="k-draft-banner__action" type="button" onClick={onTellUs}>Tell us what is wrong</button>
      ) : null}
    </div>
  );
}
