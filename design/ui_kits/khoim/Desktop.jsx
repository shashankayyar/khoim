/* Khoim desktop, 1280 x 800. Map left, 460px panel right. */
function KhoimDesktop({ preset = 1, theme, onTheme }) {
  const { GoaMap, ScriptToggle, IconButton, Wordmark, PlaceCard, PlaceStrip, VillageSheet, SearchField, SearchResults, DraftBanner, Credit, LayerRow, LayerPanel, Breadcrumb, TapHint, Toast, Button, VillageTable, KhoimData: GD } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const sp = k.selected ? GD.getPlace(k.selected) : null, fp = k.focus ? GD.getPlace(k.focus) : null;
  const hs = sp ? GD.houseOf(sp) : null;
  const layered = k.layer.id !== 'names';
  const first = !fp && !sp && !layered;
  const copy = () => { try { navigator.clipboard && navigator.clipboard.writeText(GD.layerUrl(sp, layered && !sp ? k.layer : null)); } catch (e) {} k.toastOn('Link copied'); };
  React.useEffect(() => { if (P0.share) copy(); }, [preset]);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', color: 'var(--text)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)', fontFamily: 'var(--font-latin)' }}>
      <DraftBanner onTellUs={k.openMore} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 460px', minHeight: 0 }}>
        <main style={{ position: 'relative', minWidth: 0 }}>
          <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} layer={k.layer} onSelect={k.pick} onHot={k.setHot} insetTop={140} insetBottom={fp && !layered ? 170 : 24} insetLeft={first ? 360 : 0} paintIn={!!P0.intro} />
          <header style={{ position: 'absolute', top: 16, left: 24, right: 24, display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <button type="button" onClick={() => k.goTo(null)} aria-label="Khoim, all of Goa" style={{ border: 0, background: 'transparent', padding: 4, borderRadius: 'var(--radius-m)', cursor: 'pointer' }}><Wordmark size={26} /></button>
                {(fp || sp) && <Breadcrumb id={k.selected || k.focus} script={k.script} onNavigate={k.goTo} />}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><ScriptToggle value={k.script} onChange={k.setScript} /><IconButton icon="info" label="About and help" onClick={k.openMore} /></div>
            </div>
            <LayerRow value={k.layer.id} onChange={k.setLayer} style={{ padding: '2px 0 6px' }} />
          </header>
          {first && <div style={{ position: 'absolute', left: 28, top: 170, width: 330, display: 'grid', gap: 16 }}>
            <h1 style={{ margin: 0, font: 'var(--weight-strong) 40px/1.1 var(--font-latin)', letterSpacing: 'var(--track-title)', textWrap: 'pretty' }}>Every taluka in Goa, with its Konkani name and how to say it.</h1>
            {P0.demo && !k.tapped && <TapHint text="Click any taluka" />}
          </div>}
          {fp && !layered && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'grid', gap: 4 }}>
            <PlaceStrip parent={k.focus} script={k.script} active={k.hot || k.selected} onFocusPlace={k.setHot} onPick={k.select} />
            {fp.level === 'taluka' && <div style={{ padding: '0 20px' }}><Button variant="ghost" size="m" icon="list" onClick={k.openTable}>See all as a list</Button></div>}
          </div>}
          {k.table && fp && <div role="region" aria-label={'Villages in ' + fp.official} style={{ position: 'absolute', inset: '128px 0 0 0', background: 'var(--surface)', overflowY: 'auto', padding: '8px 28px 32px', animation: 'khoim-rise var(--dur-base) var(--ease-out) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}><IconButton icon="arrow-left" label="Back to the map" onClick={k.closeTable} /><h1 style={{ margin: 0, font: 'var(--weight-strong) 28px/1.2 var(--font-latin)' }}><span lang="gom" style={{ fontFamily: 'var(--font-deva)', lineHeight: 1.5, marginRight: 12 }}>{fp.deva}</span>{'Villages in ' + fp.official}</h1></div>
            <VillageTable taluka={fp.id} onPick={id => { k.closeTable(); k.select(id); }} /></div>}
          {k.toast && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 24, display: 'grid', placeItems: 'center' }}><Toast text={k.toast} /></div>}
        </main>
        <aside aria-label="Names" style={{ borderLeft: '1px solid var(--line)', background: 'var(--surface-sunk)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr) auto', minHeight: 0 }}>
          <div style={{ padding: '18px 24px 12px' }}><SearchField value={k.query} onChange={k.setQuery} onCancel={k.query ? () => k.setQuery('') : undefined} /></div>
          <div style={{ overflowY: 'auto', padding: '4px 24px 20px' }}>
            {k.query ? <SearchResults query={k.query} onPick={id => { k.setQuery(''); k.openPlace(id); }} />
              : sp ? <div key={sp.id} style={{ background: hs.bg, color: hs.on, borderRadius: 'var(--radius-sheet)', padding: 'var(--trim-inset)', animation: 'khoim-rise var(--dur-base) var(--ease-out) both' }}>
                  <div style={{ padding: '10px 10px 16px' }}>{sp.level === 'village'
                    ? <VillageSheet place={sp} expanded onClose={() => k.setSnap('closed')} onShare={copy} onSuggest={k.openMore} onRecord={k.openMore} onPickPlace={k.select} />
                    : <PlaceCard place={sp} expanded onClose={() => k.setSnap('closed')} onGoInside={k.goInside} onSuggest={k.openMore} />}</div></div>
              : layered ? <div style={{ margin: '0 -20px' }}><h2 style={{ margin: '4px 20px 12px', font: 'var(--weight-strong) 22px/1.3 var(--font-latin)' }}>{GD.MAP_LAYERS.find(x => x.id === k.layer.id).label}</h2><LayerPanel layer={k.layer} onChange={k.setLayer} onShare={copy} onPickPlace={k.openPlace} onHelp={k.openMore} /></div>
              : <p style={{ margin: '8px 4px', font: 'var(--weight-regular) var(--size-body)/1.55 var(--font-latin)' }}>Pick a place on the map to see all its names. Search works in any script: try साश्टी, Saxtti or Salcete.</p>}
          </div>
          <div style={{ padding: '14px 24px 18px', borderTop: '1px solid var(--line)' }}><Credit /></div>
        </aside>
      </div>
      <KhoimMore open={k.more} onClose={k.closeMore} theme={theme} onTheme={onTheme} layer="names" onLayer={() => {}} desktop />
      <Announcer text={k.announce} />
    </div>
  );
}
Object.assign(window, { KhoimDesktop });
