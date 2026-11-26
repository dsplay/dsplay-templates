// Order in which things fall when the row is too narrow (spec M-014 v2, section 7). The company logo never falls.
// All lengths in rem. `available` is what the headline would get with the current drops.

export const ORDER = ['quote2', 'quote1', 'date', 'weather', 'news', 'clock'];
// Room the headline needs: the thin bar (4.6 rem text) 36 / 40 rem; B, panel and C (2.8 rem text, 3 lines) 24 / 28 rem.
export const LIMITS = { a: { hide: 36, show: 40 }, other: { hide: 24, show: 28 } };
export const limitsOf = (set) => (set === 'a' ? LIMITS.a : LIMITS.other);

/**
 * One step of the fitting: the next level (number of dropped items, in ORDER), 0..ORDER.length.
 * Dropping needs `available` under `limits.hide` (under 0 for the clock: nothing else is left to give);
 * bringing the last dropped item back needs the headline to keep `limits.show` afterwards (hysteresis: no blinking).
 * @param {number} level
 * @param {number} available
 * @param {Object<string, number>} sizes last known width of each item (with its margin), rem
 * @param {{ hide: number, show: number }} [limits]
 */
export function nextLevel(level, available, sizes, limits = LIMITS.a) {
  if (level < ORDER.length) {
    const next = ORDER[level];
    if (available < (next === 'clock' ? 0 : limits.hide)) {
      return level + 1;
    }
  }
  if (level > 0) {
    const item = ORDER[level - 1];
    const cost = item === 'news' ? 0 : (sizes[item] || 0);
    if (available - cost >= (item === 'clock' ? 0 : limits.show)) {
      return level - 1;
    }
  }
  return level;
}

export const droppedAt = (level) => ORDER.slice(0, level);
