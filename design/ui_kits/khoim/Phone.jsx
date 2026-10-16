/* Khoim phone, 390 x 844. Phase 2: breadcrumb, layer row, place name in every sheet, village sheet, layers, share, list view. */
function KhoimOverlay({ open, label, onClose, children, z = 'var(--z-search)' }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={label} aria-hidden={!open} onKeyDown={e => e.key === 'Escape' && onClose()}
      style={{ position: 'absolute', inset: 0, zIndex: z, background: 'var(--surface)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)',
        transform: open ? 'none' : 'translateY(104%)', visibility: open ? 'visible' : 'hidden', transition: 'transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (open ? '0s' : 'var(--dur-sheet)') }}>{children}</div>
  );
}
function KhoimSearchScreen({ k }) {
  const { SearchField, SearchResults } = KN;
  const ref = React.useRef(null);
  React.useEffect(() => { if (k.search && ref.current) setTimeout(() => ref.current.focus({ preventScroll: true }), 320); }, [k.search]);
  return (
    <KhoimOverlay open={k.search} label="Search" onClose={k.closeSearch}>
      <div style={{ padding: '54px 16px 12px' }}><SearchField inputRef={ref} value={k.query} onChange={k.setQuery} onCancel={k.closeSearch} /></div>
      <div style={{ overflowY: 'auto', padding: '4px 16px 40px' }}>{k.search && <SearchResults query={k.query} onPick={k.openPlace} />}</div>
    </KhoimOverlay>
  );
}
function KhoimTableScreen({ k }) {
  const { VillageTable, IconButton, KhoimData: GD } = KN;
  const t = k.focus && GD.getPlace(k.focus);
  return (
    <KhoimOverlay open={k.table && !!t} label={t ? 'Villages in ' + t.official : 'Villages'} onClose={k.closeTable}>
      <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconButton icon="arrow-left" label="Back to the map" onClick={k.closeTable} />
        {t && <h1 style={{ margin: 0, display: 'grid' }}><span lang="gom" style={{ font: 'var(--weight-strong) 24px/1.5 var(--font-deva)' }}>{t.deva}</span><span style={{ font: 'var(--weight-strong) 17px/1.3 var(--font-latin)' }}>{'Villages in ' + t.official}</span></h1>}
      </div>
      <div style={{ overflowY: 'auto', padding: '8px 16px 40px' }}>{t && <VillageTable taluka={t.id} compact onPick={id => { k.closeTable(); k.select(id); k.setSnap('full'); }} />}</div>
    </KhoimOverlay>
  );
}
function GoaSheetBody({ k }) {
  const { Icon, KhoimData: GD } = KN;
  const ds = GD.childrenOf(null);
  return (
    <div style={{ padding: '4px 16px 24px', display: 'grid', gap: 14 }}>
      <button type="button" onClick={k.openSearch} style={{ height: 56, borderRadius: 'var(--radius-l)', border: '2px solid var(--line)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', font: 'var(--weight-regular) 18px/1 var(--font-latin)', color: 'var(--text)', cursor: 'pointer' }}>
        <Icon name="search" size={20} />Search any name, any script</button>
      {ds.map(d => <section key={d.id} style={{ display: 'grid', gap: 6 }}>
        <h3 style={{ margin: 0, display: 'flex', gap: 10, alignItems: 'baseline' }}><span lang="gom" style={{ font: 'var(--weight-strong) 20px/1.5 var(--font-deva)' }}>{d.deva}</span><span style={{ font: 'var(--weight-strong) 16px/1.3 var(--font-latin)' }}>{d.official}</span></h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {GD.childrenOf(d.id).map(t => { const h = GD.houseOf(t); const n = GD.nameIn(t, k.script);
            return <button key={t.id} type="button" onClick={() => k.select(t.id)} style={{ minHeight: 56, borderRadius: 'var(--radius-m)', border: 0, background: h.bg, color: h.on, padding: '6px 12px', textAlign: 'left', cursor: 'pointer', display: 'grid' }}>
              <span lang={n.kind === 'deva' ? 'gom' : undefined} style={{ font: 'var(--weight-strong) 18px/1.5 ' + (n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)') }}>{n.text}</span>
              <span style={{ font: 'var(--weight-regular) 14px/1.3 var(--font-latin)' }}>{t.official}</span></button>; })}
        </div></section>)}
    </div>
  );
}
function layerHeadline(GD, l) {
  if (l.id === 'parts') { const x = GD.NAME_PARTS.find(p => p.id === l.part); return x ? 'Names ending ' + x.label + ', ' + x.count + ' villages' : 'Name parts'; }
  if (l.id === 'feasts') return 'Feasts and zatras in ' + ['January','February','March','April','May','June','July','August','September','October','November','December'][l.month - 1];
  if (l.id === 'need') return 'Konkani names we still need';
  if (l.id === 'population') return 'People per village, Census 2011';
  return '';
}
function sheetTitle(GD, p, script) {
  const n = GD.nameIn(p, script);
  return <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>{n.kind === 'deva' && <span lang="gom" style={{ fontFamily: 'var(--font-deva)', fontSize: 17, lineHeight: 1.5 }}>{n.text}</span>}<span>{p.official}</span></span>;
}

function KhoimPhone({ preset = 1, theme, onTheme }) {
  const { GoaMap, ScriptToggle, Wordmark, Sheet, PlaceCard, PlaceStrip, VillageSheet, LayerRow, LayerPanel, Breadcrumb, TapHint, ShareSheet, Toast, Button, KhoimData: GD } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const [paintKey, setPaintKey] = React.useState(0);
  React.useEffect(() => setPaintKey(n => n + 1), [preset]);
  const sp = k.selected ? GD.getPlace(k.selected) : null, fp = k.focus ? GD.getPlace(k.focus) : null;
  const first = !k.focus && !k.selected && k.layer.id === 'names';
  const layered = k.layer.id !== 'names';
  const L = GD.MAP_LAYERS.find(x => x.id === k.layer.id);
  const kind = sp ? (sp.level === 'village' ? 'village' : 'place') : layered ? 'layer' : fp ? 'strip' : 'goa';
  const hs = sp ? GD.houseOf(sp) : null;
  const peek = { village: sp && sp.deva ? 318 : 360, place: 312, layer: k.layer.id === 'population' ? 200 : k.layer.id === 'feasts' ? 300 : 280, strip: 246, goa: 128 }[kind];
  const topH = (fp || sp || layered ? 118 : 150) + 52;
  const showHint = !!P0.demo && !k.tapped;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', color: 'var(--text)', overflow: 'hidden', fontFamily: 'var(--font-latin)' }}>
      <GoaMap key={'p' + paintKey} focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} layer={k.layer} onSelect={k.pick} onHot={k.setHot} insetTop={topH} insetBottom={peek + 4} paintIn={!!P0.intro} />
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 'var(--z-chrome)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 6, paddingTop: 12, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '0 16px', pointerEvents: 'auto' }}>
          <button type="button" onClick={k.openMore} aria-label="About Khoim" style={{ border: 0, background: 'transparent', padding: '2px 4px', borderRadius: 'var(--radius-m)', cursor: 'pointer' }}><Wordmark size={21} /></button>
          <ScriptToggle value={k.script} onChange={k.setScript} width={200} />
        </div>
        <div style={{ padding: '0 16px', minHeight: 44, pointerEvents: 'auto' }}>
          {fp || sp ? <Breadcrumb id={k.selected || k.focus} script={k.script} onNavigate={k.goTo} />
            : layered ? <p style={{ margin: '4px 0 0', font: 'var(--weight-strong) 22px/1.25 var(--font-latin)' }}>{layerHeadline(GD, k.layer)}</p>
            : <h1 aria-hidden={!first} style={{ margin: '2px 0 0', maxWidth: 330, font: 'var(--weight-strong) 25px/1.15 var(--font-latin)', letterSpacing: 'var(--track-title)', textWrap: 'pretty', opacity: first ? 1 : 0, transition: 'opacity var(--dur-base)' }}>Every taluka in Goa, with its Konkani name and how to say it.</h1>}
        </div>
        <div style={{ pointerEvents: 'auto' }}><LayerRow value={k.layer.id} onChange={k.setLayer} /></div>
      </header>

      {showHint && <div style={{ position: 'absolute', left: 16, bottom: peek + 16, zIndex: 15 }}><TapHint text="Tap any taluka" /></div>}

      {kind === 'village' && <Sheet key={'v' + k.selected} label={sp.official} title={sheetTitle(GD, sp, k.script)} snap={k.snap} onSnap={k.setSnap} peek={peek} bg={hs.bg} ink={hs.on}>
        <VillageSheet place={sp} expanded={k.snap === 'full'} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onShare={k.openShare} onSuggest={k.openMore} onRecord={k.openMore} onPickPlace={k.select} style={{ padding: '4px 16px 32px' }} />
      </Sheet>}
      {kind === 'place' && <Sheet key={'s' + k.selected} label={sp.official} title={sheetTitle(GD, sp, k.script)} snap={k.snap} onSnap={k.setSnap} peek={peek} bg={hs.bg} ink={hs.on}>
        <PlaceCard place={sp} expanded={k.snap === 'full'} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onGoInside={k.goInside} onSuggest={k.openMore} style={{ padding: '4px 16px 28px' }} />
      </Sheet>}
      {kind === 'layer' && <Sheet key={'l' + k.layer.id} label={L.label} title={L.label} snap={k.snap} onSnap={s => s === 'closed' ? k.setLayer('names') : k.setSnap(s)} peek={peek}>
        <LayerPanel layer={k.layer} onChange={k.setLayer} onShare={k.openShare} onPickPlace={id => k.openPlace(id)} onHelp={k.openMore} />
      </Sheet>}
      {kind === 'strip' && <Sheet key={'t' + k.focus} label={'Places in ' + fp.official} title={<span>{fp.official + ' · ' + GD.childrenOf(fp.id).length + (fp.level === 'taluka' ? ' villages' : ' talukas')}</span>} snap="peek" onSnap={s => s === 'closed' && k.back()} peek={peek}>
        <PlaceStrip parent={k.focus} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} />
        {fp.level === 'taluka' && <div style={{ padding: '4px 16px' }}><Button variant="ghost" size="m" icon="list" onClick={k.openTable}>See all as a list</Button></div>}
      </Sheet>}
      {kind === 'goa' && <Sheet key="goa" label="Goa" title={sheetTitle(GD, GD.getPlace('goa'), k.script)} snap={k.snap} onSnap={s => s !== 'closed' && k.setSnap(s)} peek={peek}>
        <GoaSheetBody k={k} />
      </Sheet>}

      {k.share && <div style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-search)', background: 'var(--scrim)', display: 'grid', alignItems: 'end' }} onClick={e => e.target === e.currentTarget && k.closeShare()}>
        <ShareSheet place={layered && !sp ? null : sp} layer={layered && !sp ? k.layer : null} onClose={k.closeShare} onCopied={() => k.toastOn('Link copied')} onSave={f => k.toastOn(f === 'story' ? 'Tall image saved' : 'Square image saved')} />
      </div>}
      {k.toast && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 28, display: 'grid', placeItems: 'center', zIndex: 'var(--z-banner)' }}><Toast text={k.toast} /></div>}
      <KhoimSearchScreen k={k} />
      <KhoimTableScreen k={k} />
      <KhoimMore open={k.more} onClose={k.closeMore} theme={theme} onTheme={onTheme} layer="names" onLayer={() => {}} />
      <Announcer text={k.announce} />
    </div>
  );
}
Object.assign(window, { KhoimPhone, KhoimOverlay, GoaSheetBody, sheetTitle });
