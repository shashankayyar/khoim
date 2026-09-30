import React from 'react';
import { sayParts } from '../data/khoim.js';
import { useReducedMotion } from '../core/motion.js';
/* The say-it guide as beats. Tap to step through the syllables at a steady beat, like a ghumot. */
export function SayIt({ say, note, reviewed = false, ink = 'currentColor', paper = 'var(--surface-raised)', style }) {
  const reduce = useReducedMotion();
  const parts = sayParts(say);
  const [beat, setBeat] = React.useState(-1);
  const t = React.useRef([]);
  React.useEffect(() => () => t.current.forEach(clearTimeout), []);
  const play = () => { t.current.forEach(clearTimeout); t.current = parts.map((_, i) => setTimeout(() => setBeat(i), i * 420)); t.current.push(setTimeout(() => setBeat(-1), parts.length * 420 + 200)); };
  if (!say) return null;
  return (
    <div style={{ display: 'grid', gap: 12, ...style }}>
      <button type="button" onClick={play} aria-label={'Say it: ' + say + '. Show the beat'} style={{ border: 0, background: 'transparent', padding: 0, color: ink, textAlign: 'left', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: 8, borderRadius: 'var(--radius-m)' }}>
        {parts.map((p, i) => (
          <span key={i} aria-hidden="true" style={{ padding: '6px 14px', borderRadius: 'var(--radius-m)', border: '2px solid ' + ink,
            font: `${p.stressed ? 'var(--weight-heavy)' : 'var(--weight-regular)'} ${p.stressed ? 30 : 24}px/1.25 var(--font-latin)`,
            background: beat === i ? ink : 'transparent', color: beat === i ? paper : ink,
            transform: beat === i && !reduce ? 'translateY(-3px)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out), background-color var(--dur-press) linear, color var(--dur-press) linear' }}>{p.text}</span>
        ))}
      </button>
      <p style={{ margin: 0, color: ink, font: 'var(--weight-regular) 16px/1.5 var(--font-latin)' }}>{'Rough guide' + (note ? ', ' + note : '') + '. ' + (reviewed ? 'Checked by a speaker.' : 'Not yet checked by a speaker.')}</p>
    </div>
  );
}
