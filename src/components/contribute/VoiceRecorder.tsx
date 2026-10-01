/* Recording the name of a place, inside the contribution form: press, speak, listen back, send.
   Ten seconds at most. Nothing leaves the phone until the form is sent.

   Not in the design files: built 1 October 2026 from the pieces the design already has (the button, the
   recordings row on the card). TODO(copy): the wording here is not in docs/copy.md yet. */
import { useEffect, useRef, useState } from 'react';
import type { Recorded } from '../../lib/contribute';
import { Button } from '../core/Button';
import { Icon } from '../core/Icon';

const MAX_SECONDS = 10;
const MIN_SECONDS = 0.5;
/* What browsers can record, in order of preference: Chrome, Firefox and Android give the first; Safari the second. */
const TYPES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];

type State = 'idle' | 'recording' | 'done';
type Problem = 'unsupported' | 'blocked' | 'no-mic' | 'short' | null;

const PROBLEM: Record<Exclude<Problem, null>, string> = {
  unsupported: 'This browser cannot record sound. Try Chrome or Safari on your phone.',
  blocked: 'The microphone is switched off for this site. Allow it in your browser settings, then press Record again.',
  'no-mic': 'No microphone was found.',
  short: 'That was too short to hear. Please record again.'
};

const whole = (seconds: number) => { const n = Math.max(1, Math.round(seconds)); return n + (n === 1 ? ' second' : ' seconds'); };

export interface VoiceRecorderProps {
  /** id of the Record button, so the form can move the cursor here. */
  id: string;
  official: string;
  recording: Recorded | null;
  onChange: (r: Recorded | null) => void;
}

export function VoiceRecorder({ id, official, recording, onChange }: VoiceRecorderProps) {
  const [state, setState] = useState<State>(recording ? 'done' : 'idle');
  const [problem, setProblem] = useState<Problem>(null);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rec = useRef<MediaRecorder | null>(null), stream = useRef<MediaStream | null>(null), chunks = useRef<Blob[]>([]);
  const started = useRef(0), tick = useRef(0), limit = useRef(0);
  const audio = useRef<HTMLAudioElement | null>(null), url = useRef<string | null>(null);

  const stopPlayback = () => { audio.current?.pause(); audio.current = null; setPlaying(false); };
  const release = () => {
    window.clearInterval(tick.current); window.clearTimeout(limit.current);
    stream.current?.getTracks().forEach(t => t.stop());
    stream.current = null;
  };
  /* leaving the form mid-recording switches the microphone off */
  useEffect(() => () => {
    if (rec.current && rec.current.state !== 'inactive') { rec.current.onstop = null; rec.current.stop(); }
    release(); audio.current?.pause();
    if (url.current) URL.revokeObjectURL(url.current);
  }, []);
  /* the form was reset (a new place, or it was sent) */
  useEffect(() => { if (!recording && state === 'done') { stopPlayback(); setState('idle'); } }, [recording, state]);

  const stop = () => { if (rec.current && rec.current.state !== 'inactive') rec.current.stop(); };

  const start = async () => {
    setProblem(null); stopPlayback(); onChange(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setProblem('unsupported'); return; }
    let s: MediaStream;
    try {
      s = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = (e as DOMException)?.name;
      setProblem(name === 'NotFoundError' || name === 'OverconstrainedError' ? 'no-mic' : 'blocked');
      return;
    }
    stream.current = s;
    const type = TYPES.find(t => MediaRecorder.isTypeSupported(t));
    let r: MediaRecorder;
    try {
      r = new MediaRecorder(s, { ...(type ? { mimeType: type } : null), audioBitsPerSecond: 32000 });
    } catch {
      release(); setProblem('unsupported'); return;
    }
    rec.current = r;
    chunks.current = [];
    r.ondataavailable = e => { if (e.data.size) chunks.current.push(e.data); };
    r.onstop = () => {
      const seconds = Math.min(MAX_SECONDS, (performance.now() - started.current) / 1000);
      release();
      const mime = (r.mimeType || type || 'audio/webm').split(';')[0];
      const blob = new Blob(chunks.current, { type: mime });
      if (seconds < MIN_SECONDS || !blob.size) { setState('idle'); setProblem('short'); return; }
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      onChange({ blob, mime, seconds: Math.round(seconds * 10) / 10 });
      setElapsed(seconds);
      setState('done');
    };
    started.current = performance.now();
    setElapsed(0);
    r.start();
    setState('recording');
    tick.current = window.setInterval(() => setElapsed((performance.now() - started.current) / 1000), 200);
    limit.current = window.setTimeout(stop, MAX_SECONDS * 1000);
  };

  const play = () => {
    if (playing) { stopPlayback(); return; }
    if (!url.current) return;
    const a = new Audio(url.current);
    audio.current = a;
    a.onended = () => setPlaying(false);
    setPlaying(true);
    a.play().catch(() => setPlaying(false));
  };

  const left = Math.max(0, Math.ceil(MAX_SECONDS - elapsed));
  return (
    <div className="k-rec">
      <p className="k-rec__ask">Say <strong>{official}</strong> the way you say it at home. Up to {MAX_SECONDS} seconds.</p>

      {state === 'idle' && (
        <div className="k-rec__row">
          <Button id={id} variant="outline" icon="mic" onClick={start}>Record</Button>
        </div>
      )}
      {state === 'recording' && (
        <div className="k-rec__row">
          <Button id={id} icon="pause" onClick={stop}>Stop</Button>
          <p className="k-rec__time">Recording. {left} {left === 1 ? 'second' : 'seconds'} left.</p>
          <div className="k-rec__meter" aria-hidden="true"><span style={{ width: Math.min(100, (elapsed / MAX_SECONDS) * 100) + '%' }} /></div>
        </div>
      )}
      {state === 'done' && recording && (
        <div className="k-rec__row">
          <Button id={id} variant="outline" icon={playing ? 'pause' : 'play'} onClick={play}>{playing ? 'Stop' : 'Listen'}</Button>
          <Button variant="ghost" icon="mic" onClick={start}>Record again</Button>
          <p className="k-rec__time">{whole(recording.seconds)} recorded.</p>
        </div>
      )}

      {problem && <p className="k-field__error" role="alert"><Icon name="info" size={20} /><span>{PROBLEM[problem]}</span></p>}
      {/* said once to a screen reader when the state changes; the countdown above is not read out every second */}
      <p className="k-visually-hidden" role="status">
        {state === 'recording' ? 'Recording.' : state === 'done' && recording ? 'Recorded, ' + whole(recording.seconds) + '.' : ''}
      </p>
    </div>
  );
}
