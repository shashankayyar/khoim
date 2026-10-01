import { useEffect, useRef, useState } from 'react';
import { sayParts } from '../../data/khoim';
import { useReducedMotion } from '../../lib/motion';
import './place.css';

const BEAT_MS = 420;

export interface SayItProps {
  /** Say-it guide, stressed syllable in capitals: "KAAN-kon". */
  say: string | null;
  note?: string | null;
  /** False until a Konkani speaker has checked the guide. The note under the beats says so. */
  reviewed?: boolean;
  /** For pages read without JavaScript: the beats are shown as text, not as a button. */
  plain?: boolean;
}

/** The say-it guide as beats. Tap to step through the syllables at a steady beat, like a ghumot. */
export function SayIt({ say, note, reviewed = false, plain = false }: SayItProps) {
  const reduce = useReducedMotion();
  const parts = sayParts(say);
  const [beat, setBeat] = useState(-1);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  if (!say) return null;
  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = parts.map((_, i) => window.setTimeout(() => setBeat(i), i * BEAT_MS));
    timers.current.push(window.setTimeout(() => setBeat(-1), parts.length * BEAT_MS + 200));
  };
  const beats = parts.map((p, i) => (
    <span key={i} aria-hidden={plain ? undefined : true}
      className={'k-say-it__beat' + (p.stressed ? ' k-say-it__beat--stressed' : '') + (beat === i ? ' is-on' : '') + (beat === i && !reduce ? ' is-lifted' : '')}>
      {p.text}
    </span>
  ));
  return (
    <div className="k-say-it">
      {plain
        ? <div className="k-say-it__beats">{beats}</div>
        : <button type="button" className="k-say-it__beats" onClick={play} aria-label={'Say it: ' + say + '. Show the beat'}>{beats}</button>}
      <p className="k-say-it__note">{'Rough guide' + (note ? ', ' + note : '') + '. ' + (reviewed ? 'Checked by a speaker.' : 'Not yet checked by a speaker.')}</p>
    </div>
  );
}
