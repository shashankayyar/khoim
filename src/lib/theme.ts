import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';
const KEY = 'khoim-theme';

const current = (): Theme => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** Light or dark. Follows the phone or computer setting until the person picks one; the pick is remembered. */
export function useTheme(): [Theme, () => void] {
  const [theme, set] = useState<Theme>(current);
  /* the page's own script switches the theme when the device setting changes; keep the button in step */
  useEffect(() => {
    const watch = new MutationObserver(() => set(current()));
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => watch.disconnect();
  }, []);
  const toggle = () => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.dataset.theme = 'dark'; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(KEY, next); } catch { /* private mode: the choice lasts for this visit */ }
  };
  return [theme, toggle];
}
