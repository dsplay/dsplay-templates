// Writes `src/components/fire-map/states.json`, the first-level subdivisions (states, provinces) the map draws inside a country or a radius, from
// Natural Earth 1:10m admin-1 (public domain, https://www.naturalearthdata.com). No names: only the lines.
// Usage: node scripts/build-states.mjs <ne_10m_admin_1_states_provinces.geojson>
// The file is `{ "BR": [[lon, lat, lon, lat, ...], ...], ... }`: the outer ring of every subdivision, flattened, simplified and rounded.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { area, simplify } from './simplify.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/components/fire-map/states.json');
const TOLERANCE = 0.1;
const MIN_AREA = 0.4;

const source = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const round = (n) => Math.round(n * 100) / 100;
const out = {};
source.features.forEach((feature) => {
  const code = feature.properties.iso_a2;
  if (/^[A-Z]{2}$/.test(code)) {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    const rings = polygons.map((polygon) => polygon[0]).sort((a, b) => area(b) - area(a));
    rings
      .filter((ring, i) => i === 0 || area(ring) >= MIN_AREA)
      .map((ring) => simplify(ring, TOLERANCE).map(([lon, lat]) => [round(lon), round(lat)]))
      .filter((ring) => ring.length >= 4)
      .forEach((ring) => {
        out[code] = (out[code] || []).concat([ring.flat()]);
      });
  }
});
writeFileSync(OUT, JSON.stringify(out));
console.log(`${Object.keys(out).length} countries`);
