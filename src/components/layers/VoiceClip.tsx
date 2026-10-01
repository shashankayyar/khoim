import { useRef, useState } from 'react';
import type { Recording } from '../../data/types';
import { Icon } from '../core/Icon';
import './layers.css';

export interface VoiceClipProps {
  /** Recordings of the name. Until some exist, only the empty state shows. */
  recordings?: Recording[];
}

/** A recording of a local person saying the name, credited by name and village. */
export function VoiceClip({ recordings }: VoiceClipProps) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  if (!recordings || !recordings.length) {
    return (
      <div className="k-voice-empty">
        <span className="k-voice-empty__icon" aria-hidden="true"><Icon name="mic" size={20} /></span>
        <span>No recordings yet.</span>
      </div>
    );
  }
  const play = (r: Recording, i: number) => {
    audio.current?.pause();
    if (playing === i) { setPlaying(null); return; }
    audio.current = new Audio(r.src);
    audio.current.onended = () => setPlaying(null);
    void audio.current.play();
    setPlaying(i);
  };
  return (
    <ul className="k-voice-list">
      {recordings.map((r, i) => (
        <li key={i}>
          <button type="button" className="k-voice" onClick={() => play(r, i)} aria-pressed={playing === i} aria-label={(playing === i ? 'Pause ' : 'Play ') + r.speaker + ', ' + r.village}>
            <span className="k-voice__play" aria-hidden="true"><Icon name={playing === i ? 'pause' : 'play'} size={20} /></span>
            <span className="k-voice__who"><span className="k-voice__speaker">{r.speaker}</span><span className="k-voice__village">{r.village}</span></span>
            {r.duration && <span className="k-voice__duration">{r.duration}</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
