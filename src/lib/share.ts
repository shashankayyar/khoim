/* Sharing a place or a map view (phase 2, screen 8). The link is the page's own address, with the view if one is
   on. The images are made when the site is built (scripts/og/cards.mjs): no counts, no logins, nothing sent
   anywhere until the person chooses to. */
import { pathOf } from '../data/khoim';
import type { Place } from '../data/types';
import { layerQuery, type MapLayer } from './layers';

export const SITE_URL = 'https://khoim.in';

/** https://khoim.in/north-goa/bardez/aldona/ or https://khoim.in/?layer=parts&part=im */
export function shareUrl(p: Place | null, layer: MapLayer | null): string {
  const q = layer && layer.id !== 'names' ? '?' + layerQuery(layer) : '';
  return SITE_URL + pathOf(p) + q;
}

/** The images made at build (scripts/og/cards.mjs makes the same addresses): the link preview, and the square
    and tall images the share sheet saves. */
export function imageUrl(p: Place, format: 'og' | 'square' | 'tall'): string {
  return '/og' + (format === 'og' ? '' : '/' + format) + (p.level === 'state' ? '/goa' : pathOf(p).slice(0, -1)) + '.png';
}

/** Copies text. Uses the clipboard where the browser allows it, and an old-style copy otherwise. */
export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall through */ }
  try {
    const t = document.createElement('textarea');
    t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  } catch { return false; }
}
