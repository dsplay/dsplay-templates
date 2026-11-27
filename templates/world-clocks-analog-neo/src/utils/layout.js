import { WELL_MIN_DIAMETER } from './dial';

// Layout in three bands (M-011 §0.9): logo on top (centred), world map in the middle, clocks at the bottom. Sizes in
// rem on the design screen of each format (1 rem = 10 px), 4 rem margin on the edges; diameters from the §0.9 table.
const LANDSCAPE = {
  rows: [[1], [2], [3], [4]],
  d: [40, 38, 34, 30],
};
const PORTRAIT = {
  rows: [[1], [2], [2, 1], [2, 2]],
  d: [56, 38, 36, 36],
};
const SQUARE = {
  rows: [[1], [2], [3], [2, 2]],
  d: [40, 34, 24, 24],
};
const GRIDS = { landscape: LANDSCAPE, portrait: PORTRAIT, square: SQUARE };

// usable area (screen minus the 4 rem margin), height of the logo band and of the logo itself, and the width of
// the map box at 100% (the screen width, 3:2 box)
const AREA = { landscape: [184, 100], portrait: [100, 184], square: [100, 100] };
const LOGO_BAND = { landscape: [12, 8], portrait: [16, 10], square: [10, 6] };
const MAP_BASIS = { landscape: 192, wide: 192, portrait: 108, square: 108 };
const MAP_RATIO = 2602 / 1734; // the viewBox of the map
const MAP_DRAWING_HEIGHT = 0.73; // the drawing fills ~73% of the height of the box
const MAP_SCALE = 0.7; // "30% smaller"
export const MAP_MIN_SCALE = 0.4; // below this the map goes behind the clocks
const ROW_GAP = 3; // between rows
const MAP_MARGIN = 4; // between the map and the clocks
export const CELL_EXTRA = 6; // the cell is D + 6 high (hour below the face)

// M-011 §0.5: the numerals follow the face size D (the name inside the face takes the room between 4 and 8, so
// all 12 numerals only fit from D = 56)
export const FULL_NUMERALS_DIAMETER = 56;
export const QUARTER_NUMERALS_DIAMETER = 21;

const ALL_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/**
 * Which marks a face of diameter `d` (rem) gets: D >= 56 all 12 numerals; 21 <= D < 56 only 12/3/6/9;
 * below 21 only the 12 dots; the bar slices (`strip`) draw just 4 dots.
 * @param {number} d
 * @param {boolean} strip
 * @returns {{ marks: 'all'|'dots'|'icon', numeralHours: number[] }}
 */
export function marksFor(d, strip) {
  if (strip) return { marks: 'icon', numeralHours: [] };
  if (d >= FULL_NUMERALS_DIAMETER) return { marks: 'all', numeralHours: ALL_HOURS };
  if (d >= QUARTER_NUMERALS_DIAMETER) return { marks: 'all', numeralHours: [0, 3, 6, 9] };
  return { marks: 'dots', numeralHours: [] };
}

/** Height (rem) of the bottom band: the rows of cells (D + 6 each) and the 3 rem between them. */
export function bottomHeight(rows, d) {
  return rows.length * (d + CELL_EXTRA) + (rows.length - 1) * ROW_GAP;
}

/** How many cities the format can show (the logo no longer takes a cell). */
export function maxCities(format) {
  return format === 'square' ? 4 : 8;
}

/**
 * The map: flat on the base of the screen (no frame, no shadow), at the largest scale that fits the middle band (at
 * most 70%, at least 40%); when even that does not fit it goes `behind` the clocks at 70%. Centred in the band.
 * @param {string} format
 * @param {number} middle height (rem) of the middle band
 */
function mapPlan(format, middle) {
  const basis = MAP_BASIS[format];
  const drawing = MAP_DRAWING_HEIGHT * (basis / MAP_RATIO);
  const fit = middle / drawing;
  if (fit < MAP_MIN_SCALE) return { mode: 'behind', scale: MAP_SCALE, basis };
  return { mode: 'flat', scale: Math.min(MAP_SCALE, fit), basis };
}

/**
 * @param {string} format
 * @param {number} count cities that will be shown (already capped by `maxCities`)
 * @param {boolean} hasLogo
 * @returns {{ rows: number[], d: number, well: boolean, logo: {band: number, height: number}, map: {mode: string, scale: number,
 * basis: number} | null }} `rows` has the cities per row, bottom band; `logo.band` is 0 without a logo, on the wide
 * format and on the bars; `map` is null on the bars.
 */
export default function layoutFor(format, count, hasLogo) {
  const noLogo = { band: 0, height: 0 };
  if (format === 'strip-h') return { rows: [count], d: 4.2, well: false, logo: noLogo, map: null };
  if (format === 'strip-v') return { rows: [count], d: Math.min(16, 192 / count - 10), well: false, logo: noLogo, map: null };
  if (format === 'wide') {
    // one row over the map; D = 0.78 of the slot, between 19 and 28
    const d = Math.max(19, Math.min(28, (0.78 * 184) / count));
    // the map is a flat watermark behind the discs: no well anywhere on the wide format
    return { rows: [count], d, well: false, logo: noLogo, map: { mode: 'behind', scale: MAP_SCALE, basis: MAP_BASIS.wide } };
  }

  const grid = GRIDS[format];
  const n = Math.max(1, Math.min(grid.rows.length, count));
  const rows = grid.rows[n - 1];
  const d = grid.d[n - 1];
  const [band, height] = hasLogo ? LOGO_BAND[format] : [0, 0];
  const logo = { band, height };
  const middle = AREA[format][1] - band - bottomHeight(rows, d) - MAP_MARGIN;
  return {
    rows, d, well: d >= WELL_MIN_DIAMETER, logo, map: mapPlan(format, middle),
  };
}
