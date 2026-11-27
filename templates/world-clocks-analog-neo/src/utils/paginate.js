// Pagination (M-011 §0.10): more cities than fit on a page are shown one page at a time. Balanced: every page gets
// ceil(n / pages) cities, in the order of the CMS (5 -> 3+2, 6 -> 3+3, 7 -> 4+3, 8 -> 4+4), so no page has a lone clock.
export const PAGE_FADE_MS = 800;
export const DEFAULT_ZONES_PER_PAGE = 4;
export const DEFAULT_PAGE_INTERVAL = 30; // seconds
export const MIN_PAGE_INTERVAL = 10;
export const MAX_PAGE_INTERVAL = 120;

/**
 * @param {number} value
 * @returns {number} zones per page, 1-4 (anything else: 4)
 */
export function zonesPerPage(value) {
  return Number.isInteger(value) && value >= 1 && value <= 4 ? value : DEFAULT_ZONES_PER_PAGE;
}

/**
 * @param {number} value seconds
 * @returns {number} the interval between page changes, 10-120 s (below/above: clamped; not a number: 30)
 */
export function pageInterval(value) {
  if (!Number.isFinite(value)) return DEFAULT_PAGE_INTERVAL;
  return Math.min(MAX_PAGE_INTERVAL, Math.max(MIN_PAGE_INTERVAL, value));
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} perPage
 * @returns {T[][]} the pages (one page, not paginated, when everything fits)
 */
export default function paginate(items, perPage) {
  if (items.length <= perPage) return [items];
  const pages = Math.ceil(items.length / perPage);
  const size = Math.ceil(items.length / pages);
  return Array.from({ length: pages }, (_, i) => items.slice(i * size, (i + 1) * size)).filter((p) => p.length);
}
