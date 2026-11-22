import BR_STATE_CENTERS from './br-state-centers';
import { BR_STATES, countryName } from '../main/model';

// Pure helpers of the map's names: which countries and states are written where, for a box of a given size and a given zoom.

/** A letter is about this wide, as a share of the font size (a condensed sans-serif; a little generous so that names do not touch). */
const CHAR_WIDTH = 0.58;
const LINE_HEIGHT = 1.25;
/** States are named only when a degree is at least this many pixels (about a country or a few hundred kilometres across, not a continent). */
export const MIN_STATE_SCALE = 6;

/** The font size of the names for a box of this width, in pixels. */
export const baseFontSize = (width) => Math.max(9, Math.min(18, Math.round(width / 75)));

const textWidth = (text, size) => text.length * size * CHAR_WIDTH;

function ringBox(ring) {
  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;
  for (let i = 0; i < ring.length; i += 2) {
    west = Math.min(west, ring[i]);
    east = Math.max(east, ring[i]);
    south = Math.min(south, ring[i + 1]);
    north = Math.max(north, ring[i + 1]);
  }
  return {
    west, south, east, north, area: (east - west) * (north - south),
  };
}

function ringCentroid(ring) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  const n = ring.length / 2;
  for (let i = 0; i < n; i += 1) {
    const j = (i + n - 1) % n;
    const x0 = ring[j * 2];
    const y0 = ring[j * 2 + 1];
    const x1 = ring[i * 2];
    const y1 = ring[i * 2 + 1];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  if (area === 0) return { lon: ring[0], lat: ring[1] };
  return { lon: cx / (3 * area), lat: cy / (3 * area) };
}

/** Where to write a country's name and how big it is on the screen: the centroid of its biggest part, and that part's box. */
export function countryAnchor(rings) {
  let best = null;
  rings.forEach((ring) => {
    const box = ringBox(ring);
    if (!best || box.area > best.box.area) best = { ring, box };
  });
  if (!best) return null;
  const { lon, lat } = ringCentroid(best.ring);
  return { lon, lat, box: best.box };
}

const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * Keeps the names that fit: the more important first, none that falls outside the box and none that would sit on one already kept. Each candidate is
 * `{ key, text, x, y, size, priority, kind }`; the result is the same objects, in the order they were kept.
 */
export function placeLabels(candidates, width, height) {
  const kept = [];
  const rects = [];
  [...candidates].sort((a, b) => b.priority - a.priority).forEach((label) => {
    const halfW = textWidth(label.text, label.size) / 2;
    const halfH = (label.size * LINE_HEIGHT) / 2;
    const rect = {
      left: label.x - halfW, right: label.x + halfW, top: label.y - halfH, bottom: label.y + halfH,
    };
    const inside = rect.left >= 0 && rect.right <= width && rect.top >= 0 && rect.bottom <= height;
    if (inside && !rects.some((other) => overlaps(rect, other))) {
      kept.push(label);
      rects.push(rect);
    }
  });
  return kept;
}

/**
 * The names to write on the map. A country is named when its biggest part is wider on the screen than its name, so a continent shows its countries and
 * a close view shows only the ones it holds; the country of a country scope is named bigger and first. Brazil's states are named in a close view (the
 * only subdivisions the service ranks today). `project` is the map's projection (`projection()` of the model).
 */
export function buildLabels({
  outlines, project, width, height, scope, language, cities = [], place = null,
}) {
  const base = baseFontSize(width);
  const candidates = [];
  Object.entries(outlines || {}).forEach(([code, rings]) => {
    const anchor = countryAnchor(rings);
    if (anchor) {
      const isScope = scope && scope.type === 'country' && scope.country === code;
      const text = countryName(code, language);
      const size = isScope ? Math.round(base * 1.4) : base;
      const spanPx = (anchor.box.east - anchor.box.west) * project.scale;
      if (isScope || spanPx >= textWidth(text, size)) {
        candidates.push({
          key: `c-${code}`,
          text,
          x: project.x(anchor.lon),
          y: project.y(anchor.lat),
          size,
          kind: isScope ? 'scope' : 'country',
          priority: isScope ? 1000 : Math.min(anchor.box.area, 900),
        });
      }
    }
  });
  if (scope && scope.type !== 'world' && project.scale >= MIN_STATE_SCALE) {
    Object.entries(BR_STATE_CENTERS).forEach(([code, [lat, lon]]) => {
      candidates.push({
        key: `s-${code}`,
        text: BR_STATES[code],
        x: project.x(lon),
        y: project.y(lat),
        size: Math.round(base * 0.95),
        kind: 'state',
        priority: 2000,
      });
    });
  }
  if (scope && scope.type !== 'world') {
    // a city is a dot with its name above it; the place the media is about is written first, bigger and bright
    const pin = Math.max(3, Math.round(base * 0.3));
    cities.forEach((city) => {
      if (!place || city.name !== place.name) {
        candidates.push({
          key: `t-${city.name}`,
          text: city.name,
          x: project.x(city.lon),
          y: project.y(city.lat) - base * 0.9,
          dotX: project.x(city.lon),
          dotY: project.y(city.lat),
          size: Math.round(base * 0.85),
          kind: 'city',
          priority: 3000 + Math.min(city.population / 10000, 900),
        });
      }
    });
    if (place) {
      candidates.push({
        key: 'p-place',
        text: place.name,
        x: project.x(place.lon),
        y: project.y(place.lat) - base * 1.2 - pin,
        dotX: project.x(place.lon),
        dotY: project.y(place.lat),
        size: Math.round(base * 1.1),
        kind: 'place',
        priority: 9000,
      });
    }
  }
  return placeLabels(candidates, width, height);
}
