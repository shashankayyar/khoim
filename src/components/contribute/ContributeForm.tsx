/* The form people use to tell Khoim something about a place. It slides up over the map, like About.

   What can be sent follows the roadmap (LAYERS in src/data/khoim.ts). The three things under the Names layer
   come first. Under them are the layers that are not on the map yet: since 1 October 2026 these can be sent
   too (Shashank's decision), so that there is something to show when each layer opens. What is sent for them
   is checked and kept; nothing appears on the map until the layer is built.

   Field wording for names, the thank-you and the "didn't send" error are from docs/copy.md. The consent
   wording is sections 5a and 5b of docs/collaboration-plan.md.

   The form checks itself and says what is missing in words, next to the box. (The browser's own "fill this in"
   bubble did not show on this screen, so a missed box looked like nothing had happened.) */
import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import { LAYERS, whereLabel } from '../../data/khoim';
import { CONTACT_EMAIL } from '../../data/site';
import type { Place } from '../../data/types';
import { loadTurnstile, sendContribution, type ContributionKind, type Recorded } from '../../lib/contribute';
import { useDialog } from '../../lib/dialog';
import { Button } from '../core/Button';
import { Icon } from '../core/Icon';
import { IconButton } from '../core/IconButton';
import type { IconName } from '../core/iconPaths';
import { VoiceRecorder } from './VoiceRecorder';
import './contribute.css';

const NAMES: { kind: ContributionKind; label: string }[] = [
  { kind: 'name', label: 'The Konkani name or spelling' },
  { kind: 'say', label: 'How the name is said' },
  { kind: 'correction', label: 'A correction' }
];

/* From here to ADD_ANOTHER: wording for the layers that are not on the map yet. In docs/copy.md (confirmed by
   Shashank, 1 October 2026). The examples are taken from the layer notes in LAYERS. */
const LAYER_CHOICE: Record<string, { kind: ContributionKind; label: string }> = {
  voices: { kind: 'voice', label: 'A recording of the name' },
  crops: { kind: 'crops', label: 'A crop grown here' },
  food: { kind: 'food', label: 'A dish from here' },
  music: { kind: 'music', label: 'Music or dance from here' },
  landmarks: { kind: 'landmarks', label: 'A landmark, and what people call it' }
};
const COMING: { kind: ContributionKind; label: string; icon: IconName }[] =
  LAYERS.filter(l => l.status !== 'live' && LAYER_CHOICE[l.id]).map(l => ({ ...LAYER_CHOICE[l.id], icon: l.icon }));
const COMING_NOTE = 'Not on the map yet. What you send now is checked and kept for when each one opens.';

interface Asks { value: string; valueHint?: string; how: string; howHint: string }
const ASK_NAME: Asks = { value: 'What should it be?', how: 'How do you know?', howHint: 'For example: my family is from here' };
const ASKS: Record<ContributionKind, Asks> = {
  name: ASK_NAME, say: ASK_NAME, correction: ASK_NAME,
  voice: { value: '', how: 'Which village or town are you from?', howHint: 'It is shown with your recording' },
  crops: { value: 'What is grown here?', valueHint: 'For example: khazan paddy, cashew, coconut, areca', how: ASK_NAME.how, howHint: ASK_NAME.howHint },
  food: { value: 'What is the dish?', valueHint: 'Its Konkani name if you know it, and the village or feast it belongs to', how: ASK_NAME.how, howHint: ASK_NAME.howHint },
  music: { value: 'What is sung or danced here?', valueHint: 'For example: mando, dulpod, deknni, fugdi', how: ASK_NAME.how, howHint: ASK_NAME.howHint },
  landmarks: { value: 'What is the landmark, and what do people nearby call it?', valueHint: 'For example: a temple, church, mosque or spring', how: ASK_NAME.how, howHint: ASK_NAME.howHint }
};
const MISSING_RECORDING = 'Please record the name first.';
/* Several things can be sent at once: each box becomes its own item for the reviewer. One recording at a time. */
const MAX_VALUES = 6;
const ADD_ANOTHER = 'Add another';

/* Confirmed wording, in docs/copy.md. */
const NEEDED_NOTE = 'The first two answers are needed. Your name is optional.';
const MISSING = {
  value: 'Please fill this in.',
  how: 'Please fill this in. A few words are enough.',
  agree: 'Please tick the box if you agree.'
};
type Missing = Partial<Record<keyof typeof MISSING, boolean>>;

function FieldError({ id, text }: { id: string; text: string }) {
  return <p className="k-field__error" id={id}><Icon name="info" size={20} /><span>{text}</span></p>;
}

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
  const [values, setValues] = useState<string[]>(['']), [how, setHow] = useState(''), [name, setName] = useState('');
  const [recording, setRecording] = useState<Recorded | null>(null);
  const [agree, setAgree] = useState(false);
  const [token, setToken] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [missing, setMissing] = useState<Missing>({});
  useDialog(ref, open, onClose);

  /* A fresh form each time it opens for a place. The person's name is kept, to save typing it again. */
  const placeId = place?.id;
  useEffect(() => {
    if (!placeId) return;
    setKind(firstKind); setValues(['']); setHow(''); setRecording(null); setAgree(false); setState('idle'); setMissing({});
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
    }).catch(() => { /* the Send button stays unavailable; the email address in the consent box still works */ });
    return () => {
      live = false;
      if (widget.current) { window.turnstile?.remove(widget.current); widget.current = null; }
    };
  }, [showCheck, siteKey]);

  const voice = kind === 'voice';
  const asks = ASKS[kind];
  const pick = (k: ContributionKind) => { setKind(k); setMissing({}); };
  const typed = values.map(v => v.trim()).filter(Boolean);
  const valueId = (i: number) => id + 'value' + (i || '');
  const setValueAt = (i: number, v: string) => { setValues(vs => vs.map((old, j) => (j === i ? v : old))); setMissing(m => ({ ...m, value: false })); };
  const addValue = () => {
    setValues(vs => [...vs, '']);
    /* the cursor goes to the new box once it is on the page */
    const next = values.length;
    window.setTimeout(() => document.getElementById(valueId(next))?.focus(), 0);
  };
  const removeValue = (i: number) => {
    setValues(vs => vs.filter((_, j) => j !== i));
    window.setTimeout(() => document.getElementById(valueId(Math.max(0, i - 1)))?.focus(), 0);
  };

  const canSend = !!token && state !== 'sending';
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!place) return;
    /* say what is missing, and put the cursor in the first box that needs filling */
    const gaps: Missing = { value: voice ? !recording : !typed.length, how: !how.trim(), agree: !agree };
    setMissing(gaps);
    const first = gaps.value ? (voice ? 'record' : 'value') : gaps.how ? 'how' : gaps.agree ? 'agree' : null;
    if (first) { document.getElementById(id + first)?.focus(); return; }
    if (!canSend) return;
    setState('sending');
    const ok = await sendContribution({ placeId: place.id, kind, values: voice ? [] : typed, how, name, consent: agree, token, recording: voice ? recording : null });
    setState(ok ? 'sent' : 'failed');
    /* a bot-check pass can be used once; get a new one for the next try */
    if (!ok && widget.current) { setToken(''); window.turnstile?.reset(widget.current); }
  };

  const choice = (o: { kind: ContributionKind; label: string; icon?: IconName }) => (
    <label key={o.kind} className={kind === o.kind ? 'k-kind is-on' : 'k-kind'}>
      <input type="radio" name={id + 'kind'} value={o.kind} checked={kind === o.kind} onChange={() => pick(o.kind)} />
      <span className="k-kind__mark" aria-hidden="true" />
      <span className="k-kind__label">{o.label}</span>
      {o.icon && <span className="k-kind__icon" aria-hidden="true"><Icon name={o.icon} size={20} /></span>}
    </label>
  );

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
              <form onSubmit={submit} noValidate>
                <fieldset className="k-form__kinds">
                  <legend>What are you adding?</legend>
                  {NAMES.map(choice)}
                  {COMING.length > 0 && <p className="k-form__coming-note">{COMING_NOTE}</p>}
                  {COMING.map(choice)}
                </fieldset>

                <p className="k-form__needed">{NEEDED_NOTE}</p>

                {voice ? (
                  <div className="k-field">
                    <VoiceRecorder id={id + 'record'} official={place.official} recording={recording}
                      onChange={r => { setRecording(r); setMissing(m => ({ ...m, value: false })); }} />
                    {missing.value && <p className="k-field__error" role="alert"><Icon name="info" size={20} /><span>{MISSING_RECORDING}</span></p>}
                  </div>
                ) : (
                  <div className="k-field">
                    <label htmlFor={id + 'value'}>{asks.value}</label>
                    {asks.valueHint && <p className="k-field__hint" id={id + 'valuehint'}>{asks.valueHint}</p>}
                    <div className="k-field__many">
                      {values.map((v, i) => (
                        <div key={i} className="k-field__one">
                          <div className="k-field__box" data-khoim-field="1">
                            <input id={valueId(i)} type="text" aria-required={i === 0 ? 'true' : undefined} aria-invalid={(i === 0 && missing.value) || undefined}
                              aria-label={i > 0 ? `${asks.value} Number ${i + 1}` : undefined}
                              aria-describedby={i === 0 ? [asks.valueHint && id + 'valuehint', missing.value && id + 'valueerr'].filter(Boolean).join(' ') || undefined : undefined}
                              maxLength={200} autoComplete="off" autoCapitalize="off" spellCheck={false} value={v}
                              onChange={e => setValueAt(i, e.target.value)} />
                          </div>
                          {i > 0 && <IconButton icon="x" label={`Remove number ${i + 1}`} onClick={() => removeValue(i)} />}
                        </div>
                      ))}
                    </div>
                    {missing.value && <FieldError id={id + 'valueerr'} text={MISSING.value} />}
                    {values.length < MAX_VALUES && (
                      <div className="k-field__add"><Button variant="ghost" size="m" onClick={addValue}>{ADD_ANOTHER}</Button></div>
                    )}
                  </div>
                )}
                <div className="k-field">
                  <label htmlFor={id + 'how'}>{asks.how}</label>
                  <p className="k-field__hint" id={id + 'howhint'}>{asks.howHint}</p>
                  <div className="k-field__box k-field__box--tall" data-khoim-field="1">
                    <textarea id={id + 'how'} aria-required="true" aria-invalid={missing.how || undefined} aria-describedby={id + 'howhint' + (missing.how ? ' ' + id + 'howerr' : '')}
                      maxLength={500} rows={voice ? 2 : 3} value={how}
                      onChange={e => { setHow(e.target.value); setMissing(m => ({ ...m, how: false })); }} />
                  </div>
                  {missing.how && <FieldError id={id + 'howerr'} text={MISSING.how} />}
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
                  {voice && (
                    <>
                      <p>Your voice is personal information. If your recording is approved, it will be played on khoim.in to anyone who visits, with your name and village if you gave them, or as "a speaker from" your village if you did not.</p>
                      <p>It will be published under CC BY 4.0. That means other people may copy and reuse it with credit, and we cannot call back copies they have already made.</p>
                      <p>Please record only your own voice, and do not say anyone's name or private details.</p>
                    </>
                  )}
                  <p>You can ask us to correct or remove your contribution at any time: write to <strong>{CONTACT_EMAIL}</strong>.{voice && ' We will remove a recording from khoim.in and from our data within 7 days.'}</p>
                  <label className="k-form__agree">
                    <input id={id + 'agree'} type="checkbox" aria-required="true" aria-invalid={missing.agree || undefined} aria-describedby={missing.agree ? id + 'agreeerr' : undefined}
                      checked={agree} onChange={e => { setAgree(e.target.checked); setMissing(m => ({ ...m, agree: false })); }} />
                    <span>{voice ? 'I am 18 or older and I agree to my recording being used this way.' : 'I agree.'}</span>
                  </label>
                  {missing.agree && <FieldError id={id + 'agreeerr'} text={MISSING.agree} />}
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
