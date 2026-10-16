/* The map's projection, run backwards: from a point on the 1000-wide map plane to latitude and longitude.
   data/scripts/build_geo.py draws the map with x = (lon - minLon) * k * sx and y = (maxLat - lat) * sx,
   where the bounds are those of the LGD taluka file and k = cos(middle latitude). The same bounds are read
   here, so the two always agree. Used for the geo of each place in its structured data. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function openProjection(root) {
  const g = JSON.parse(readFileSync(join(root, 'data/raw/goa_talukas_lgd.geojson'), 'utf8'));
  const b = [Infinity, Infinity, -Infinity, -Infinity];
  const walk = c => {
    if (typeof c[0] === 'number') { b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]); b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]); }
    else c.forEach(walk);
  };
  for (const f of g.features) walk(f.geometry.coordinates);
  const [minLon, minLat, maxLon, maxLat] = b;
  const k = Math.cos((minLat + maxLat) / 2 * Math.PI / 180), sx = 1000 / ((maxLon - minLon) * k);
  return {
    /** [x, y] on the map plane to [latitude, longitude], to about a metre. */
    toLatLon: ([x, y]) => [+(maxLat - y / sx).toFixed(5), +(minLon + x / (k * sx)).toFixed(5)]
  };
}
