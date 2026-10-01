import { useEffect, useState } from 'react';

/** True when a CSS media query matches. Updates live. */
export function useMediaQuery(query: string): boolean {
  const [matches, set] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const q = window.matchMedia(query);
    const f = () => set(q.matches);
    f();
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, [query]);
  return matches;
}

/** True when the person asked their phone or computer for less motion. Check it before any transform animation. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
