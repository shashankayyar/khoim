import type { CSSProperties } from 'react';
import { SITE } from '../../data/site';
import './core.css';

export interface WordmarkProps {
  /** px. 22 on the phone map, 26 on the desktop header, 40 on About. */
  size?: number;
}

/** Khoim in type: Devanagari and Romi at the same size, Devanagari first. There is no logo. */
export function Wordmark({ size = 22 }: WordmarkProps) {
  return (
    <span className="k-wordmark" style={{ '--wordmark-size': `${size}px` } as CSSProperties}>
      <span className="k-wordmark__deva" lang="gom" aria-hidden="true">{SITE.deva}</span>
      <span className="k-wordmark__romi" aria-hidden="true">{SITE.romi}</span>
      <span className="k-visually-hidden">{SITE.romi}</span>
    </span>
  );
}
