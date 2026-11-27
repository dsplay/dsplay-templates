// Font size (rem) that makes `text` fit a box without measuring the DOM: per-character width estimates for Roboto.
// A little pessimistic on purpose; what still does not fit is cut with an ellipsis by the CSS.

const NARROW = /[il.,:;'|!1() [\]]/;
const WIDE = /[mwMW@%]/;
const CAPS = /[A-Z0-9]/;

export function textEm(text, bold) {
  const extra = bold ? 0.03 : 0;
  return String(text).split('').reduce((sum, c) => {
    if (NARROW.test(c)) return sum + 0.28;
    if (WIDE.test(c)) return sum + 0.88 + extra;
    if (CAPS.test(c)) return sum + 0.62 + extra;
    return sum + 0.54 + extra;
  }, 0);
}

export const LINE_HEIGHT = 1.15;

/** Largest size in [min, base] (0.1 steps) for which `text` takes at most `lines` lines of `width` x `height` rem. */
export default function fitSize(text, {
  width, height, base, min = 3, lines = 1, bold = true,
}) {
  const em = textEm(text, bold);
  for (let size = base; size >= min; size = Math.round((size - 0.1) * 10) / 10) {
    const needed = Math.ceil((em * size) / width);
    if (needed <= lines && needed * size * LINE_HEIGHT <= height) {
      return size;
    }
  }
  return min;
}
