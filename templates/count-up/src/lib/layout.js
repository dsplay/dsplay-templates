// Pure layout of the timer: how big the digits are, in how many rows the units go and whether the seconds are shown, for a screen of any size.

/** What the stylesheet draws, in em of the digits' font size (a digit box is 0.82 wide and 1.3 tall; see `unit/style.sass`). */
export const DIGIT_WIDTH = 0.82;
export const DIGIT_GAP = 0.06;
export const COLON_WIDTH = 0.34;
export const BOX_HEIGHT = 1.3;
export const LABEL_HEIGHT = 0.45;
export const ROW_GAP = 0.3;

/** The timer may take this much of the width, and this much of the height (the rest is the title and the date and the margins). */
const WIDTH_SHARE = 0.92;
const HEIGHT_SHARE = 0.66;
/**
 * Digits smaller than this are too small to read from afar (40 pixels, or a sixth of the screen's short side when that is more): the seconds are dropped
 * before that happens, so that what is left is big enough.
 */
const MIN_DIGIT_PX = 40;
const MIN_DIGIT_SHARE = 1 / 6;

const unitWidth = (digits) => digits * DIGIT_WIDTH + (digits - 1) * DIGIT_GAP;

const rowWidth = (row) => row.reduce((sum, digits) => sum + unitWidth(digits), 0) + (row.length - 1) * COLON_WIDTH;

const rowsHeight = (rows) => rows * (BOX_HEIGHT + LABEL_HEIGHT) + (rows - 1) * ROW_GAP;

/** Every way to cut `units` into consecutive rows that keeps them in order, from one row to one unit a row. */
export function partitions(units) {
  const out = [];
  const cut = (start, rows) => {
    if (start === units.length) {
      out.push(rows);
      return;
    }
    for (let end = start + 1; end <= units.length; end += 1) cut(end, [...rows, units.slice(start, end)]);
  };
  cut(0, []);
  return out;
}

/** The biggest font size, in pixels, at which the rows fit the box, and what limits it. */
function fit(rows, width, height) {
  const byWidth = (width * WIDTH_SHARE) / Math.max(...rows.map(rowWidth));
  const byHeight = (height * HEIGHT_SHARE) / rowsHeight(rows.length);
  return Math.floor(Math.min(byWidth, byHeight));
}

function best(units, width, height) {
  let pick = null;
  partitions(units).forEach((rows) => {
    const fontSize = fit(rows, width, height);
    const widest = Math.max(...rows.map(rowWidth));
    // the same size in fewer rows reads better, and then in rows of similar width rather than one lone unit
    const better = !pick || fontSize > pick.fontSize
      || (fontSize === pick.fontSize && (rows.length < pick.rows.length || (rows.length === pick.rows.length && widest < pick.widest)));
    if (better) pick = { rows, fontSize, widest };
  });
  return pick;
}

/**
 * The layout for a screen: `units` are the digit counts of days, hours, minutes and seconds (the days have 2 digits or more). It first looks for the best way to
 * show all four; only when the digits would then be too small (`MIN_DIGIT_PX`, `MIN_DIGIT_SHARE`) does it drop the seconds and look again.
 * Returns `{ fontSize, rows, showSeconds }`, where `rows` are lists of unit indexes (0 days, 1 hours, 2 minutes, 3 seconds).
 */
export function pickLayout({ width, height, dayDigits }) {
  const units = [Math.max(2, dayDigits), 2, 2, 2];
  const minFont = Math.max(MIN_DIGIT_PX, MIN_DIGIT_SHARE * Math.min(width, height));
  const all = best(units, width, height);
  const chosen = all.fontSize >= minFont ? { ...all, showSeconds: true } : { ...best(units.slice(0, 3), width, height), showSeconds: false };
  // rows of digit counts to rows of unit indexes
  let next = 0;
  const rows = chosen.rows.map((row) => row.map(() => { const index = next; next += 1; return index; }));
  return { fontSize: Math.max(12, chosen.fontSize), rows, showSeconds: chosen.showSeconds };
}

/** The size of the title and the date for a screen: a share of the short side, so that a long title wraps instead of pushing the timer out. */
export function headerSizes(width, height) {
  const title = Math.max(14, Math.round(Math.min(width * 0.055, height * 0.08)));
  return { title, date: Math.max(11, Math.round(title * 0.45)) };
}
