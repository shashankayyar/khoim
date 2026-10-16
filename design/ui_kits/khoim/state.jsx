/* Khoim app state, phase 2. Shared by phone and desktop. */
const KN = window.GoemDesignSystem_26c22a;
const KHOIM_PRESETS = {
  1: { label: 'First visit, "Tap any taluka" demo', intro: true, demo: 'bardez' },
  2: { label: 'Inside Bardez, Aldona tapped', focus: 'bardez', selected: 'v626704' },
  3: { label: 'Aldona, full village sheet', focus: 'bardez', selected: 'v626704', snap: 'full' },
  4: { label: 'Parra, official name and facts', focus: 'bardez', selected: 'v626675', snap: 'full' },
  5: { label: 'Name parts layer, -im', layer: { id: 'parts', part: 'im' } },
  6: { label: 'Feasts and zatras, April', layer: { id: 'feasts', month: 4 } },
  7: { label: 'Names we need', layer: { id: 'need' } },
  8: { label: 'Share menu on Aldona', focus: 'bardez', selected: 'v626704', share: true },
  9: { label: 'Link preview and save-image cards', cards: true },
  10: { label: 'Bardez as a village list', focus: 'bardez', table: true },
  11: { label: 'Search, mixed scripts', search: true, query: 'sa' },
  12: { label: 'About and help', more: true }
};
const LAYER_DEFAULTS = { names: {}, parts: { part: 'im' }, feasts: { month: new Date().getMonth() + 1 }, need: {}, population: {} };

function initState(p) {
  return { focus: p.focus || null, selected: p.selected || null, snap: p.snap || 'peek', search: !!p.search, query: p.query || '', more: !!p.more, hot: null,
    layer: p.layer || { id: 'names' }, share: !!p.share, table: !!p.table, toast: null };
}
function useKhoim(preset) {
  const GD = KN.KhoimData;
  const P = KHOIM_PRESETS[preset] || {};
  const [s, set] = React.useState(() => initState(P));
  const [script, setScriptRaw] = React.useState(() => { try { return localStorage.getItem('khoim-script') || 'deva'; } catch (e) { return 'deva'; } });
  const [tapped, setTapped] = React.useState(!P.demo);
  const [announce, setAnnounce] = React.useState('');
  const toastT = React.useRef(null);
  React.useEffect(() => { set(initState(KHOIM_PRESETS[preset] || {})); setTapped(!(KHOIM_PRESETS[preset] || {}).demo); }, [preset]);

  /* first-visit demo: one taluka lights up and its names show in the sheet, then it settles and the hint appears */
  React.useEffect(() => {
    const d = (KHOIM_PRESETS[preset] || {}).demo; if (!d) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { set(v => ({ ...v, hot: d })); return; }
    const a = setTimeout(() => set(v => ({ ...v, selected: d, snap: 'peek' })), 1700);
    const b = setTimeout(() => set(v => (v.selected === d ? { ...v, selected: null } : v)), 1700 + 2400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [preset]);

  const up = o => set(v => ({ ...v, ...o }));
  const say = id => { const p = GD.getPlace(id); if (p) setAnnounce(GD.spokenName(p)); };
  const touch = () => { if (!tapped) { setTapped(true); try { localStorage.setItem('khoim-tapped', '1'); } catch (e) {} } };
  const api = {
    ...s, script, tapped, announce,
    setScript: v => { setScriptRaw(v); try { localStorage.setItem('khoim-script', v); } catch (e) {} },
    setHot: hot => up({ hot }), setQuery: query => up({ query }),
    setLayer: l => { const L = typeof l === 'string' ? { id: l, ...LAYER_DEFAULTS[l] } : l; up({ layer: L, selected: s.selected && s.selected[0] === 'v' ? s.selected : null, snap: 'peek' }); },
    openSearch: () => up({ search: true }), closeSearch: () => up({ search: false }),
    openMore: () => up({ more: true }), closeMore: () => up({ more: false }),
    openShare: () => up({ share: true }), closeShare: () => up({ share: false }),
    openTable: () => up({ table: true }), closeTable: () => up({ table: false }),
    toastOn: text => { clearTimeout(toastT.current); up({ toast: text, share: false }); toastT.current = setTimeout(() => up({ toast: null }), 2400); },
    select: id => { touch(); up({ selected: id, snap: 'peek', hot: null }); say(id); },
    goInside: id => { touch(); up({ focus: id, selected: null, snap: 'peek', hot: null, table: false }); const p = GD.getPlace(id); setAnnounce('Inside ' + p.official + '. ' + GD.childrenOf(id).length + (p.level === 'taluka' ? ' villages.' : ' talukas.')); },
    pick: (id, scrubbed) => {
      touch();
      if (scrubbed || id !== s.selected) return api.select(id);
      const p = GD.getPlace(id); if (p.level !== 'village') api.goInside(id); else up({ snap: 'full' });
    },
    setSnap: snap => snap === 'closed' ? up({ selected: null, snap: 'peek' }) : up({ snap }),
    goTo: id => { up({ focus: id && GD.getPlace(id).level !== 'village' ? id : (id ? GD.getPlace(id).parent : null), selected: id && GD.getPlace(id).level === 'village' ? id : null, snap: 'peek', hot: null, table: false }); setAnnounce(id ? GD.getPlace(id).official : 'All of Goa'); },
    back: () => { if (s.selected) return up({ selected: null, snap: 'peek' }); const p = GD.getPlace(s.focus); api.goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null); },
    openPlace: id => { const p = GD.getPlace(id); if (!p || p.level === 'state') return up({ search: false, focus: null, selected: null, table: false }); up({ search: false, table: false, focus: p.level === 'district' || p.level === 'taluka' ? null : p.parent, selected: id, snap: 'full', layer: { id: 'names' } }); say(id); }
  };
  return api;
}
function Announcer({ text }) {
  return <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{text}</div>;
}
Object.assign(window, { KHOIM_PRESETS, useKhoim, Announcer });
