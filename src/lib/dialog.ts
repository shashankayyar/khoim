import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

/** For a screen that covers the app (About, search): moves the keyboard focus onto it when it opens (give the
    element tabIndex={-1}), or onto focusFirst if given; keeps Tab inside it; closes on Escape; and hands the
    focus back to where it was when it closes. */
export function useDialog(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void, focusFirst?: RefObject<HTMLElement | null>) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const before = document.activeElement as HTMLElement | null;
    /* wait for the slide-in to start, or the browser scrolls the moving screen into view */
    const t = window.setTimeout(() => (focusFirst?.current ?? el).focus({ preventScroll: true }), 320);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close.current(); return; }
      if (e.key !== 'Tab') return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(i => i.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    el.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      el.removeEventListener('keydown', onKey);
      if (before && document.contains(before)) before.focus({ preventScroll: true });
    };
  }, [open, ref, focusFirst]);
}
