import React from 'react';
import { useReducedMotion } from '../core/motion.js';
/* Bottom sheet with two snap points. Drag the handle (or anywhere when collapsed), tap the handle, or use Escape. */
export function Sheet({ snap = 'peek', onSnap, peek = 280, top = 56, height = 844, bg = 'var(--surface-raised)', ink = 'var(--text)', label, children, style }) {
  const reduce = useReducedMotion();
  const box = React.useRef(null), d = React.useRef(null);
  const [dy, setDy] = React.useState(0);
  const H = height - top, base = snap === 'full' ? 0 : H - peek;
  const start = e => {
    const sc = box.current.querySelector('[data-sheet-scroll]');
    if (snap === 'full' && sc && sc.scrollTop > 0 && !e.target.closest('[data-sheet-handle]')) return;
    if (e.target.closest('button,a,input') && !e.target.closest('[data-sheet-handle]')) return;
    d.current = { y: e.clientY, t: performance.now() }; e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = e => { if (d.current) setDy(Math.max(-base, e.clientY - d.current.y)); };
  const end = e => {
    if (!d.current) return; const m = e.clientY - d.current.y, v = m / Math.max(1, performance.now() - d.current.t); d.current = null; setDy(0);
    if (Math.abs(m) < 6) return;
    if (snap !== 'full' && (m < -48 || v < -0.4)) onSnap('full');
    else if (snap === 'full' && (m > 72 || v > 0.5)) onSnap('peek');
    else if (snap !== 'full' && (m > 64 || v > 0.5)) onSnap('closed');
  };
  return (
    <section ref={box} role="dialog" aria-modal="false" aria-label={label} onKeyDown={e => { if (e.key === 'Escape') onSnap('closed'); }}
      onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
      style={{ position: 'absolute', left: 0, right: 0, top, height: H, zIndex: 'var(--z-sheet)', transform: `translateY(${base + dy}px)`,
        transition: dy ? 'none' : (reduce ? 'none' : 'transform var(--dur-sheet) var(--ease-standard)'), background: bg, color: ink,
        borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0', boxShadow: 'var(--shadow-sheet)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', touchAction: 'none', ...style }}>
      <button type="button" data-sheet-handle="1" aria-expanded={snap === 'full'} aria-label={snap === 'full' ? 'Show less' : 'Show more'} onClick={() => onSnap(snap === 'full' ? 'peek' : 'full')}
        style={{ height: 28, border: 0, background: 'transparent', color: 'inherit', display: 'grid', placeItems: 'center', cursor: 'grab', borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0' }}>
        <span aria-hidden="true" style={{ width: 40, height: 5, borderRadius: 3, background: 'currentColor' }}></span>
      </button>
      <div data-sheet-scroll="1" style={{ overflowY: snap === 'full' ? 'auto' : 'hidden', touchAction: snap === 'full' ? 'pan-y' : 'none', overscrollBehavior: 'contain' }}>{children}</div>
    </section>
  );
}
