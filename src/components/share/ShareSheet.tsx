/* Share a place or a map view (design/components/share/ShareSheet.jsx). On phones: Send opens the phone's own
   share menu (WhatsApp, Instagram and the rest); Copy link; and for a place, the square and tall images
   ("My village in Konkani"). Desktop has no sheet: Share copies the link straight away. No counts, no logins. */
import { useRef } from 'react';
import type { Place } from '../../data/types';
import { useDialog } from '../../lib/dialog';
import type { MapLayer } from '../../lib/layers';
import { copyText, imageUrl, shareUrl } from '../../lib/share';
import { Icon } from '../core/Icon';
import { IconButton } from '../core/IconButton';
import type { IconName } from '../core/iconPaths';
import './share.css';

export interface ShareSheetProps {
  open: boolean;
  place: Place | null;
  /** A map view to share instead of a place. */
  layer: MapLayer | null;
  onClose: () => void;
  onDone: (message: string) => void;
}

export function ShareSheet({ open, place, layer, onClose, onDone }: ShareSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, open, onClose);
  const view = !!layer && layer.id !== 'names';
  const url = shareUrl(place, view ? layer : null);
  /* TODO(copy): "Share {place}" and "Share this view" are the design's; "{place} on Khoim" is the share title */
  const title = view || !place ? 'Share this view' : 'Share ' + place.official;
  const copy = async () => {
    if (await copyText(url)) onDone('Link copied');
    else { /* the browser would not copy: select the link so it can be copied by hand */
      const el = ref.current?.querySelector('.k-share__url');
      if (el) { const r = document.createRange(); r.selectNodeContents(el); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r); }
    }
  };
  const send = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: (place ? place.official : 'Goa') + ' on Khoim', url }); onClose(); } catch { /* the person closed the menu */ }
    } else copy();
  };
  const row = (icon: IconName, label: string, sub: string | null, props: { onClick?: () => void; href?: string; download?: string }) => {
    const inner = <><span className="k-share__icon" aria-hidden="true"><Icon name={icon} size={20} /></span><span className="k-share__words"><span className="k-share__label">{label}</span>{sub && <span className="k-share__sub">{sub}</span>}</span></>;
    return props.href
      ? <a className="k-share__row" href={props.href} download={props.download} onClick={props.onClick}>{inner}</a>
      : <button type="button" className="k-share__row" onClick={props.onClick}>{inner}</button>;
  };
  const slug = place && place.level !== 'state' ? place.slug : 'goa';
  return (
    <div className={open ? 'k-share-scrim is-open' : 'k-share-scrim'} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-hidden={!open}>
      <div ref={ref} tabIndex={-1} className="k-share" role="dialog" aria-modal="true" aria-label={title}>
        {open && (
          <>
            <div className="k-share__top"><h2 className="k-share__title">{title}</h2><IconButton icon="x" label="Close" tone="plain" onClick={onClose} /></div>
            {place && !view && <img className="k-share__preview" src={imageUrl(place, 'og')} alt="" width={1200} height={630} />}
            <span className="k-share__url" tabIndex={0}>{url.replace(/^https:\/\//, '')}</span>
            <div className="k-share__rows">
              {row('share-2', 'Send', 'WhatsApp, Instagram and the rest', { onClick: send })}
              {row('link', 'Copy link', null, { onClick: copy })}
              {place && !view && row('square', 'Save image, square', 'For posts. Your village in Konkani', { href: imageUrl(place, 'square'), download: `khoim-${slug}-square.png`, onClick: () => onDone('Square image saved') })}
              {place && !view && row('rectangle-vertical', 'Save image, tall', 'For status and stories', { href: imageUrl(place, 'tall'), download: `khoim-${slug}-tall.png`, onClick: () => onDone('Tall image saved') })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
