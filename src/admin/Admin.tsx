/* The reviewers' page: what has been sent in, what the automatic checks and Claude said about it, and
   Allow / Reject. Deliberately plain. Only a Konkani reviewer can allow; Claude's note is advice.
   A recording can be clipped to just the name before it is allowed (ClipEditor.tsx).

   Two routes onto khoim.in. A name, a say-it guide or a correction is downloaded here and comes in through a
   pull request. A recording, or a note for crops, food, music or landmarks, shows on the site within a few
   minutes of being allowed, and comes off it as fast when it is removed. */
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../components/core/Button';
import { Wordmark } from '../components/core/Wordmark';
import { CANNOT_OPEN, ClipEditor, ClipPlayer, clipWords, cutRecording, parseClip } from './ClipEditor';
import type { Clip, CutClip } from './ClipEditor';
import '../components/core/core.css';
import './admin.css';

type Status = 'waiting' | 'allowed' | 'rejected' | 'removed';
interface Item {
  id: string; created_at: string; place_official: string; place_where: string; place_lgd: string | null;
  kind: 'name' | 'say' | 'correction' | 'voice' | 'crops' | 'food' | 'music' | 'landmarks'; value: string; how_known: string; credit_name: string | null;
  script: string; flags: string[]; repeats: number;
  claude_note: string | null; claude_suggestion: string | null;
  status: Status; final_value: string | null; decided_by: string | null; decided_at: string | null;
  reject_reason: string | null; incorporated_at: string | null;
  /** On khoim.in now, without a pull request: a recording whose clip has been made, or a note for another layer. */
  live: boolean;
}
type Action = 'allow' | 'clip' | 'reject' | 'remove';
interface Extra { value?: string; reason?: string; clip?: Clip | null; audio?: CutClip }
interface Listing { me: { name: string; konkani: boolean }; counts: Partial<Record<Status, number>>; items: Item[] }

const TABS: [Status, string][] = [['waiting', 'Waiting'], ['allowed', 'Allowed'], ['rejected', 'Rejected'], ['removed', 'Removed']];
const KIND: Record<Item['kind'], string> = {
  name: 'Konkani name or spelling', say: 'How the name is said', correction: 'Correction',
  voice: 'Recording of the name', crops: 'Crop grown here', food: 'Dish from here', music: 'Music or dance from here', landmarks: 'Landmark'
};
/* These show on khoim.in as soon as they are allowed. The other kinds (names) wait for a pull request. */
const STRAIGHT_ON: Item['kind'][] = ['voice', 'crops', 'food', 'music', 'landmarks'];
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export default function Admin() {
  const [status, setStatus] = useState<Status>('waiting');
  const [data, setData] = useState<Listing | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (which: Status) => {
    setProblem(null);
    try {
      const r = await fetch('/api/admin/items?status=' + which, { headers: { accept: 'application/json' } });
      if (r.status === 401) return setProblem('You are not signed in as a reviewer. Ask Shashank to add your email address.');
      if (r.status === 503) return setProblem('Contributions are not switched on yet.');
      if (!r.ok) return setProblem('The list did not load. Check your connection and try again.');
      setData(await r.json());
    } catch {
      setProblem('The list did not load. Check your connection and try again.');
    }
  }, []);
  useEffect(() => { void load(status); }, [load, status]);

  const decide = async (id: string, action: Action, extra: Extra = {}) => {
    setBusy(true);
    try {
      const r = await fetch('/api/admin/decide', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, action, ...extra }) });
      if (!r.ok) setProblem(r.status === 403 ? 'Only a Konkani reviewer can allow this.' : 'That did not save. Please try again.');
    } catch {
      setProblem('That did not save. Please try again.');
    }
    setBusy(false);
    await load(status);
  };

  /* For bringing allowed items into the site: this file is handed to Claude Code, which opens a pull request. */
  const download = async () => {
    const r = await fetch('/api/admin/items?status=allowed');
    if (!r.ok) return setProblem('The list did not load. Check your connection and try again.');
    const fresh = ((await r.json()) as Listing).items.filter(i => !i.incorporated_at && !STRAIGHT_ON.includes(i.kind));
    const url = URL.createObjectURL(new Blob([JSON.stringify(fresh, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `khoim-allowed-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="a-page">
      <header className="a-head">
        <a href="/" className="a-home"><Wordmark size={22} /></a>
        {data && <p className="a-me">{data.me.name}, {data.me.konkani ? 'Konkani reviewer' : 'helper'}</p>}
      </header>
      <main>
        <h1>Contributions</h1>
        {problem && <p className="a-problem" role="alert">{problem}</p>}
        {data && (
          <>
            <div className="a-tabs" role="group" aria-label="Show">
              {TABS.map(([s, label]) => (
                <button key={s} type="button" className="a-tab" aria-pressed={status === s} onClick={() => setStatus(s)}>{label} ({data.counts[s] ?? 0})</button>
              ))}
            </div>
            {status === 'allowed' && (
              <p className="a-note">
                Recordings and notes for crops, food, music and landmarks are on khoim.in within a few minutes of being allowed. Names, say-it guides and corrections reach khoim.in through a pull request. <button type="button" className="a-link" onClick={download}>Download the allowed names that are not on the site yet</button> and give the file to Claude Code.
              </p>
            )}
            {!data.me.konkani && status === 'waiting' && <p className="a-note">You can reject spam and remove things. Only a Konkani reviewer can allow a name.</p>}
            {data.items.length === 0 && <p className="a-note">Nothing here.</p>}
            <ul className="a-list">
              {data.items.map(i => <li key={i.id}><Card item={i} konkani={data.me.konkani} busy={busy} onDecide={decide} /></li>)}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ item: i, konkani, busy, onDecide }: { item: Item; konkani: boolean; busy: boolean; onDecide: (id: string, action: Action, extra?: Extra) => void }) {
  const [mode, setMode] = useState<'idle' | 'edit' | 'clip' | 'reject' | 'remove'>('idle');
  const [text, setText] = useState('');
  const [cutting, setCutting] = useState(false), [failed, setFailed] = useState(false);
  const deva = i.script === 'deva' || i.script === 'mixed';
  const clip = i.kind === 'voice' ? parseClip(i.final_value) : null;
  const straightOn = STRAIGHT_ON.includes(i.kind);
  /* A recording goes onto the site as a copy of the part that was kept, made here in the browser. */
  const sendCut = async (action: 'allow' | 'clip', kept: Clip | null) => {
    setCutting(true); setFailed(false);
    try { onDecide(i.id, action, { clip: kept, audio: await cutRecording(i.id, kept) }); } catch { setFailed(true); }
    setCutting(false);
  };
  return (
    <article className="a-card" aria-label={`${i.place_official}, ${KIND[i.kind]}`}>
      <p className="a-card__where"><strong>{i.place_official}</strong> · {i.place_where}{i.place_lgd ? ` · LGD ${i.place_lgd}` : ''}</p>
      <p className="a-card__kind">{KIND[i.kind]} · sent {day(i.created_at)}{i.repeats > 1 ? ` · sent ${i.repeats} times` : ''}</p>
      {i.status === 'removed'
        ? <p className="a-card__value">Removed at the contributor's request.</p>
        : i.kind === 'voice'
          /* only loaded when the reviewer presses play */
          ? <audio className="a-card__audio" controls preload="none" src={'/api/admin/audio?id=' + encodeURIComponent(i.id)} aria-label={'Recording of ' + i.place_official} />
          : <p className={deva ? 'a-card__value a-card__value--deva' : 'a-card__value'} lang={deva ? 'gom' : undefined}>{i.value}</p>}
      {straightOn && i.status === 'waiting' && <p className="a-row"><span>If you allow it</span> It shows on khoim.in within a few minutes{i.credit_name ? ', with the name under Credit' : ''}{i.kind === 'voice' ? ' and where they are from' : ''}.</p>}
      {i.kind !== 'voice' && i.final_value && i.final_value !== i.value && <p className="a-row"><span>Allowed as</span> <span lang={deva ? 'gom' : undefined}>{i.final_value}</span></p>}
      {clip && i.status === 'allowed' && <p className="a-row"><span>Clip</span> {clipWords(clip)}. Only this part plays on khoim.in.</p>}
      {i.status !== 'removed' && <p className="a-row"><span>{i.kind === 'voice' ? 'Where they are from' : 'How they know'}</span> {i.how_known}</p>}
      {i.status !== 'removed' && <p className="a-row"><span>Credit</span> {i.credit_name || 'No name given'}</p>}
      {i.flags.length > 0 && <p className="a-row"><span>Automatic checks</span> {i.flags.join('. ')}.</p>}
      {i.status === 'waiting' && (
        <p className="a-row"><span>Claude's note</span> {i.claude_note ? `${i.claude_suggestion === 'looks fine' ? 'Looks fine' : i.claude_suggestion === 'reject' ? 'Suggests rejecting' : 'Needs a speaker'}. ${i.claude_note}` : 'Claude has not read this yet.'}</p>
      )}
      {i.decided_by && <p className="a-row"><span>{i.status === 'allowed' ? 'Allowed by' : i.status === 'rejected' ? 'Rejected by' : 'Removed by'}</span> {i.decided_by.replace(/\s*<.*>$/, '')}, {day(i.decided_at)}{i.reject_reason ? `. ${i.reject_reason}` : ''}</p>}
      {i.status === 'allowed' && <p className="a-row"><span>On khoim.in</span> {(straightOn ? i.live : i.incorporated_at) ? `Since ${day(i.incorporated_at || i.decided_at)}` : i.kind === 'voice' ? 'Not yet. It was allowed before recordings went live: press "Put on khoim.in".' : 'Not yet'}</p>}
      {failed && <p className="a-problem" role="alert">{CANNOT_OPEN}</p>}

      {i.status === 'waiting' && mode === 'idle' && (
        <div className="a-actions">
          <Button size="m" disabled={!konkani || busy || cutting} onClick={() => (i.kind === 'voice' ? void sendCut('allow', null) : onDecide(i.id, 'allow'))}>Allow</Button>
          {i.kind === 'voice'
            ? <Button size="m" variant="outline" disabled={!konkani || busy} onClick={() => setMode('clip')}>Clip and allow</Button>
            : <Button size="m" variant="outline" disabled={!konkani || busy} onClick={() => { setText(i.value); setMode('edit'); }}>Edit and allow</Button>}
          <Button size="m" variant="outline" disabled={busy} onClick={() => { setText(''); setMode('reject'); }}>Reject</Button>
        </div>
      )}
      {i.status === 'allowed' && mode === 'idle' && (
        <div className="a-actions">
          {clip && <ClipPlayer id={i.id} clip={clip} />}
          {i.kind === 'voice' && !i.live && <Button size="m" disabled={!konkani || busy || cutting} onClick={() => void sendCut('clip', clip)}>Put on khoim.in</Button>}
          {i.kind === 'voice' && <Button size="m" variant="outline" disabled={!konkani || busy} onClick={() => setMode('clip')}>{clip ? 'Change the clip' : 'Clip'}</Button>}
          <Button size="m" variant="outline" disabled={busy} onClick={() => setMode('remove')}>Remove</Button>
        </div>
      )}
      {mode === 'clip' && (
        <ClipEditor id={i.id} official={i.place_official} clip={clip} busy={busy} saveLabel={i.status === 'waiting' ? 'Allow this clip' : 'Save this clip'}
          onSave={(c, audio) => { onDecide(i.id, i.status === 'waiting' ? 'allow' : 'clip', { clip: c, audio }); setMode('idle'); }} onCancel={() => setMode('idle')} />
      )}
      {mode === 'edit' && (
        <form className="a-form" onSubmit={e => { e.preventDefault(); onDecide(i.id, 'allow', { value: text }); setMode('idle'); }}>
          <label>Allow it as<input type="text" required maxLength={200} value={text} onChange={e => setText(e.target.value)} /></label>
          <div className="a-actions"><Button size="m" type="submit" disabled={busy}>Allow this spelling</Button><Button size="m" variant="ghost" onClick={() => setMode('idle')}>Cancel</Button></div>
        </form>
      )}
      {mode === 'reject' && (
        <form className="a-form" onSubmit={e => { e.preventDefault(); onDecide(i.id, 'reject', { reason: text }); setMode('idle'); }}>
          <label>Why (optional, only reviewers see this)<input type="text" maxLength={300} value={text} onChange={e => setText(e.target.value)} /></label>
          <div className="a-actions"><Button size="m" type="submit" disabled={busy}>Reject</Button><Button size="m" variant="ghost" onClick={() => setMode('idle')}>Cancel</Button></div>
        </form>
      )}
      {mode === 'remove' && (
        <div className="a-form">
          <p>This wipes what the person sent and their name. Use it when someone asks to withdraw. {straightOn ? 'It comes off khoim.in within a few minutes.' : 'If it is already on khoim.in, also tell Claude Code to take it off the site.'}</p>
          <div className="a-actions"><Button size="m" disabled={busy} onClick={() => { onDecide(i.id, 'remove'); setMode('idle'); }}>Remove for good</Button><Button size="m" variant="ghost" onClick={() => setMode('idle')}>Cancel</Button></div>
        </div>
      )}
    </article>
  );
}
