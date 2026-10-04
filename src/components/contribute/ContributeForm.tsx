/* The form people use to tell Khoim something about a place. It slides up over the map, like About.

   One form, one Send, as many things as the person knows. Each kind of thing is a row that can be ticked;
   ticking it opens its box (or the recorder) right under the row. Someone who knows a village can leave its
   name, a recording, two crops and a dance in one go. What the server receives is still one item per thing,
   so a reviewer can allow one and reject another.

   What can be sent follows the layers (LAYERS in src/data/khoim.ts). The three things under the Names layer
   come first. Under them are the other layers: a recording of the name, crops, food, music, landmarks. Since
   4 October 2026 those show on the site once a reviewer has allowed them (src/lib/live.ts).

   Wording is in docs/copy.md. The consent wording is sections 5a and 5b of docs/collaboration-plan.md.

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

type TextKind = Exclude<ContributionKind, 'voice'>;
interface Choice { kind: ContributionKind; label: string; icon?: IconName }
const NAMES: Choice[] = [
  { kind: 'name', label: 'The Konkani name or spelling' },
  { kind: 'say', label: 'How the name is said' },
  { kind: 'correction', label: 'A correction' }
];
/* The layers other than Names. The examples are taken from the layer notes in LAYERS. */
const LAYER_CHOICE: Record<string, { kind: ContributionKind; label: string }> = {
  voices: { kind: 'voice', label: 'A recording of the name' },
  crops: { kind: 'crops', label: 'A crop grown here' },
  food: { kind: 'food', label: 'A dish from here' },
  music: { kind: 'music', label: 'Music or dance from here' },
  landmarks: { kind: 'landmarks', label: 'A landmark, and what people call it' }
};
const OTHERS: Choice[] = LAYERS.filter(l => LAYER_CHOICE[l.id]).map(l => ({ ...LAYER_CHOICE[l.id], icon: l.icon }));
const CHOICES = [...NAMES, ...OTHERS];

const ASK: Record<TextKind, { label: string; hint?: string }> = {
  name: { label: 'What should it be?' },
  say: { label: 'What should it be?' },
  correction: { label: 'What should it be?' },
  crops: { label: 'What is grown here?', hint: 'For example: khazan paddy, cashew, coconut, areca' },
  food: { label: 'What is the dish?', hint: 'Its Konkani name if you know it, and the village or feast it belongs to' },
  music: { label: 'What is sung or danced here?', hint: 'For example: mando, dulpod, deknni, fugdi' },
  landmarks: { label: 'What is the landmark, and what do people nearby call it?', hint: 'For example: a temple, church, mosque or spring' }
};
/* Several answers to one question: a box each, each stored as its own item. One recording at a time. */
const MAX_VALUES = 6;
const ADD_ANOTHER = 'Add another';

/* One form for many things. Wording in docs/copy.md (confirmed by Shashank, 1 October 2026). */
const PICK_HINT = 'Tick as many as you like. Each one opens a box.';
const MISSING_PICK = 'Please tick at least one thing to add.';
const SENT_LIST = 'You sent:';
const MISSING_VILLAGE = 'Please fill this in. It is shown with your recording.';

const MISSING = {
  value: 'Please fill this in.',
  recording: 'Please record the name first.',
  how: 'Please fill this in. A few words are enough.',
  agree: 'Please tick the box if you agree.'
};

type Picked = Partial<Record<ContributionKind, boolean>>;
type Values = Partial<Record<ContributionKind, string[]>>;
interface Missing { pick?: boolean; kinds?: Picked; village?: boolean; how?: boolean; agree?: boolean }

function FieldError({ id, text, alert }: { id?: string; text: string; alert?: boolean }) {
  return <p className="k-field__error" id={id} role={alert ? 'alert' : undefined}><Icon name="info" size={20} /><span>{text}</span></p>;
}

export interface ContributeFormProps {
  /** The place the form is about. Null when the form is closed. */
  place: Place | null;
  /** Which row is already ticked when it opens. Null: none. */
  kind: ContributionKind | null;
  siteKey: string | null;
  onClose: () => void;
}

export function ContributeForm({ place, kind: firstKind, siteKey, onClose }: ContributeFormProps) {
  const open = !!place;
  const ref = useRef<HTMLDivElement>(null), check = useRef<HTMLDivElement>(null), widget = useRef<string | null>(null);
  const id = useId();
  const [picked, setPicked] = useState<Picked>({});
  const [values, setValues] = useState<Values>({});
  const [recording, setRecording] = useState<Recorded | null>(null);
  const [how, setHow] = useState(''), [village, setVillage] = useState(''), [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [token, setToken] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [missing, setMissing] = useState<Missing>({});
  const [sent, setSent] = useState<string[]>([]);
  useDialog(ref, open, onClose);

  /* A fresh form each time it opens for a place. The person's name, their village and how they know are kept
     for this visit, to save typing them again for the next place. */
  const placeId = place?.id;
  useEffect(() => {
    if (!placeId) return;
    setPicked(firstKind ? { [firstKind]: true } : {}); setValues({}); setRecording(null); setAgree(false); setState('idle'); setMissing({});
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

  const voice = !!picked.voice;
  const textKinds = CHOICES.map(c => c.kind).filter((k): k is TextKind => k !== 'voice' && !!picked[k]);
  const boxes = (k: ContributionKind) => values[k] ?? [''];
  const typed = (k: ContributionKind) => boxes(k).map(v => v.trim()).filter(Boolean);
  const valueId = (k: ContributionKind, i: number) => `${id}${k}${i}`;
  const focusSoon = (elId: string) => window.setTimeout(() => document.getElementById(elId)?.focus(), 0);
  const kindOk = (k: ContributionKind) => setMissing(m => ({ ...m, pick: false, kinds: { ...m.kinds, [k]: false } }));

  const toggle = (k: ContributionKind) => {
    const on = !picked[k];
    setPicked(p => ({ ...p, [k]: on }));
    kindOk(k);
    /* the cursor goes into the box that has just opened */
    if (on) focusSoon(k === 'voice' ? id + 'record' : valueId(k, 0));
  };
  const setValueAt = (k: ContributionKind, i: number, v: string) => { setValues(all => ({ ...all, [k]: boxes(k).map((old, j) => (j === i ? v : old)) })); kindOk(k); };
  const addValue = (k: ContributionKind) => { const next = boxes(k).length; setValues(all => ({ ...all, [k]: [...boxes(k), ''] })); focusSoon(valueId(k, next)); };
  const removeValue = (k: ContributionKind, i: number) => { setValues(all => ({ ...all, [k]: boxes(k).filter((_, j) => j !== i) })); focusSoon(valueId(k, Math.max(0, i - 1))); };

  const canSend = !!token && state !== 'sending';
  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!place) return;
    /* Say what is missing, and put the cursor in the first box that needs filling, going down the form. */
    const kinds: Picked = {};
    const wanting: string[] = [];
    const pick = !textKinds.length && !voice;
    if (pick) wanting.push(id + 'pick' + CHOICES[0].kind);
    for (const c of CHOICES) {
      if (!picked[c.kind]) continue;
      if (c.kind === 'voice') {
        if (!recording) { kinds.voice = true; wanting.push(id + 'record'); }
        if (!village.trim()) wanting.push(id + 'village');
      } else if (!typed(c.kind).length) { kinds[c.kind] = true; wanting.push(valueId(c.kind, 0)); }
    }
    const gaps: Missing = { pick, kinds, village: voice && !village.trim(), how: textKinds.length > 0 && !how.trim(), agree: !agree };
    if (gaps.how) wanting.push(id + 'how');
    if (gaps.agree) wanting.push(id + 'agree');
    setMissing(gaps);
    if (wanting.length) { document.getElementById(wanting[0])?.focus(); return; }
    if (!canSend) return;
    setState('sending');
    const items = [...textKinds.map(k => ({ kind: k as ContributionKind, values: typed(k) })), ...(voice ? [{ kind: 'voice' as ContributionKind, values: [] }] : [])];
    const ok = await sendContribution({ placeId: place.id, items, how, village: voice ? village : '', name, consent: agree, token, recording: voice ? recording : null });
    if (ok) setSent(CHOICES.filter(c => picked[c.kind]).map(c => c.label + (c.kind !== 'voice' && typed(c.kind).length > 1 ? ` (${typed(c.kind).length})` : '')));
    setState(ok ? 'sent' : 'failed');
    /* a bot-check pass can be used once; get a new one for the next try */
    if (!ok && widget.current) { setToken(''); window.turnstile?.reset(widget.current); }
  };

  /* What opens under a ticked row: boxes for something typed, or the recorder. */
  const typedBody = (k: TextKind, label: string, wrong: boolean) => {
    const ask = ASK[k], hintId = id + k + 'hint', errId = id + k + 'err';
    return (
      <div className="k-pick__body">
        <div className="k-field">
          <label htmlFor={valueId(k, 0)}>{ask.label}</label>
          {ask.hint && <p className="k-field__hint" id={hintId}>{ask.hint}</p>}
          <div className="k-field__many">
            {boxes(k).map((v, i) => (
              <div key={i} className="k-field__one">
                <div className="k-field__box" data-khoim-field="1">
                  <input id={valueId(k, i)} type="text" aria-required={i === 0 ? 'true' : undefined} aria-invalid={(i === 0 && wrong) || undefined}
                    aria-label={i > 0 ? `${ask.label} Number ${i + 1}` : undefined}
                    aria-describedby={i === 0 ? [ask.hint && hintId, wrong && errId].filter(Boolean).join(' ') || undefined : undefined}
                    maxLength={200} autoComplete="off" autoCapitalize="off" spellCheck={false} value={v}
                    onChange={e => setValueAt(k, i, e.target.value)} />
                </div>
                {i > 0 && <IconButton icon="x" label={`Remove number ${i + 1}`} onClick={() => removeValue(k, i)} />}
              </div>
            ))}
          </div>
          {wrong && <FieldError id={errId} text={MISSING.value} />}
          {boxes(k).length < MAX_VALUES && (
            <div className="k-field__add"><Button variant="ghost" size="m" onClick={() => addValue(k)}>{ADD_ANOTHER}<span className="k-visually-hidden">: {label}</span></Button></div>
          )}
        </div>
      </div>
    );
  };
  const voiceBody = (official: string, wrong: boolean) => (
    <div className="k-pick__body">
      <VoiceRecorder id={id + 'record'} official={official} recording={recording} onChange={r => { setRecording(r); kindOk('voice'); }} />
      {wrong && <FieldError text={MISSING.recording} alert />}
      <div className="k-field">
        <label htmlFor={id + 'village'}>Which village or town are you from?</label>
        <p className="k-field__hint" id={id + 'villagehint'}>It is shown with your recording</p>
        <div className="k-field__box" data-khoim-field="1">
          <input id={id + 'village'} type="text" aria-required="true" aria-invalid={missing.village || undefined} aria-describedby={id + 'villagehint' + (missing.village ? ' ' + id + 'villageerr' : '')}
            maxLength={80} autoComplete="address-level2" value={village} onChange={e => { setVillage(e.target.value); setMissing(m => ({ ...m, village: false })); }} />
        </div>
        {missing.village && <FieldError id={id + 'villageerr'} text={MISSING_VILLAGE} />}
      </div>
    </div>
  );
  /* One row: a tick box, and under it, when ticked, what to fill in. */
  const row = (c: Choice, official: string) => {
    const on = !!picked[c.kind], wrong = !!missing.kinds?.[c.kind];
    return (
      <div key={c.kind} className={on ? 'k-pick is-on' : 'k-pick'}>
        <label className="k-kind">
          <input id={id + 'pick' + c.kind} type="checkbox" checked={on} onChange={() => toggle(c.kind)} aria-describedby={c.kind === CHOICES[0].kind && missing.pick ? id + 'pickerr' : undefined} />
          <span className="k-kind__mark" aria-hidden="true">{on && <Icon name="check" size={16} />}</span>
          <span className="k-kind__label">{c.label}</span>
          {c.icon && <span className="k-kind__icon" aria-hidden="true"><Icon name={c.icon} size={20} /></span>}
        </label>
        {on && (c.kind === 'voice' ? voiceBody(official, wrong) : typedBody(c.kind, c.label, wrong))}
      </div>
    );
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
                {sent.length > 0 && (
                  <div className="k-form__sent">
                    <p>{SENT_LIST}</p>
                    <ul>{sent.map(s => <li key={s}>{s}</li>)}</ul>
                  </div>
                )}
                <Button onClick={onClose}>Close</Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <fieldset className="k-form__kinds">
                  <legend>What are you adding?</legend>
                  <p className="k-form__pick-hint">{PICK_HINT}</p>
                  {missing.pick && <FieldError id={id + 'pickerr'} text={MISSING_PICK} alert />}
                  {NAMES.map(c => row(c, place.official))}
                  {OTHERS.map(c => row(c, place.official))}
                </fieldset>

                {/* asked once, for everything typed above; a recording asks for the speaker's village instead */}
                {(textKinds.length > 0 || !voice) && (
                  <div className="k-field">
                    <label htmlFor={id + 'how'}>How do you know?</label>
                    <p className="k-field__hint" id={id + 'howhint'}>For example: my family is from here</p>
                    <div className="k-field__box k-field__box--tall" data-khoim-field="1">
                      <textarea id={id + 'how'} aria-required="true" aria-invalid={missing.how || undefined} aria-describedby={id + 'howhint' + (missing.how ? ' ' + id + 'howerr' : '')}
                        maxLength={500} rows={3} value={how}
                        onChange={e => { setHow(e.target.value); setMissing(m => ({ ...m, how: false })); }} />
                    </div>
                    {missing.how && <FieldError id={id + 'howerr'} text={MISSING.how} />}
                  </div>
                )}
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
