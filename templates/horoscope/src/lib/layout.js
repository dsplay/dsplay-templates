// Pure layout: which design plate a screen gets and how big a text can be so that it fits its box, whatever its length.
//
// A style is drawn on a plate (1280 x 720 landscape, 720 x 1280 portrait, 900 x 900 square), in "design pixels" (1 design px = 0.1rem; the Stage sets the
// root font size so that the plate fits the screen). A screen of another shape gets bars of the style's background around the plate.
// The banners are the exception: their plate is 240 design px thick and as long as the real screen asks (4:1 to 10:1 and beyond), so the strip is always filled.

export const PLATES = {
  landscape: { kind: 'landscape', w: 1280, h: 720 },
  portrait: { kind: 'portrait', w: 720, h: 1280 },
  square: { kind: 'square', w: 900, h: 900 },
};

export const BANNER_THICKNESS = 240;
// the long side of a banner plate, in design px: a 4:1 strip is 960 long, a 10:1 one 2400; beyond the maximum the plate stops growing (bars at the ends)
const BANNER_MIN = 960;
const BANNER_MAX = 3000;

/**
 * The plate of a screen format ("landscape", "portrait", "square", "h-banner", "v-banner") on a screen of `width` x `height`. A banner plate is 240 design px
 * thick and as long as the screen's own shape asks, so it fills the strip whatever its ratio; without a size it is a 4:1 strip.
 */
export function plateOf(screenFormat, width, height) {
  if (screenFormat === 'h-banner' || screenFormat === 'v-banner') {
    const ratio = width > 0 && height > 0 ? Math.max(width, height) / Math.min(width, height) : 4;
    const length = Math.max(BANNER_MIN, Math.min(BANNER_MAX, Math.round(BANNER_THICKNESS * ratio)));
    return screenFormat === 'h-banner'
      ? { kind: 'h-banner', w: length, h: BANNER_THICKNESS }
      : { kind: 'v-banner', w: BANNER_THICKNESS, h: length };
  }
  if (screenFormat === 'portrait') return PLATES.portrait;
  if (screenFormat === 'square') return PLATES.square;
  return PLATES.landscape;
}

/** True for the plates of the banner formats (kind "h-banner" or "v-banner"). */
export const isBanner = (kind) => kind === 'h-banner' || kind === 'v-banner';

/**
 * The box of the text on a banner, in design px. Horizontal: the strip minus the fixed columns (`left`: what comes before the text, `right`: what comes after,
 * both with their margins) and its padding. Vertical: the column's width and what is left of the length after the fixed parts (`top`).
 */
export function bannerText(plate, {
  left = 0, right = 0, top = 0, pad = 28, height = 176, max = 44, min = 12,
}) {
  if (plate.kind === 'v-banner') return { w: plate.w - 32, h: plate.h - top, max: 34, min };
  return { w: plate.w - left - right - pad * 2, h: height, max, min };
}

/** How many real pixels one design pixel is on a screen of `width` x `height`. */
export const scaleOf = (plate, width, height) => Math.min(width / plate.w, height / plate.h);

/** Design pixels to rem (the root font size is 10 real pixels per design pixel of scale, see Stage). */
export const rem = (designPx) => `${Math.round(designPx * 100) / 1000}rem`;

/** How many lines a text takes in a box `width` wide at `size`, breaking at spaces; `charWidth` is the average width of a character in em. */
export function countLines(text, width, size, charWidth) {
  const perLine = Math.max(1, Math.floor(width / (size * charWidth)));
  let lines = 1;
  let used = 0;
  String(text).split(/\s+/).filter(Boolean).forEach((word) => {
    // a word longer than a line is cut into lines
    if (word.length > perLine) {
      if (used > 0) lines += 1;
      lines += Math.ceil(word.length / perLine) - 1;
      used = word.length % perLine || perLine;
      return;
    }
    if (used === 0) used = word.length;
    else if (used + 1 + word.length <= perLine) used += 1 + word.length;
    else { lines += 1; used = word.length; }
  });
  return lines;
}

/**
 * The biggest font size, from `max` down to `min` in steps of 1, at which `text` fits a box `width` x `height` (design px). The estimate keeps a margin
 * (SAFETY of the width) because a font's real widths are never the average. At `min` it returns `min`: the box then clips (see FittedText).
 */
const SAFETY = 0.94;
export function fitFont({
  text, width, height, max, min, lineHeight = 1.4, charWidth = 0.52, wholeWords = false,
}) {
  // `wholeWords`: a word is never cut into lines, so it must fit the width by itself (the banners, whose columns are narrow)
  const longest = wholeWords ? Math.max(...String(text).split(/\s+/).map((word) => word.length), 1) : 0;
  for (let size = max; size > min; size -= 1) {
    if (wholeWords && longest * size * charWidth > width * SAFETY) continue;
    if (countLines(text, width * SAFETY, size, charWidth) * size * lineHeight <= height) return size;
  }
  return min;
}

/** The biggest size, from `max` down to `min`, at which `text` fits on one line `width` wide (a title). */
export function fitLine({
  text, width, max, min, charWidth = 0.55,
}) {
  const length = Math.max(1, String(text).length);
  return Math.max(min, Math.min(max, Math.floor((width * SAFETY) / (length * charWidth))));
}
