import { useRef, type KeyboardEvent } from 'react';
import type { Script } from '../../data/types';
import './core.css';

const OPTIONS: { value: Script; label: string; deva?: boolean }[] = [
  { value: 'official', label: 'Official' },
  { value: 'deva', label: 'देवनागरी', deva: true },
  { value: 'romi', label: 'Romi' }
];

export interface ScriptToggleProps {
  value: Script;
  onChange: (value: Script) => void;
}

/** Chooses which form of every name the map, strips and search show. A radio group: arrow keys move the choice. */
export function ScriptToggle({ value, onChange }: ScriptToggleProps) {
  const i = Math.max(0, OPTIONS.findIndex(o => o.value === value));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + OPTIONS.length) % OPTIONS.length;
    onChange(OPTIONS[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div className="k-script-toggle" role="radiogroup" aria-label="Names on the map" data-index={i} onKeyDown={onKeyDown}>
      <span className="k-script-toggle__thumb" aria-hidden="true" />
      {OPTIONS.map((o, n) => (
        <button
          key={o.value}
          ref={el => { refs.current[n] = el; }}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          lang={o.deva ? 'gom' : undefined}
          className={o.deva ? 'k-script-toggle__option k-script-toggle__option--deva' : 'k-script-toggle__option'}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
