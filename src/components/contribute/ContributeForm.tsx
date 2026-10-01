/* The form people use to tell Khoim something about a place. It slides up over the map, like About.

   What can be sent follows the roadmap. The three things under the Names layer are open. The layers that are
   not live yet are listed too, marked "Next" or "Planned", so people can see what is coming; they cannot be
   picked. The same list (LAYERS in src/data/khoim.ts) drives the Layers screen, so the two always agree.

   Field wording, the thank-you and the error are from docs/copy.md. The consent wording is section 5a of
   docs/collaboration-plan.md. */
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import { LAYERS, whereLabel } from '../../data/khoim';
import { CONTACT_EMAIL } from '../../data/site';
import type { Place } from '../../data/types';
import { loadTurnstile, sendContribution, type ContributionKind } from '../../lib/contribute';
import { useDialog } from '../../lib/dialog';
import { Button } from '../core/Button';
import { Icon } from '../core/Icon';
import { IconButton } from '../core/IconButton';
import './contribute.css';

const OPEN: { kind: ContributionKind; label: string }[] = [
  { kind: 'name', label: 'The Konkani name or spelling' },
  { kind: 'say', label: 'How the name is said' },
  { kind: 'correction', label: 'A correction' }
];
const COMING = LAYERS.filter(l => l.status !== 'live');

export interface ContributeFormProps {
  /** The place the form is about. Null when the form is closed. */
  place: Place | null;
  /** Which choice is ticked when it opens. */
  kind: ContributionKind;
  siteKey: string | null;
  onClose: () => void;
}

export function ContributeForm({ place, kind: firstKind, siteKey, onClose }: ContributeFormProps) {
  const open = !!place;
  const ref = useRef<HTMLDivElement>(null), check = useRef<HTMLDivElement>(null), widget = useRef<string | null>(null);
  const id = useId();
  const [kind, setKind] = useState<ContributionKind>(firstKind);
  const [value, setValue] = useState(''), [how, setHow] = useState(''), [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [token, setToken] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  useDialog(ref, open, onClose);

  /* A fresh form each time it opens for a place. The person's name is kept, to save typing it again. */
  const placeId = place?.id;
  useEffect(() => {
    if (!placeId) return;
    setKind(firstKind); setValue(''); setHow(''); setAgree(false); setState('idle');
  }, [placeId, firstKind]);

  /* The bot check appears while the form is open and the person has not sent it yet. */
  const showCheck = open && state !== 'sent' && !!siteKey;
  useEffect(() => {
    if (!showCheck) return;
    let live = true;
    setToken('');
    loadTurnstile().then(t => {
      if (!live || !check.current) return;
      widget.current = t.render(check.current, {
        sitekey: siteKey,
        theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
        size: 'flexible',
        callback: (tk: string) => setToken(tk),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken('')
      });
    }).catch(() => { /* the Send button stays unavailable; the email address below the form still works */ });
    return () => {
      live = false;
      if (widget.current) { window.turnstile?.remove(widget.current); widget.current = null; }
    };
  }, [showCheck, siteKey]);

  const canSend = !!token && state !== 'sending';
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!place || !canSend) return;
    setState('sending');
    const ok = await sendContribution({ placeId: place.id, kind, value, how, name, consent: agree, token });
    setState(ok ? 'sent' : 'failed');
    /* a bot-check pass can be used once; get a new one for the next try */
    if (!ok && widget.current) { setToken(''); window.turnstile?.reset(widget.current); }
  };

  return (
    <div ref={ref} className={open ? 'k-form-screen is-open' : 'k-form-screen'} role="dialog" aria-modal="true" aria-hidden={!open} tabIndex={-1}
      aria-label={place ? 'Tell us about ' + place.official : 'Tell us'}>
      <div className="k-form-screen__scroll">
        {place && (
          <div className="k-form">
            <div className="k-form__top">
              <div>
                <p className="k-form__eyebrow">Tell us about</p>
                <h1 className="k-form__place">{place.official}</h1>
                <p className="k-form__where">{whereLabel(place)}</p>
              </div>
              <IconButton icon="x" label="Close" onClick={onClose} />
            </div>

            {state === 'sent' ? (
              <div className="k-form__done" role="status">
                <p>Got it, thanks. Someone who reads Konkani will check this before we change anything. We'll credit you if you left your name.</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <fieldset className="k-form__kinds">
                  <legend>What are you adding?</legend>
                  {OPEN.map(o => (
                    <label key={o.kind} className={kind === o.kind ? 'k-kind is-on' : 'k-kind'}>
                      <input type="radio" name={id + 'kind'} value={o.kind} checked={kind === o.kind} onChange={() => setKind(o.kind)} />
                      <span className="k-kind__mark" aria-hidden="true" />
                      <span className="k-kind__label">{o.label}</span>
                    </label>
                  ))}
                  {/* not open yet: shown so people know they are coming, in the same dashed style as the Layers list */}
                  <ul className="k-form__coming" aria-label="Not open yet">
                    {COMING.map(l => (
                      <li key={l.id} className="k-kind k-kind--coming">
                        <span className="k-kind__icon" aria-hidden="true"><Icon name={l.icon} size={20} /></span>
                        <span className="k-kind__label">{l.label}</span>
                        <span className="k-kind__status">{l.status === 'next' ? 'Next' : 'Planned'}</span>
                      </li>
                    ))}
                  </ul>
                </fieldset>

                <div className="k-field">
                  <label htmlFor={id + 'value'}>What should it be?</label>
                  <div className="k-field__box" data-khoim-field="1">
                    <input id={id + 'value'} type="text" required maxLength={200} autoComplete="off" autoCapitalize="off" spellCheck={false} value={value} onChange={e => setValue(e.target.value)} />
                  </div>
                </div>
                <div className="k-field">
                  <label htmlFor={id + 'how'}>How do you know?</label>
                  <p className="k-field__hint" id={id + 'howhint'}>For example: my family is from here</p>
                  <div className="k-field__box k-field__box--tall" data-khoim-field="1">
                    <textarea id={id + 'how'} required maxLength={500} rows={3} aria-describedby={id + 'howhint'} value={how} onChange={e => setHow(e.target.value)} />
                  </div>
                </div>
                <div className="k-field">
                  <label htmlFor={id + 'name'}>Your name, for credit (optional)</label>
                  <div className="k-field__box" data-khoim-field="1">
                    <input id={id + 'name'} type="text" maxLength={80} autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                </div>

                <div className="k-form__consent">
                  <p>By sending this you confirm that you are 18 or older, that this is your own knowledge, and that it is not copied from a book or website that does not allow copying.</p>
                  <p>A Konkani speaker will check it before anything changes on the map. If it is used, Khoim will publish it under the Creative Commons Attribution licence (CC BY 4.0), so that anyone can reuse it with credit. If you give your name, we will credit you next to it.</p>
                  <p>You can ask us to correct or remove your contribution at any time: write to <strong>{CONTACT_EMAIL}</strong>.</p>
                  <label className="k-form__agree">
                    <input type="checkbox" required checked={agree} onChange={e => setAgree(e.target.checked)} />
                    <span>I agree.</span>
                  </label>
                  <p><a href="/privacy/" target="_blank" rel="noopener">Privacy notice<span className="k-visually-hidden"> (opens in a new tab)</span></a></p>
                </div>

                <div ref={check} className="k-form__check" />
                {state === 'failed' && <p className="k-form__error" role="alert">That didn't send. Your text is still here, so please try again.</p>}
                <Button type="submit" full disabled={!canSend}>Send</Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
