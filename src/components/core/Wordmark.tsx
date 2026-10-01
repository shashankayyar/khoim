import type { CSSProperties } from 'react';
import { SITE } from '../../data/site';
import './core.css';

export interface WordmarkProps {
  /** px. 22 on the phone map, 26 on the desktop header, 40 on About. */
  size?: number;
  /** Extra words for screen readers when the wordmark is a button, such as "About Khoim". Not shown. */
  suffix?: string;
}

/** Khoim in type: Devanagari and Romi at the same size, Devanagari first. There is no logo. */
export function Wordmark({ size = 22, suffix }: WordmarkProps) {
  return (
    <span className="k-wordmark" style={{ '--wordmark-size': `${size}px` } as CSSProperties}>
      <span className="k-wordmark__deva" lang="gom">{SITE.deva}</span>
      <span className="k-wordmark__romi">{SITE.romi}</span>
      {suffix && <span className="k-visually-hidden">. {suffix}</span>}
    </span>
  );
}
