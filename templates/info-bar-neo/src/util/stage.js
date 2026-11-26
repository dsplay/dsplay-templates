// The design screen of each layout, in rem (spec M-014 v2, section 1). Bars are 12 rem tall.
// Sets: a = thin bar (< 70 px tall), b = bar, p = panel with one row, c = panel with two rows (portrait, square), v = vertical bar.

export const BAR_REM = 12;

/** Set of a window: the classification of F-002 by proportion, then by real height for the horizontal bars. */
export function setOf(width, height) {
  const ratio = width / Math.max(1, height);
  if (ratio >= 6) {
    return height < 70 ? 'a' : 'b';
  }
  if (ratio <= 1 / 6) {
    return 'v';
  }
  if (ratio < 1.2) {
    return 'c';
  }
  return 'p';
}

/**
 * @returns {{ set: string, remPx: number, w: number, h: number }} `w`/`h`: the window in rem
 */
export default function stageOf(width, height) {
  const set = setOf(width, height);
  let remPx;
  if (set === 'a' || set === 'b') {
    remPx = height / BAR_REM;
  } else if (set === 'v') {
    remPx = height / 192;
  } else if (set === 'c') {
    remPx = Math.min(width / 108, height / 40);
  } else {
    remPx = Math.min(width / 192, height / 20);
  }
  remPx = Math.max(remPx, 0.1);
  return {
    set, remPx, w: width / remPx, h: height / remPx,
  };
}
