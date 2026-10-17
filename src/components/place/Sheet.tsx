/* Bottom sheet with two snap points. Drag it (or tap the handle), or press Escape to close.
   It follows the finger 1:1; on release, distance or flick speed decides where it lands.
   Ported from design/components/place/Sheet.jsx. Phase 2: the handle row (44px) shows the current place's name on
   the left, the grip in the middle and "More" / "Less" on the right, so it is clear there is more to pull up. */
import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import type { HouseKey } from '../../data/types';
import { useReducedMotion } from '../../lib/motion';
import './place.css';

/** Height of the handle strip at the top of the sheet: 28px, or 44px with a title. */
const HANDLE = 28, TITLED = 44;

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
  /** The name shown in the handle row (phase 2). */
  title?: ReactNode;
  /** The most of the screen the sheet may take, open or not, as a share of its height (phase 3: 0.4, so the map
      keeps 60%). Opened, it stops there and its content scrolls. */
  maxShare?: number;
  children: ReactNode;
}

export function Sheet({ label, snap = 'peek', onSnap, peek = 280, onMeasure, house, expandable = true, title, maxShare, children }: SheetProps) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLElement>(null);
  const d = useRef<{ y: number; t: number; base: number } | null>(null);
  const [dy, setDy] = useState(0);
  const full = snap === 'full';

  /* Measure only while collapsed: the names are set larger when the card is open. */
  useLayoutEffect(() => {
    const mark = box.current?.querySelector<HTMLElement>('[data-sheet-peek]');
    if (!mark || !onMeasure || full) return;
    const report = () => onMeasure((title ? TITLED : HANDLE) + mark.offsetHeight + 16);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(mark);
    return () => ro.disconnect();
  }, [full, onMeasure, title]);

  const start = (e: PointerEvent<HTMLElement>) => {
    const el = box.current;
    if (!el) return;
    const target = e.target as Element;
    const onHandle = !!target.closest('[data-sheet-handle]');
    const scroller = el.querySelector('[data-sheet-scroll]');
    if ((full || maxShare) && scroller && scroller.scrollTop > 0 && !onHandle) return;
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
        ...(maxShare ? { top: 'auto', height: `${maxShare * 100}dvh` } : null),
        transform: full ? `translateY(${dy}px)` : `translateY(calc(100% - ${peek}px + ${dy}px))`,
        transition: dy || reduce ? 'none' : undefined
      }}>
      {expandable ? (
        <button type="button" className={title ? 'k-sheet__handle k-sheet__handle--titled' : 'k-sheet__handle'} data-sheet-handle="1" aria-expanded={full} aria-label={(full ? 'Show less' : 'Show more') + ': ' + label} onClick={() => onSnap(full ? 'peek' : 'full')}>
          {title && <span className="k-sheet__title" aria-hidden="true">{title}</span>}
          <span className="k-sheet__grip" aria-hidden="true" />
          {/* TODO(copy): "More" / "Less" are the design's */}
          {title && <span className="k-sheet__more" aria-hidden="true">{full ? 'Less' : 'More'}</span>}
        </button>
      ) : (
        <div className={title ? 'k-sheet__handle k-sheet__handle--titled' : 'k-sheet__handle'} data-sheet-handle="1">
          {title && <span className="k-sheet__title">{title}</span>}
          <span className="k-sheet__grip" aria-hidden="true" />
          {title && <span aria-hidden="true" />}
        </div>
      )}
      {/* a sheet held to a share of the screen scrolls whenever its content is taller, peeking or not */}
      <div className={full || maxShare ? 'k-sheet__scroll is-full' : 'k-sheet__scroll'} data-sheet-scroll="1">{children}</div>
    </section>
  );
}
