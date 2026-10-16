import React from 'react';
import { Icon } from '../core/Icon.jsx';
/* A Villages of Goa episode. Nothing from YouTube loads until someone taps play. */
export function VideoFacade({ video, style }) {
  const [on, setOn] = React.useState(false);
  if (!video) return null;
  const ready = !!video.youtubeId;
  if (on && ready) return <iframe title={video.title} src={'https://www.youtube-nocookie.com/embed/' + video.youtubeId + '?autoplay=1'} allow="autoplay; encrypted-media" allowFullScreen style={{ width: '100%', aspectRatio: '16/9', border: 0, borderRadius: 'var(--radius-l)', ...style }}></iframe>;
  return (
    <div style={{ display: 'grid', gap: 8, ...style }}>
      <button type="button" onClick={() => ready && setOn(true)} aria-disabled={!ready || undefined} aria-label={'Play ' + video.title + ', ' + video.channel + ', on YouTube'}
        style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-l)', border: '2px ' + (ready ? 'solid' : 'dashed') + ' currentColor', background: 'color-mix(in srgb, currentColor 12%, transparent)', cursor: ready ? 'pointer' : 'default', display: 'grid', placeItems: 'center', color: 'inherit' }}>
        {video.thumb && <img src={video.thumb} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-l)' }} />}
        <span style={{ position: 'relative', width: 60, height: 60, borderRadius: 'var(--radius-l)', background: 'var(--glyph-bg)', color: 'var(--glyph-ink)', display: 'grid', placeItems: 'center' }}><Icon name="play" size={26} /></span>
      </button>
      <span style={{ font: 'var(--weight-strong) 18px/1.35 var(--font-latin)' }}>{video.title}</span>
      <span style={{ font: 'var(--weight-regular) 15px/1.45 var(--font-latin)' }}>{video.channel + ' on YouTube. ' + (ready ? 'YouTube loads only when you tap play.' : 'Episode link still to add.')}</span>
    </div>
  );
}
