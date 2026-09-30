import React from 'react';
import { Icon } from '../core/Icon.jsx';
/* A recording of a local person saying the name, credited by name and village. Empty state invites a recording. */
export function VoiceClip({ recordings, placeName, ink = 'var(--text)', paper = 'var(--surface-raised)', onRecord, style }) {
  const [playing, setPlaying] = React.useState(null);
  const audio = React.useRef(null);
  const play = (r, i) => {
    if (playing === i) { audio.current && audio.current.pause(); setPlaying(null); return; }
    if (r.src) { if (audio.current) audio.current.pause(); audio.current = new Audio(r.src); audio.current.onended = () => setPlaying(null); audio.current.play(); }
    setPlaying(i);
  };
  if (!recordings || !recordings.length) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, color: ink, ...style }}>
        <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: 'var(--radius-m)', border: '2px dashed ' + ink, display: 'grid', placeItems: 'center' }}><Icon name="mic" size={20} /></span>
        <span style={{ font: 'var(--weight-regular) 16px/1.45 var(--font-latin)' }}>No recordings yet.{onRecord ? ' ' : ''}{onRecord && <button type="button" onClick={onRecord} style={{ border: 0, background: 'transparent', padding: '6px 0', color: ink, font: 'inherit', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>{'Record ' + (placeName || 'this name')}</button>}</span>
      </div>
    );
  }
  return (
    <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0, display: 'grid', gap: 8, color: ink, ...style }}>
      {recordings.map((r, i) => (
        <li key={i}>
          <button type="button" onClick={() => play(r, i)} aria-pressed={playing === i} aria-label={(playing === i ? 'Pause ' : 'Play ') + r.speaker + ', ' + r.village}
            style={{ width: '100%', display: 'grid', gridTemplateColumns: '48px minmax(0,1fr) auto', gap: 12, alignItems: 'center', border: '2px solid ' + ink, borderRadius: 'var(--radius-l)', background: 'transparent', color: ink, padding: 6, cursor: 'pointer', textAlign: 'left' }}>
            <span aria-hidden="true" style={{ width: 48, height: 48, borderRadius: 'var(--radius-m)', background: ink, color: paper, display: 'grid', placeItems: 'center' }}><Icon name={playing === i ? 'pause' : 'play'} size={20} /></span>
            <span style={{ display: 'grid' }}><span style={{ font: 'var(--weight-strong) 17px/1.3 var(--font-latin)' }}>{r.speaker}</span><span style={{ font: 'var(--weight-regular) 15px/1.4 var(--font-latin)' }}>{r.village}</span></span>
            {r.duration && <span style={{ font: 'var(--weight-regular) 15px/1 var(--font-latin)', paddingRight: 10 }}>{r.duration}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
