/* Month picker for the Feasts and zatras view (design/components/layers/MonthSlider.jsx): one large slider.
   Drag along it, tap a month, or use the arrow keys, Home and End. A dot under a month means something falls in it. */
import { useRef } from 'react';
import { MONTHS } from '../../lib/layers';
import './layers.css';

const places = (n: number) => `${n} ${n === 1 ? 'place' : 'places'}`;

export function MonthSlider({ value, onChange, counts }: { value: number; onChange: (m: number) => void; counts: number[] }) {
  const ref = useRef<HTMLDivElement>(null), drag = useRef(false);
  const at = (x: number) => { const r = ref.current!.getBoundingClientRect(); return Math.max(1, Math.min(12, Math.floor((x - r.left) / r.width * 12) + 1)); };
  const set = (m: number) => { if (m !== value) onChange(m); };
  const key = (e: React.KeyboardEvent) => {
    const d = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[e.key];
    if (d) { e.preventDefault(); set(((value - 1 + d + 12) % 12) + 1); }
    else if (e.key === 'Home') { e.preventDefault(); set(1); }
    else if (e.key === 'End') { e.preventDefault(); set(12); }
  };
  const n = counts[value - 1] ?? 0;
  return (
    <div className="k-month">
      <div className="k-month__top"><span className="k-month__name">{MONTHS[value - 1]}</span><span className="k-month__count" aria-hidden="true">{places(n)}</span></div>
      <div ref={ref} className="k-month__track" role="slider" tabIndex={0} aria-label="Month" aria-valuemin={1} aria-valuemax={12} aria-valuenow={value}
        aria-valuetext={`${MONTHS[value - 1]}, ${places(n)}`} onKeyDown={key}
        onPointerDown={e => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(at(e.clientX)); }}
        onPointerMove={e => { if (drag.current) set(at(e.clientX)); }} onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}>
        {MONTHS.map((m, i) => (
          <span key={m} aria-hidden="true" className={i + 1 === value ? 'k-month__m is-on' : 'k-month__m'}>
            <span>{m[0]}</span><span className="k-month__dot" style={{ visibility: counts[i] ? 'visible' : 'hidden' }} />
          </span>
        ))}
      </div>
    </div>
  );
}
