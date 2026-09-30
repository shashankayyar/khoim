/* Khoim phone (390 x 844) and desktop (1280 x 800) layouts. */
function KhoimSearchScreen({ k, top = 54 }) {
  const { SearchField, SearchResults } = KN;
  const ref = React.useRef(null);
  React.useEffect(() => { if (k.search && ref.current) setTimeout(() => ref.current.focus({ preventScroll: true }), 320); }, [k.search]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!k.search} onKeyDown={e => e.key === 'Escape' && k.closeSearch()}
      style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-search)', background: 'var(--surface)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)',
        transform: k.search ? 'none' : 'translateY(104%)', visibility: k.search ? 'visible' : 'hidden', transition: 'transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (k.search ? '0s' : 'var(--dur-sheet)') }}>
      <div style={{ padding: `${top}px 16px 12px` }}><SearchField inputRef={ref} value={k.query} onChange={k.setQuery} onCancel={k.closeSearch} /></div>
      <div style={{ overflowY: 'auto', padding: '4px 16px 40px' }}>{k.search && <SearchResults query={k.query} onPick={k.openPlace} />}</div>
    </div>
  );
}

function KhoimPhone({ preset = 1, theme, onTheme }) {
  const { GoaMap, ScriptToggle, IconButton, Wordmark, Sheet, PlaceCard, PlaceStrip, Icon, KhoimData: GD } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const [paintKey, setPaintKey] = React.useState(0);
  React.useEffect(() => setPaintKey(n => n + 1), [preset]);
  const sp = k.selected ? GD.getPlace(k.selected) : null, fp = k.focus ? GD.getPlace(k.focus) : null;
  const first = !k.focus && !k.selected;
  const hs = sp ? GD.houseOf(sp) : null;
  const sheet = sp ? 'place' : fp ? 'strip' : null;
  const peek = sheet === 'place' ? (sp.deva ? 296 : 336) : sheet === 'strip' ? 200 : 0;
  const nm = fp ? GD.nameIn(fp, k.script) : null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', color: 'var(--text)', overflow: 'hidden', fontFamily: 'var(--font-latin)' }}>
      <GoaMap key={'p' + paintKey} focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot} insetTop={first ? 176 : 72} insetBottom={sheet ? peek + 8 : 108} paintIn={!!P0.intro} />
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, zIndex: 'var(--z-chrome)', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {k.focus || k.selected
            ? <IconButton icon="arrow-left" label={fp && fp.parent && fp.parent !== 'goa' ? 'Back to ' + GD.getPlace(fp.parent).official : 'Back to Goa'} onClick={k.back} />
            : <button type="button" onClick={k.openMore} aria-label="About Khoim" style={{ border: 0, background: 'transparent', padding: '4px 6px', borderRadius: 'var(--radius-m)', cursor: 'pointer' }}><Wordmark size={22} /></button>}
          {nm && <span lang={nm.kind === 'deva' ? 'gom' : undefined} style={{ font: `var(--weight-strong) 18px/1.5 ${nm.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`, whiteSpace: 'nowrap', background: 'var(--surface)', padding: '0 6px', borderRadius: 'var(--radius-s)' }}>{nm.text}</span>}
        </div>
        <div style={{ pointerEvents: 'auto' }}><ScriptToggle value={k.script} onChange={k.setScript} width={206} /></div>
      </header>
      <h1 aria-hidden={!first} style={{ position: 'absolute', top: 76, left: 20, right: 36, margin: 0, font: 'var(--weight-strong) var(--size-title)/var(--lh-title) var(--font-latin)', letterSpacing: 'var(--track-title)', textWrap: 'pretty', pointerEvents: 'none',
        opacity: first ? 1 : 0, visibility: first ? 'visible' : 'hidden', transform: first ? 'none' : 'translateY(-10px)', transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-sheet) var(--ease-out), visibility 0s linear ' + (first ? '0s' : 'var(--dur-base)') }}>Every taluka in Goa, with its Konkani name and how to say it.</h1>

      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 20, zIndex: 5, display: 'grid', gap: 10, opacity: sheet ? 0 : 1, visibility: sheet ? 'hidden' : 'visible', transform: sheet ? 'translateY(20px)' : 'none', transition: 'opacity var(--dur-fast), transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (sheet ? 'var(--dur-fast)' : '0s') }}>
        {first && <p style={{ justifySelf: 'start', margin: 0, font: 'var(--weight-strong) 15px/1.2 var(--font-latin)', background: 'var(--surface-invert)', color: 'var(--text-invert)', padding: '10px 12px', borderRadius: 'var(--radius-m)' }}>Tap a district, or press and drag along Goa</p>}
        <button type="button" onClick={k.openSearch} style={{ height: 58, borderRadius: 'var(--radius-l)', border: 0, background: 'var(--surface-raised)', boxShadow: 'var(--shadow-2)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', font: 'var(--weight-regular) 18px/1 var(--font-latin)', color: 'var(--text)', cursor: 'pointer' }}>
          <Icon name="search" size={20} />Search any name, any script
        </button>
      </div>

      {sheet === 'place' && <Sheet key={'s' + k.selected} label={sp.official} snap={k.snap} onSnap={k.setSnap} peek={peek} bg={hs.bg} ink={hs.on}>
        <PlaceCard place={sp} expanded={k.snap === 'full'} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onGoInside={k.goInside} onSuggest={k.openMore} style={{ padding: '0 16px 28px' }} />
      </Sheet>}
      {sheet === 'strip' && <Sheet key={'t' + k.focus} label={'Places in ' + fp.official} snap="peek" onSnap={s => s === 'closed' && k.back()} peek={peek}>
        <PlaceStrip parent={k.focus} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} />
      </Sheet>}
      <KhoimSearchScreen k={k} />
      <KhoimMore open={k.more} onClose={k.closeMore} theme={theme} onTheme={onTheme} layer={k.layer} onLayer={k.setLayer} />
      <Announcer text={k.announce} />
    </div>
  );
}

function KhoimDesktop({ preset = 1, theme, onTheme }) {
  const { GoaMap, ScriptToggle, IconButton, Wordmark, PlaceCard, PlaceStrip, SearchField, SearchResults, DraftBanner, Credit, KhoimData: GD } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const sp = k.selected ? GD.getPlace(k.selected) : null, fp = k.focus ? GD.getPlace(k.focus) : null;
  const hs = sp ? GD.houseOf(sp) : null;
  const trail = GD.trailOf(k.focus || 'goa');
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', color: 'var(--text)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', fontFamily: 'var(--font-latin)' }}>
      <DraftBanner onTellUs={k.openMore} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 460px', minHeight: 0 }}>
        <main style={{ position: 'relative', minWidth: 0 }}>
          <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot} insetTop={96} insetBottom={fp ? 170 : 24} insetLeft={fp ? 0 : 360} paintIn={!!P0.intro} />
          <header style={{ position: 'absolute', top: 20, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button type="button" onClick={() => k.goTo(null)} aria-label="Khoim, all of Goa" style={{ border: 0, background: 'transparent', padding: 4, borderRadius: 'var(--radius-m)', cursor: 'pointer' }}><Wordmark size={26} /></button>
              <nav aria-label="Where you are" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {trail.length > 1 && trail.map((t, i) => <React.Fragment key={t.id}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" aria-current={i === trail.length - 1 ? 'page' : undefined} onClick={() => k.goTo(t.id === 'goa' ? null : t.id)} style={{ border: 0, background: 'transparent', color: 'var(--text)', padding: '8px 6px', borderRadius: 'var(--radius-s)', font: 'var(--weight-strong) 16px/1.4 var(--font-latin)', textDecoration: i < trail.length - 1 ? 'underline' : 'none', textUnderlineOffset: 4, cursor: 'pointer' }}>{t.official}</button></React.Fragment>)}
              </nav>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <ScriptToggle value={k.script} onChange={k.setScript} />
              <IconButton icon="layers" label="Layers and about" onClick={k.openMore} />
            </div>
          </header>
          {!fp && !sp && <div style={{ position: 'absolute', left: 32, top: 120, width: 330, display: 'grid', gap: 16 }}>
            <h1 style={{ margin: 0, font: 'var(--weight-strong) 40px/1.1 var(--font-latin)', letterSpacing: 'var(--track-title)', textWrap: 'pretty' }}>Every taluka in Goa, with its Konkani name and how to say it.</h1>
            <p style={{ margin: 0, font: 'var(--weight-regular) var(--size-lead)/1.5 var(--font-latin)' }}>Click a district, or press and drag along Goa. Click again to go inside.</p>
          </div>}
          {fp && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16 }}><PlaceStrip parent={k.focus} script={k.script} active={k.hot || k.selected} onFocusPlace={k.setHot} onPick={k.select} /></div>}
        </main>
        <aside aria-label="Names" style={{ borderLeft: '1px solid var(--line)', background: 'var(--surface-sunk)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', minHeight: 0 }}>
          <div style={{ padding: '20px 24px 12px' }}><SearchField value={k.query} onChange={k.setQuery} onCancel={k.query ? () => k.setQuery('') : undefined} /></div>
          <div style={{ overflowY: 'auto', padding: '4px 24px 20px' }}>
            {k.query ? <SearchResults query={k.query} onPick={id => { k.setQuery(''); k.openPlace(id); }} />
              : sp ? <div key={sp.id} style={{ background: hs.bg, color: hs.on, borderRadius: 'var(--radius-sheet)', padding: 'var(--trim-inset)', animation: 'khoim-rise var(--dur-base) var(--ease-out) both' }}>
                  <div style={{ padding: '10px 10px 16px' }}><PlaceCard place={sp} expanded onClose={() => k.setSnap('closed')} onGoInside={k.goInside} onSuggest={k.openMore} headingLevel={2} /></div>
                </div>
              : <p style={{ margin: '8px 4px', font: 'var(--weight-regular) var(--size-body)/1.55 var(--font-latin)' }}>Pick a place on the map to see all its names. Search works in any script: try साश्टी, Saxtti or Salcete.</p>}
          </div>
          <div style={{ padding: '14px 24px 18px', borderTop: '1px solid var(--line)' }}><Credit /></div>
        </aside>
      </div>
      <KhoimMore open={k.more} onClose={k.closeMore} theme={theme} onTheme={onTheme} layer={k.layer} onLayer={k.setLayer} desktop />
      <Announcer text={k.announce} />
    </div>
  );
}
Object.assign(window, { KhoimPhone, KhoimDesktop });
