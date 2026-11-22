// Writes the two outline files the map draws (`src/components/fire-map/outlines-coarse.json` and `outlines-fine.json`) from Natural Earth 1:50m
// admin-0 countries (public domain, https://www.naturalearthdata.com). No tiles and no key: the map is drawn from these.
// Usage: node scripts/build-outlines.mjs <ne_50m_admin_0_countries.geojson>
// Each file is `{ "BR": [[lon, lat, lon, lat, ...], ...], ... }`: the outer ring of every part of the country, flattened, simplified and rounded.
// The coarse one draws the world (about 10 km, 2 decimals); the fine one draws a country or a radius (about 4 km, 2 decimals). Parts smaller than
// the limit are dropped, but a country always keeps its largest part.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { area, simplify } from './simplify.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/components/fire-map');
const LEVELS = [
  { file: 'outlines-coarse.json', tolerance: 0.1, decimals: 2, minArea: 0.25 },
  { file: 'outlines-fine.json', tolerance: 0.04, decimals: 2, minArea: 0.05 },
];

const source = JSON.parse(readFileSync(process.argv[2], 'utf8'));

for (const { file, tolerance, decimals, minArea } of LEVELS) {
  const factor = 10 ** decimals;
  const round = (n) => Math.round(n * factor) / factor;
  const out = {};
  for (const feature of source.features) {
    const p = feature.properties;
    const code = [p.ISO_A2_EH, p.ISO_A2, p.WB_A2].find((c) => typeof c === 'string' && /^[A-Z]{2}$/.test(c));
    if (code) {
      const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      const rings = polygons.map((polygon) => polygon[0]).sort((a, b) => area(b) - area(a));
      const parts = rings
        .filter((ring, i) => i === 0 || area(ring) >= minArea)
        .map((ring) => simplify(ring, tolerance).map(([lon, lat]) => [round(lon), round(lat)]))
        .filter((ring) => ring.length >= 4)
        .map((ring) => ring.flat());
      if (parts.length > 0) out[code] = (out[code] || []).concat(parts);
    }
  }
  writeFileSync(join(OUT, file), JSON.stringify(out));
  console.log(`${file}: ${Object.keys(out).length} countries`);
}
