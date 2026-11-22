// Pure layout: which design plate a screen gets and how a design pixel maps to the screen.
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
// a horizontal banner at least this much longer than tall (1920 x 137 and thinner: the 56 px bars of real installations) is one line of text: its plate is
// 72 design px thick (the line, a little air) and as long as the screen asks, up to a limit
export const SLIM_RATIO = 14;
export const SLIM_THICKNESS = 72;
const SLIM_MIN = 1400;
const SLIM_MAX = 8000;
// the long side of a banner plate, in design px: a 4:1 strip is 960 long, a 10:1 one 2400; beyond the maximum the plate stops growing (bars at the ends)
const BANNER_MIN = 960;
const BANNER_MAX = 3000;

/**
 * The plate of a screen format ("landscape", "portrait", "square", "h-banner", "v-banner") on a screen of `width` x `height`. A banner plate is 240 design px
 * thick and as long as the screen's own shape asks, so it fills the strip whatever its ratio; without a size it is a 4:1 strip.
 */
export function plateOf(screenFormat, width, height) {
  if (screenFormat === 'h-banner' && width > 0 && height > 0 && width / height >= SLIM_RATIO) {
    return { kind: 'h-slim', w: Math.max(SLIM_MIN, Math.min(SLIM_MAX, Math.round(SLIM_THICKNESS * (width / height)))), h: SLIM_THICKNESS };
  }
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

/** True for the plates of the banner formats (kind "h-banner", "v-banner" or the one-line "h-slim"). */
export const isBanner = (kind) => kind === 'h-banner' || kind === 'v-banner' || kind === 'h-slim';

/** How many real pixels one design pixel is on a screen of `width` x `height`. */
export const scaleOf = (plate, width, height) => Math.min(width / plate.w, height / plate.h);

/** Design pixels to rem (the root font size is 10 real pixels per design pixel of scale, see Stage). */
export const rem = (designPx) => `${Math.round(designPx * 100) / 1000}rem`;

// the share of the width a character takes, on average, in the digits and signs of a price (digits are wide in the fonts of the styles)
const SAFETY = 0.94;

/** The biggest size, from `max` down to `min`, at which `text` fits on one line `width` wide (a price, a code). */
export function fitLine({
  text, width, max, min, charWidth = 0.6,
}) {
  const length = Math.max(1, String(text).length);
  return Math.max(min, Math.min(max, Math.floor((width * SAFETY) / (length * charWidth))));
}
