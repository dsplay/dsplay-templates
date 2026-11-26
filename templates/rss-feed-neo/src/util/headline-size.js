// Largest headline size (rem) that fits the box, between `max` and `min`; at `min` the text is clamped with an ellipsis.
// The width of a character is estimated (Oswald is narrow, about 0.45 em); the layout clamps the lines either way.

const CHAR_WIDTH_EM = 0.45;
const DEFAULT_LINE_HEIGHT = 1.15;
const STEP = 0.2;

export function linesNeeded(text, size, widthRem) {
  const perLine = Math.max(1, Math.floor(widthRem / (size * CHAR_WIDTH_EM)));
  const words = String(text).split(' ');
  let lines = 1;
  let used = 0;
  for (let i = 0; i < words.length; i += 1) {
    const len = words[i].length;
    if (used === 0) {
      used = len;
      lines += Math.floor((len - 1) / perLine);
      used = len % perLine || perLine;
    } else if (used + 1 + len <= perLine) {
      used += 1 + len;
    } else {
      lines += 1;
      lines += Math.floor((len - 1) / perLine);
      used = len % perLine || perLine;
    }
  }
  return lines;
}

/**
 * @param {string} text
 * @param {object} box
 * @param {number} box.width rem
 * @param {number} box.maxLines
 * @param {number} box.max rem, preferred size
 * @param {number} box.min rem, floor
 * @param {number} [box.height] rem; when given, lines are also limited to what fits in it
 */
export default function headlineSize(text, {
  width, maxLines, max, min, height, lineHeight = DEFAULT_LINE_HEIGHT,
}) {
  let limit = maxLines;
  for (let size = max; size >= min - 0.001; size = Math.round((size - STEP) * 100) / 100) {
    if (height) {
      limit = Math.min(maxLines, Math.max(1, Math.floor(height / (size * lineHeight))));
    }
    if (linesNeeded(text, size, width) <= limit) {
      return { size, lines: limit };
    }
  }
  if (height) {
    limit = Math.min(maxLines, Math.max(1, Math.floor(height / (min * lineHeight))));
  }
  return { size: min, lines: limit };
}
