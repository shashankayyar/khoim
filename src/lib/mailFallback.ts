import { useEffect, useState } from 'react';

/** Every "Tell us" and "Write to us" opens the person's mail app. On a computer with no mail app set up,
    nothing happens. This watches for that: if an email link is pressed and the page is still in front a
    moment later, it returns true for a while so the app can show the address to write to. */
export function useMailFallback(): boolean {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let wait = 0, hide = 0, left = false;
    const away = () => { left = true; };
    const hidden = () => { if (document.visibilityState === 'hidden') left = true; };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="mailto:"]');
      if (!link) return;
      left = false;
      window.clearTimeout(wait);
      wait = window.setTimeout(() => {
        if (left) return;
        setShow(true);
        window.clearTimeout(hide);
        hide = window.setTimeout(() => setShow(false), 12000);
      }, 1200);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('blur', away);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.clearTimeout(wait); window.clearTimeout(hide);
      document.removeEventListener('click', onClick);
      window.removeEventListener('blur', away);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);
  return show;
}
