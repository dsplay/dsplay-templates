// What the ticker shows and how fast it moves (spec M-013 v2, sections 7 and 8). Pure functions.
import plainText from './text';

export const MAX_HEADLINE = 100;
export const MAX_COPY_CHARS = 600;
export const DEFAULT_LIMIT = 8;

// design-screen rem per second; the real px/s scale with the screen (1 rem = html font-size)
export const SPEEDS = { slow: 6, normal: 8, fast: 10 };

export const speedOf = (name) => SPEEDS[name] || SPEEDS.normal;

/** `ticker_text`: items separated by "|", as plain text. */
export function splitTexts(value) {
  return String(value || '').split('|').map((part) => plainText(part).trim()).filter(Boolean);
}

/** A headline over 100 characters is cut at a word with an ellipsis. */
export function clip(text, max = MAX_HEADLINE) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) {
    return value;
  }
  const cut = value.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s.,;:!?-]+$/, '')}…`;
}

/** 1-30, anything else is 8. */
export function limitOf(value) {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) && n >= 1 && n <= 30 ? n : DEFAULT_LIMIT;
}

/** The last items are dropped when one copy would pass 600 characters (the first item always stays). */
export function capChars(items, max = MAX_COPY_CHARS) {
  const out = [];
  let total = 0;
  items.forEach((item) => {
    if (out.length === 0 || total + item.length <= max) {
      out.push(item);
      total += item.length;
    }
  });
  return out;
}

/**
 * @param {object} p
 * @param {string} p.source 'text' | 'rss' | 'both'
 * @param {string} p.text raw `ticker_text`
 * @param {string[]} p.feed headlines already fetched
 * @param {number} p.limit
 * @returns {string[]} plain text items, text first
 */
export function buildItems({
  source, text, feed, limit,
}) {
  const fromText = source === 'rss' ? [] : splitTexts(text);
  const fromFeed = source === 'text' ? [] : (feed || []).map(plainText).filter(Boolean);
  const all = fromText.concat(fromFeed).map((item) => clip(item));
  return capChars(all.slice(0, limitOf(limit)));
}

/** Seconds for one copy to pass at `remPerSecond`; null while the copy has no width yet. */
export function durationOf(copyWidthPx, remPerSecond, remPx) {
  const speed = remPerSecond * remPx;
  if (!(copyWidthPx > 0) || !(speed > 0)) {
    return null;
  }
  return copyWidthPx / speed;
}

/** How many times the base set repeats so that ONE copy is at least as wide as the viewport. */
export function repsFor(unitWidth, viewportWidth) {
  if (!(unitWidth > 0)) {
    return 1;
  }
  return Math.max(1, Math.ceil(viewportWidth / unitWidth));
}

/** Detects CSS animation support, with or without the prefix. */
export function supportsAnimation(style) {
  return Boolean(style && ('animation' in style || 'WebkitAnimation' in style));
}
