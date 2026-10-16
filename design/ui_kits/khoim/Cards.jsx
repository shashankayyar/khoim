/* Link preview and save-image cards, shown at real proportions. Rendered at build time per place. */
function KhoimCards() {
  const { ShareCard } = KN;
  const Scaled = ({ place, format, scale, label }) => {
    const W = { og: 1200, square: 1080, story: 1080 }[format], H = { og: 630, square: 1080, story: 1920 }[format];
    return <figure style={{ margin: 0, display: 'grid', gap: 8, alignContent: 'start' }}>
      <div style={{ width: W * scale, height: H * scale, overflow: 'hidden', borderRadius: 10, boxShadow: '0 6px 24px rgba(22,18,12,.18)' }}><div style={{ transform: 'scale(' + scale + ')', transformOrigin: '0 0' }}><ShareCard place={place} format={format} /></div></div>
      <figcaption style={{ font: '600 14px/1.4 "Anek Latin"' }}>{label}</figcaption></figure>;
  };
  return (
    <div style={{ display: 'grid', gap: 28, padding: 8, maxWidth: 1180 }}>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Scaled place="canacona" format="og" scale={0.5} label="Link preview, 1200 x 630. Canacona: Devanagari and Romi" />
        <Scaled place="v626704" format="og" scale={0.5} label="Link preview, Aldona: no Romi yet, so it is left out" />
      </div>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Scaled place="canacona" format="og" scale={0.25} label="At WhatsApp thumbnail size, 300px" />
        <Scaled place="v626925" format="og" scale={0.25} label="Raia: official name only" />
        <Scaled place="canacona" format="square" scale={0.3} label="My village in Konkani, square 1080" />
        <Scaled place="v626704" format="story" scale={0.24} label="Tall, 1080 x 1920, for status and stories" />
      </div>
    </div>
  );
}
Object.assign(window, { KhoimCards });
