import React from 'react';
import { ICON_PATHS } from './iconPaths.js';
export function Icon({ name, size = 20, strokeWidth = 2, label, style }) {
  const inner = ICON_PATHS[name] || '';
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false" style={{ flex: '0 0 auto', display: 'block', ...style }} dangerouslySetInnerHTML={{ __html: inner }} />;
}
