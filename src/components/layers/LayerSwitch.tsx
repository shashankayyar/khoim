import { LAYERS } from '../../data/khoim';
import { Icon } from '../core/Icon';
import './layers.css';

export interface LayerSwitchProps {
  value: string;
  onChange: (id: string) => void;
}

/** The layers Khoim will grow into. Only live layers can be switched on; the rest say when they are coming. */
export function LayerSwitch({ value, onChange }: LayerSwitchProps) {
  return (
    <ul className="k-layers" role="list">
      {LAYERS.map(l => {
        const live = l.status === 'live', on = value === l.id;
        return (
          <li key={l.id}>
            <button type="button" className={'k-layer' + (live ? '' : ' k-layer--coming') + (on ? ' is-on' : '')}
              aria-pressed={live ? on : undefined} aria-disabled={!live || undefined} onClick={() => { if (live) onChange(l.id); }}>
              <span className="k-layer__icon" aria-hidden="true"><Icon name={l.icon} size={20} /></span>
              <span className="k-layer__text"><span className="k-layer__label">{l.label}</span><span className="k-layer__note">{l.note}</span></span>
              <span className="k-layer__status">{live ? (on ? 'On' : 'Off') : l.status === 'next' ? 'Next' : 'Planned'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
