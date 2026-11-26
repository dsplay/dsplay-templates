export const degrees = (n) => (n === null || n === undefined ? '' : `${n}°`);

/** City font size (rem): the base, reduced by up to two steps (x0.85) when the name would not fit `width` rem; floor 4. */
export function cityFont(city, base, width) {
  let size = base;
  for (let step = 0; step < 2 && String(city).length * size * 0.5 > width; step += 1) {
    size = Math.max(4, Math.round(size * 0.85 * 10) / 10);
  }
  return size;
}
