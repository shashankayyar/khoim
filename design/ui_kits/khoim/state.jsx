/* Khoim app state. Shared by the phone and desktop layouts. */
const KN = window.GoemDesignSystem_26c22a;
const KHOIM_PRESETS = {
  1: { label: 'Goa, nothing selected', intro: true },
  2: { label: 'District tapped once', selected: 'south-goa' },
  3: { label: 'Inside a taluka', focus: 'salcete' },
  4: { label: 'Canacona, full names', focus: 'kushavati', selected: 'canacona', snap: 'full' },
  '4b': { label: 'Raia, official name only', focus: 'salcete', selected: 'v626925', snap: 'full' },
  5: { label: 'Search, mixed scripts', search: true, query: 'sa' },
  6: { label: 'Layers and about', more: true }
};

function useKhoim(preset) {
  const GD = KN.KhoimData;
  const init = KHOIM_PRESETS[preset] || {};
  const [s, set] = React.useState(() => ({ focus: init.focus || null, selected: init.selected || null, snap: init.snap || 'peek', search: !!init.search, query: init.query || '', more: !!init.more, hot: null, layer: 'names' }));
  const [script, setScriptRaw] = React.useState(() => { try { return localStorage.getItem('khoim-script') || 'deva'; } catch (e) { return 'deva'; } });
  const [announce, setAnnounce] = React.useState('');
  React.useEffect(() => { const p = KHOIM_PRESETS[preset] || {}; set({ focus: p.focus || null, selected: p.selected || null, snap: p.snap || 'peek', search: !!p.search, query: p.query || '', more: !!p.more, hot: null, layer: 'names' }); }, [preset]);
  const up = o => set(v => ({ ...v, ...o }));
  const say = id => { const p = GD.getPlace(id); if (p) setAnnounce(GD.spokenName(p)); };
  const api = {
    ...s, script,
    setScript: v => { setScriptRaw(v); try { localStorage.setItem('khoim-script', v); } catch (e) {} },
    setHot: hot => up({ hot }), setQuery: query => up({ query }), setLayer: layer => up({ layer }),
    openSearch: () => up({ search: true }), closeSearch: () => up({ search: false }),
    openMore: () => up({ more: true }), closeMore: () => up({ more: false }),
    select: id => { up({ selected: id, snap: 'peek' }); say(id); },
    goInside: id => { up({ focus: id, selected: null, snap: 'peek', hot: null }); const p = GD.getPlace(id); setAnnounce('Inside ' + p.official + '. ' + GD.childrenOf(id).length + (p.level === 'taluka' ? ' villages.' : ' talukas.')); },
    pick: (id, scrubbed) => {
      if (scrubbed || id !== s.selected) return api.select(id);
      const p = GD.getPlace(id); if (p.level !== 'village') api.goInside(id); else up({ snap: 'full' });
    },
    setSnap: snap => snap === 'closed' ? up({ selected: null, snap: 'peek' }) : up({ snap }),
    back: () => { if (s.selected) return up({ selected: null, snap: 'peek' }); const p = GD.getPlace(s.focus); api.goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null); },
    goTo: id => { up({ focus: id, selected: null, snap: 'peek', hot: null }); setAnnounce(id ? 'Inside ' + GD.getPlace(id).official : 'All of Goa'); },
    openPlace: id => { const p = GD.getPlace(id); if (!p || p.level === 'state') return up({ search: false, focus: null, selected: null }); up({ search: false, focus: p.level === 'district' ? null : p.parent, selected: id, snap: 'full' }); say(id); },
    announce
  };
  return api;
}

function Announcer({ text }) {
  return <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text}</div>;
}
Object.assign(window, { KHOIM_PRESETS, useKhoim, Announcer });
