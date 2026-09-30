/* About, help and layers: the "More" screen. Copy from the current draft site, verbatim where it existed. */
function KhoimMore({ open, onClose, theme, onTheme, layer, onLayer, desktop }) {
  const { LayerSwitch, Credit, DraftBanner, Wordmark, IconButton, Button } = KN;
  const h2 = { margin: '0 0 8px', font: 'var(--weight-strong) 24px/1.25 var(--font-latin)' };
  const p = { margin: '0 0 12px', font: 'var(--weight-regular) var(--size-body)/1.55 var(--font-latin)', maxWidth: '60ch', textWrap: 'pretty' };
  const sec = { padding: '24px 0', borderTop: '1px solid var(--line)' };
  const roles = [
    ['Konkani reviewers', 'Look over the Konkani names for your taluka in Devanagari or Romi. Fix what\'s wrong and tell us how your family says it. A phone is enough.'],
    ['Voice recorders', 'Record yourself saying the names of your village and the places around it. A phone in a quiet room works. Older voices especially welcome. Credit is optional.'],
    ['Archivists, musicians', 'Send old maps, gazetteers or parish registers showing how a place name was spelt over time. If you sing mando or dulpod, tell us where songs belong.'],
    ['Developers, designers', 'The data is open. We need the map to work offline and on slow networks, and Devanagari and Romi to read well on older budget Android phones.']
  ];
  return (
    <div role="dialog" aria-modal="true" aria-label="About Khoim" aria-hidden={!open} style={{ position: 'absolute', inset: 0, zIndex: 'var(--z-search)', background: 'var(--surface)', color: 'var(--text)', display: 'grid', gridTemplateRows: 'auto minmax(0,1fr)',
      transform: open ? 'none' : 'translateY(104%)', visibility: open ? 'visible' : 'hidden', transition: 'transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (open ? '0s' : 'var(--dur-sheet)') }}>
      <DraftBanner onTellUs={() => {}} />
      <div style={{ overflowY: 'auto', padding: desktop ? '24px 48px 48px' : '16px var(--gutter) 40px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <Wordmark size={40} />
            <div style={{ display: 'flex', gap: 8 }}>
              <IconButton icon={theme === 'dark' ? 'sun' : 'moon'} label={theme === 'dark' ? 'Use light colours' : 'Use dark colours'} onClick={onTheme} />
              <IconButton icon="x" label="Close" onClick={onClose} />
            </div>
          </div>
          <p style={{ ...p, marginTop: 4, fontSize: 'var(--size-lead)' }}>Khoim means "where" in Konkani. Every taluka in Goa, with its Konkani name and how to say it.</p>
          <section style={sec} aria-labelledby="k-layers"><h2 id="k-layers" style={h2}>Layers</h2><p style={p}>Names are live. The rest are coming, one at a time, each credited to the people who give them.</p><LayerSwitch value={layer} onChange={onLayer} /></section>
          <section style={sec} aria-labelledby="k-why"><h2 id="k-why" style={h2}>Why Khoim</h2>
            <p style={p}>Most places in Goa have an official spelling and a Konkani name, and the two often don't match. Canacona is <span lang="gom" style={{ fontFamily: 'var(--font-deva)' }}>काणकोण</span>, written Kannkonn in Romi. Many official spellings come from Portuguese-era records and are what you see on boards, maps and bills.</p>
            <p style={p}>If you grew up here you know both. A Goan kid growing up in Pune or Toronto often doesn't, and neither does someone who moved here last year.</p></section>
          <section style={sec} aria-labelledby="k-src"><h2 id="k-src" style={h2}>Where the names come from</h2>
            <p style={p}>District, taluka and village names and boundaries come from the Local Government Directory (LGD) of the Government of India, spelt exactly as the government spells them.</p>
            <p style={p}>The Konkani names for districts and talukas come from the district websites of Goa and published Konkani sources. For Bardez, Tiswadi, Salcete, Quepem and South Goa those sources differ, and each of those cards says so. Dharbandora shows only its official name until the Directorate of Official Language confirms the Konkani.</p>
            <p style={p}>The pronunciation guides are our own rough respellings. No Konkani speaker has checked them yet.</p></section>
          <section style={sec} aria-labelledby="k-scripts"><h2 id="k-scripts" style={h2}>A note on scripts</h2>
            <p style={p}>Konkani is written in Devanagari, the official script under the Goa, Daman and Diu Official Language Act, 1987, and in Romi, the Roman script used in church, in tiatr and in many homes. Khoim shows Devanagari and Romi side by side and doesn't pick between them.</p></section>
          <section style={sec} aria-labelledby="k-help"><h2 id="k-help" style={h2}>Help us</h2>
            <p style={p}>Write to us at <strong>hello@khoim.in</strong>. Everyone who contributes is credited by name, if they want to be.</p>
            <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr 1fr' : '1fr', gap: 10, margin: '8px 0 16px' }}>
              {roles.map(([t, d]) => <article key={t} style={{ background: 'var(--surface-raised)', borderRadius: 'var(--radius-l)', padding: '14px 16px' }}><h3 style={{ margin: '0 0 4px', font: 'var(--weight-strong) 18px/1.3 var(--font-latin)' }}>{t}</h3><p style={{ ...p, margin: 0, fontSize: 16 }}>{d}</p></article>)}
            </div>
            <Button icon="mail" onClick={() => {}}>Write to us</Button></section>
          <section style={sec}><Credit full /></section>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { KhoimMore });
