import { useId, type Ref } from 'react';
import { Icon } from '../core/Icon';
import './search.css';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Shows a "Cancel" button beside the field. */
  onCancel?: () => void;
  inputRef?: Ref<HTMLInputElement>;
}

/** 56px search field. Type a name in any script. */
export function SearchField({ value, onChange, onCancel, inputRef }: SearchFieldProps) {
  const id = useId();
  return (
    <div className={onCancel ? 'k-search-field k-search-field--cancel' : 'k-search-field'} role="search">
      <label className="k-visually-hidden" htmlFor={id}>Search any name, in any script</label>
      <div className="k-search-field__box" data-khoim-field="1">
        <Icon name="search" size={20} />
        <input id={id} ref={inputRef} className="k-search-field__input" type="search" enterKeyHint="search" autoComplete="off" autoCapitalize="off" spellCheck={false}
          value={value} placeholder="Canacona, काणकोण, Kannkonn" onChange={e => onChange(e.target.value)} />
      </div>
      {onCancel && <button type="button" className="k-search-field__cancel" onClick={onCancel}>Cancel</button>}
    </div>
  );
}
