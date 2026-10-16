import React from 'react';
import { getPlace, layerUrl } from '../data/khoim.js';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Icon } from '../core/Icon.jsx';
import { ShareCard } from './ShareCard.jsx';
/* Share a place or a layer view. "Send" opens the phone's own share menu; desktop copies the link. No counts, no logins. */
export function ShareSheet({ place, layer, open = true, onClose, onCopied, onSave, desktop = false, style }) {
  const p = typeof place === 'string' ? getPlace(place) : place;
  const url = layerUrl(p, layer);
  const short = url.replace('https://', '');
  const send = () => { if (navigator.share && !desktop) navigator.share({ title: (p ? p.official : 'Goa') + ' on Khoim', url }).catch(() => {}); else copy(); };
  const copy = () => { try { navigator.clipboard && navigator.clipboard.writeText(url); } catch (e) {} onCopied && onCopied(); };
  const row = (icon, label, sub, fn) => <button type="button" onClick={fn} style={{ width: '100%', minHeight: 60, display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 12, alignItems: 'center', textAlign: 'left', padding: '8px 12px 8px 8px', border: 0, borderRadius: 'var(--radius-l)', background: 'var(--surface-raised)', color: 'var(--text)', cursor: 'pointer', boxShadow: 'var(--shadow-1)' }}>
    <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 'var(--radius-m)', background: 'var(--surface-sunk)', display: 'grid', placeItems: 'center' }}><Icon name={icon} size={20} /></span>
    <span style={{ display: 'grid' }}><span style={{ font: 'var(--weight-strong) 17px/1.3 var(--font-latin)' }}>{label}</span>{sub && <span style={{ font: 'var(--weight-regular) 14px/1.4 var(--font-latin)' }}>{sub}</span>}</span></button>;
  if (!open) return null;
  const title = 'Share ' + (p ? p.official : 'this view');
  return (
    <div role="dialog" aria-modal="true" aria-label={title} onKeyDown={e => e.key === 'Escape' && onClose && onClose()} style={{ background: 'var(--surface)', color: 'var(--text)', borderRadius: desktop ? 'var(--radius-xl)' : 'var(--radius-sheet) var(--radius-sheet) 0 0', padding: '16px var(--gutter) 24px', display: 'grid', gap: 14, boxShadow: 'var(--shadow-sheet)', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 style={{ margin: 0, font: 'var(--weight-strong) 22px/1.3 var(--font-latin)' }}>{title}</h2>{onClose && <IconButton icon="x" label="Close" tone="plain" onClick={onClose} />}</div>
      {p && !layer && <div aria-hidden="true" style={{ height: 184, borderRadius: 'var(--radius-l)', overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}><div style={{ transform: 'scale(.2917)', transformOrigin: '0 0' }}><ShareCard place={p} format="og" /></div></div>}
      <span style={{ font: 'var(--weight-strong) 15px/1.4 var(--font-latin)', wordBreak: 'break-all' }}>{short}</span>
      <div style={{ display: 'grid', gap: 8 }}>
        {!desktop && row('share-2', 'Send', 'WhatsApp, Instagram and the rest', send)}
        {row('link', 'Copy link', null, copy)}
        {p && !layer && row('square', 'Save image, square', 'For posts. Your village in Konkani', () => onSave && onSave('square'))}
        {p && !layer && row('rectangle-vertical', 'Save image, tall', 'For status and stories', () => onSave && onSave('story'))}
      </div>
    </div>
  );
}
