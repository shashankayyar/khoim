/* Bottom sheet with two snap points. Drag it (or tap the handle), or press Escape to close.
   It follows the finger 1:1; on release, distance or flick speed decides where it lands.
   Ported from design/components/place/Sheet.jsx. */
import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import type { HouseKey } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import './place.css';

/** Height of the handle strip at the top of the sheet. */
const HANDLE = 28;

export interface SheetProps {
  /** Read by screen readers as the name of this panel. */
  label: string;
  snap?: 'peek' | 'full';
  onSnap: (snap: 'peek' | 'full' | 'closed') => void;
  /** px of the sheet that shows when collapsed. */
  peek?: number;
  /** Called with the height the collapsed sheet needs to show everything inside the element marked
      data-sheet-peek (names wrap differently on different phones). Feed it back in as `peek`. */
  onMeasure?: (px: number) => void;
  /** Paints the sheet in a house colour. Without it the sheet is white. */
  house?: HouseKey;
  /** False for sheets that only peek (the strip): the handle is then a grip, not a button. */
  expandable?: boolean;
  children: ReactNode;
}

export function Sheet({ label, snap = 'peek', onSnap, peek = 280, onMeasure, house, expandable = true, children }: SheetProps) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLElement>(null);
  const d = useRef<{ y: number; t: number; base: number } | null>(null);
  const [dy, setDy] = useState(0);
  const full = snap === 'full';

  /* Measure only while collapsed: the names are set larger when the card is open. */
  useLayoutEffect(() => {
    const mark = box.current?.querySelector<HTMLElement>('[data-sheet-peek]');
    if (!mark || !onMeasure || full) return;
    const report = () => onMeasure(HANDLE + mark.offsetHeight + 16);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(mark);
    return () => ro.disconnect();
  }, [full, onMeasure]);

  const start = (e: PointerEvent<HTMLElement>) => {
    const el = box.current;
    if (!el) return;
    const target = e.target as Element;
    const onHandle = !!target.closest('[data-sheet-handle]');
    const scroller = el.querySelector('[data-sheet-scroll]');
    if (full && scroller && scroller.scrollTop > 0 && !onHandle) return;
    if (target.closest('button,a,input') && !onHandle) return;
    d.current = { y: e.clientY, t: performance.now(), base: full ? 0 : el.offsetHeight - peek };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    if (d.current) setDy(Math.max(-d.current.base, e.clientY - d.current.y));
  };
  const end = (e: PointerEvent<HTMLElement>) => {
    if (!d.current) return;
    const m = e.clientY - d.current.y, v = m / Math.max(1, performance.now() - d.current.t);
    d.current = null;
    setDy(0);
    if (Math.abs(m) < 6) return;
    if (!full && expandable && (m < -48 || v < -0.4)) onSnap('full');
    else if (full && (m > 72 || v > 0.5)) onSnap('peek');
    else if (!full && (m > 64 || v > 0.5)) onSnap('closed');
  };

  return (
    <section ref={box} className={'k-sheet' + (house ? ' k-sheet--house' : '')} data-house={house} role="dialog" aria-modal="false" aria-label={label}
      onKeyDown={e => { if (e.key === 'Escape') onSnap('closed'); }}
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
      style={{
        transform: full ? `translateY(${dy}px)` : `translateY(calc(100% - ${peek}px + ${dy}px))`,
        transition: dy || reduce ? 'none' : undefined
      }}>
      {expandable ? (
        <button type="button" className="k-sheet__handle" data-sheet-handle="1" aria-expanded={full} aria-label={full ? 'Show less' : 'Show more'} onClick={() => onSnap(full ? 'peek' : 'full')}>
          <span className="k-sheet__grip" aria-hidden="true" />
        </button>
      ) : (
        <div className="k-sheet__handle" data-sheet-handle="1" aria-hidden="true"><span className="k-sheet__grip" /></div>
      )}
      <div className={full ? 'k-sheet__scroll is-full' : 'k-sheet__scroll'} data-sheet-scroll="1">{children}</div>
    </section>
  );
}
