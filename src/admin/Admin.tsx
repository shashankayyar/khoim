/* The reviewers' page: what has been sent in, what the automatic checks and Claude said about it, and
   Allow / Reject. Deliberately plain. Only a Konkani reviewer can allow; Claude's note is advice. */
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../components/core/Button';
import { Wordmark } from '../components/core/Wordmark';
import '../components/core/core.css';
import './admin.css';

type Status = 'waiting' | 'allowed' | 'rejected' | 'removed';
interface Item {
  id: string; created_at: string; place_official: string; place_where: string; place_lgd: string | null;
  kind: 'name' | 'say' | 'correction'; value: string; how_known: string; credit_name: string | null;
  script: string; flags: string[]; repeats: number;
  claude_note: string | null; claude_suggestion: string | null;
  status: Status; final_value: string | null; decided_by: string | null; decided_at: string | null;
  reject_reason: string | null; incorporated_at: string | null;
}
interface Listing { me: { name: string; konkani: boolean }; counts: Partial<Record<Status, number>>; items: Item[] }

const TABS: [Status, string][] = [['waiting', 'Waiting'], ['allowed', 'Allowed'], ['rejected', 'Rejected'], ['removed', 'Removed']];
const KIND: Record<Item['kind'], string> = { name: 'Konkani name or spelling', say: 'How the name is said', correction: 'Correction' };
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

  const decide = async (id: string, action: 'allow' | 'reject' | 'remove', extra: { value?: string; reason?: string } = {}) => {
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
    const fresh = ((await r.json()) as Listing).items.filter(i => !i.incorporated_at);
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
                Allowed items reach khoim.in through a pull request. <button type="button" className="a-link" onClick={download}>Download the allowed items that are not on the site yet</button> and give the file to Claude Code.
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

function Card({ item: i, konkani, busy, onDecide }: { item: Item; konkani: boolean; busy: boolean; onDecide: (id: string, action: 'allow' | 'reject' | 'remove', extra?: { value?: string; reason?: string }) => void }) {
  const [mode, setMode] = useState<'idle' | 'edit' | 'reject' | 'remove'>('idle');
  const [text, setText] = useState('');
  const deva = i.script === 'deva' || i.script === 'mixed';
  return (
    <article className="a-card" aria-label={`${i.place_official}, ${KIND[i.kind]}`}>
      <p className="a-card__where"><strong>{i.place_official}</strong> · {i.place_where}{i.place_lgd ? ` · LGD ${i.place_lgd}` : ''}</p>
      <p className="a-card__kind">{KIND[i.kind]} · sent {day(i.created_at)}{i.repeats > 1 ? ` · sent ${i.repeats} times` : ''}</p>
      {i.status === 'removed'
        ? <p className="a-card__value">Removed at the contributor's request.</p>
        : <p className={deva ? 'a-card__value a-card__value--deva' : 'a-card__value'} lang={deva ? 'gom' : undefined}>{i.value}</p>}
      {i.final_value && i.final_value !== i.value && <p className="a-row"><span>Allowed as</span> <span lang={deva ? 'gom' : undefined}>{i.final_value}</span></p>}
      {i.status !== 'removed' && <p className="a-row"><span>How they know</span> {i.how_known}</p>}
      {i.status !== 'removed' && <p className="a-row"><span>Credit</span> {i.credit_name || 'No name given'}</p>}
      {i.flags.length > 0 && <p className="a-row"><span>Automatic checks</span> {i.flags.join('. ')}.</p>}
      {i.status === 'waiting' && (
        <p className="a-row"><span>Claude's note</span> {i.claude_note ? `${i.claude_suggestion === 'looks fine' ? 'Looks fine' : i.claude_suggestion === 'reject' ? 'Suggests rejecting' : 'Needs a speaker'}. ${i.claude_note}` : 'Claude has not read this yet.'}</p>
      )}
      {i.decided_by && <p className="a-row"><span>{i.status === 'allowed' ? 'Allowed by' : i.status === 'rejected' ? 'Rejected by' : 'Removed by'}</span> {i.decided_by.replace(/\s*<.*>$/, '')}, {day(i.decided_at)}{i.reject_reason ? `. ${i.reject_reason}` : ''}</p>}
      {i.status === 'allowed' && <p className="a-row"><span>On khoim.in</span> {i.incorporated_at ? `Since ${day(i.incorporated_at)}` : 'Not yet'}</p>}

      {i.status === 'waiting' && mode === 'idle' && (
        <div className="a-actions">
          <Button size="m" disabled={!konkani || busy} onClick={() => onDecide(i.id, 'allow')}>Allow</Button>
          <Button size="m" variant="outline" disabled={!konkani || busy} onClick={() => { setText(i.value); setMode('edit'); }}>Edit and allow</Button>
          <Button size="m" variant="outline" disabled={busy} onClick={() => { setText(''); setMode('reject'); }}>Reject</Button>
        </div>
      )}
      {i.status === 'allowed' && mode === 'idle' && (
        <div className="a-actions"><Button size="m" variant="outline" disabled={busy} onClick={() => setMode('remove')}>Remove</Button></div>
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
          <p>This wipes what the person sent and their name. Use it when someone asks to withdraw. If it is already on khoim.in, also tell Claude Code to take it off the site.</p>
          <div className="a-actions"><Button size="m" disabled={busy} onClick={() => { onDecide(i.id, 'remove'); setMode('idle'); }}>Remove for good</Button><Button size="m" variant="ghost" onClick={() => setMode('idle')}>Cancel</Button></div>
        </div>
      )}
    </article>
  );
}
