import React from 'react';
/* true when the user asked the OS for less motion. Components must check it before any transform animation. */
export function useReducedMotion() {
  const q = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const [r, set] = React.useState(q ? q.matches : false);
  React.useEffect(() => { if (!q) return; const f = e => set(e.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, []);
  return r;
}
export function usePress() {
  const [p, set] = React.useState(false);
  return [p, { onPointerDown: () => set(true), onPointerUp: () => set(false), onPointerLeave: () => set(false), onPointerCancel: () => set(false) }];
}
