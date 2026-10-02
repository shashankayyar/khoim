/* Clipping a recording on the reviewers' page: see the sound, mark where the name starts and ends, listen
   to that part, allow it. Built 2 October 2026 with what the browser already has (no outside code).

   The recording itself is never cut here. Only the two marks are saved, as "Clip 0.85-2.40" (seconds) in the
   item's final_value, so a clip that turns out too tight can be changed. The cut is made when the recording
   goes onto the site. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Button } from '../components/core/Button';

export interface Clip { start: number; end: number }

/** A clip may not be shorter than this (the server checks the same). */
const MIN_SECONDS = 0.3;
const BARS = 240, HEIGHT = 96;

const round = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));

export const parseClip = (final: string | null): Clip | null => {
  const m = /^Clip (\d+\.\d+)-(\d+\.\d+)$/.exec(final ?? '');
  return m ? { start: Number(m[1]), end: Number(m[2]) } : null;
};
export const clipWords = (c: Clip) => `From ${c.start.toFixed(2)} to ${c.end.toFixed(2)} seconds`;

/* One sound output for the whole page: browsers allow only a few. */
let shared: AudioContext | null = null;
const context = () => (shared ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)());

async function loadRecording(id: string): Promise<AudioBuffer> {
  const r = await fetch('/api/admin/audio?id=' + encodeURIComponent(id));
  if (!r.ok) throw new Error('not loaded');
  return context().decodeAudioData(await r.arrayBuffer());
}

/** Plays one part of a recording, exactly from mark to mark. */
function usePlayer() {
  const [playing, setPlaying] = useState(false);
  const node = useRef<AudioBufferSourceNode | null>(null);
  const stop = () => {
    if (node.current) { node.current.onended = null; node.current.stop(); node.current = null; }
    setPlaying(false);
  };
  const play = (buffer: AudioBuffer, clip: Clip) => {
    stop();
    const ctx = context();
    void ctx.resume();
    const n = ctx.createBufferSource();
    n.buffer = buffer;
    n.connect(ctx.destination);
    n.onended = () => { node.current = null; setPlaying(false); };
    n.start(0, clip.start, clip.end - clip.start);
    node.current = n;
    setPlaying(true);
  };
  useEffect(() => () => { if (node.current) { node.current.onended = null; node.current.stop(); } }, []);
  return { playing, play, stop };
}

const CANNOT_OPEN = 'This browser could not open the recording. Try Chrome.';

/** On an allowed recording that has a clip: hear just that part. */
export function ClipPlayer({ id, clip }: { id: string; clip: Clip }) {
  const { playing, play, stop } = usePlayer();
  const buffer = useRef<AudioBuffer | null>(null);
  const [failed, setFailed] = useState(false);
  const press = async () => {
    if (playing) return stop();
    try {
      buffer.current ??= await loadRecording(id);
      play(buffer.current, { start: clip.start, end: Math.min(clip.end, buffer.current.duration) });
    } catch {
      setFailed(true);
    }
  };
  return (
    <>
      <Button size="m" variant="outline" icon={playing ? 'pause' : 'play'} onClick={press}>{playing ? 'Stop' : 'Play the clip'}</Button>
      {failed && <p className="a-clip__note" role="alert">{CANNOT_OPEN}</p>}
    </>
  );
}

export interface ClipEditorProps {
  id: string;
  official: string;
  /** The clip already saved, when changing one. */
  clip: Clip | null;
  saveLabel: string;
  busy: boolean;
  /** null means the whole recording. */
  onSave: (clip: Clip | null) => void;
  onCancel: () => void;
}

export function ClipEditor({ id, official, clip, saveLabel, busy, onSave, onCancel }: ClipEditorProps) {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [failed, setFailed] = useState(false);
  const [start, setStart] = useState(clip?.start ?? 0);
  const [end, setEnd] = useState(clip?.end ?? 0);
  const [width, setWidth] = useState(0);
  const [theme, setTheme] = useState(0);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef<'start' | 'end' | null>(null);
  const { playing, play, stop } = usePlayer();

  useEffect(() => {
    let gone = false;
    loadRecording(id).then(b => {
      if (gone) return;
      const length = round(Math.floor(b.duration * 100) / 100);
      setBuffer(b);
      setEnd(e => (e > 0 ? Math.min(e, length) : length));
      setStart(s => clamp(s, 0, Math.max(0, length - MIN_SECONDS)));
    }).catch(() => { if (!gone) setFailed(true); });
    return () => { gone = true; };
  }, [id]);

  const length = buffer ? round(Math.floor(buffer.duration * 100) / 100) : 0;

  /* The loudest point in each sliver of the recording, with the loudest of all drawn full height. */
  const peaks = useMemo(() => {
    if (!buffer) return null;
    const data = buffer.getChannelData(0), per = Math.max(1, Math.floor(data.length / BARS)), out: number[] = [];
    for (let i = 0; i < BARS; i++) {
      let top = 0;
      for (let j = i * per, to = Math.min(data.length, j + per); j < to; j++) { const v = Math.abs(data[j]); if (v > top) top = v; }
      out.push(top);
    }
    const loudest = Math.max(...out) || 1;
    return out.map(v => v / loudest);
  }, [buffer]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const fit = () => setWidth(el.clientWidth);
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    const dark = window.matchMedia('(prefers-color-scheme: dark)'), repaint = () => setTheme(n => n + 1);
    dark.addEventListener('change', repaint);
    return () => { watch.disconnect(); dark.removeEventListener('change', repaint); };
  }, [buffer]);

  useEffect(() => {
    const el = canvas.current, g = el?.getContext('2d');
    if (!el || !g || !peaks || !width || !length) return;
    const ratio = window.devicePixelRatio || 1, style = getComputedStyle(el);
    el.width = width * ratio; el.height = HEIGHT * ratio;
    g.scale(ratio, ratio);
    g.clearRect(0, 0, width, HEIGHT);
    const x0 = (start / length) * width, x1 = (end / length) * width, bar = width / BARS;
    g.fillStyle = style.getPropertyValue('--surface-sunk').trim() || 'transparent';
    g.fillRect(x0, 0, x1 - x0, HEIGHT);
    g.fillStyle = style.color;
    peaks.forEach((p, i) => {
      const middle = (i + 0.5) * bar, tall = Math.max(2, p * (HEIGHT - 12));
      /* the parts that are cut away are drawn fainter */
      g.globalAlpha = middle >= x0 && middle <= x1 ? 1 : 0.5;
      g.fillRect(i * bar, (HEIGHT - tall) / 2, Math.max(1, bar - 1), tall);
    });
    g.globalAlpha = 1;
    g.fillRect(clamp(x0 - 1.5, 0, width - 3), 0, 3, HEIGHT);
    g.fillRect(clamp(x1 - 1.5, 0, width - 3), 0, 3, HEIGHT);
  }, [peaks, width, length, start, end, theme]);

  const moveStart = (t: number) => { stop(); setStart(round(clamp(t, 0, end - MIN_SECONDS))); };
  const moveEnd = (t: number) => { stop(); setEnd(round(clamp(t, start + MIN_SECONDS, length))); };

  const timeAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return clamp((e.clientX - box.left) / box.width, 0, 1) * length;
  };
  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    const t = timeAt(e);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = Math.abs(t - start) <= Math.abs(t - end) ? 'start' : 'end';
    (drag.current === 'start' ? moveStart : moveEnd)(t);
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    if (drag.current) (drag.current === 'start' ? moveStart : moveEnd)(timeAt(e));
  };

  if (failed) {
    return (
      <div className="a-form a-clip">
        <p role="alert">{CANNOT_OPEN}</p>
        <div className="a-actions"><Button size="m" variant="ghost" onClick={onCancel}>Cancel</Button></div>
      </div>
    );
  }
  if (!buffer) return <div className="a-form a-clip"><p role="status">Opening the recording.</p></div>;

  const whole = start <= 0.005 && end >= length - 0.005;
  return (
    <div className="a-form a-clip" role="group" aria-label={'Clip the recording of ' + official}>
      <p>Keep only the name. Drag the two lines, or use the sliders, then listen. The recording itself is not cut, so you can change the clip later.</p>
      <canvas ref={canvas} className="a-clip__wave" height={HEIGHT} aria-hidden="true"
        onPointerDown={down} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} />
      <label>
        <span>Starts at {start.toFixed(2)} seconds</span>
        <input type="range" min={0} max={length} step={0.01} value={start} aria-valuetext={start.toFixed(2) + ' seconds'} onChange={e => moveStart(Number(e.target.value))} />
      </label>
      <label>
        <span>Ends at {end.toFixed(2)} seconds</span>
        <input type="range" min={0} max={length} step={0.01} value={end} aria-valuetext={end.toFixed(2) + ' seconds'} onChange={e => moveEnd(Number(e.target.value))} />
      </label>
      {/* not read out on every nudge: each slider already says its own value */}
      <p className="a-clip__note">
        {whole ? `The whole recording, ${length.toFixed(2)} seconds.` : `The clip is ${(end - start).toFixed(2)} seconds long, out of ${length.toFixed(2)}.`}
      </p>
      <div className="a-actions">
        <Button size="m" variant="outline" icon={playing ? 'pause' : 'play'} onClick={() => (playing ? stop() : play(buffer, { start, end }))}>{playing ? 'Stop' : 'Play the clip'}</Button>
        <Button size="m" disabled={busy} onClick={() => { stop(); onSave(whole ? null : { start, end }); }}>{saveLabel}</Button>
        <Button size="m" variant="ghost" onClick={() => { stop(); onCancel(); }}>Cancel</Button>
      </div>
    </div>
  );
}
