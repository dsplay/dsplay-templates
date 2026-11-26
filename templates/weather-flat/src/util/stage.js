// The stage is the design screen of each format (spec, section 2), in rem. 1 rem = 10 px on the design screen.

export const FORMATS = {
  landscape: { w: 192, h: 108 },
  portrait: { w: 108, h: 192 },
  square: { w: 108, h: 108 },
  wide: { w: 192, h: 48 },
  'bar-h': { h: 12 },
  'bar-v': { w: 20 },
};

/** Format by window proportions. Bars: 1920x52, 1920x120 (H) and 200x1920 (V). Wide: 1920x480. */
export function formatOf(width, height) {
  const ratio = width / Math.max(1, height);
  if (ratio >= 8) {
    return 'bar-h';
  }
  if (ratio <= 1 / 6) {
    return 'bar-v';
  }
  if (ratio >= 3) {
    return 'wide';
  }
  if (Math.abs(1 - ratio) < 0.2) {
    return 'square';
  }
  return ratio > 1 ? 'landscape' : 'portrait';
}

/**
 * Size of one rem in px and the stage in rem. The stage IS the window (no centered design screen, no side bands): the scale
 * is the smaller of the two ratios against the design screen, so the stage is never smaller than the design screen and the
 * layout absorbs what is left (hero height, description card width). The horizontal bar scales by its height (12 rem), the
 * vertical bar by its width (20 rem), like the other bar templates.
 * @returns {{ format: string, remPx: number, w: number, h: number }}
 */
export function stageOf(width, height) {
  const format = formatOf(width, height);
  const ref = FORMATS[format];
  let remPx;
  if (format === 'bar-h') {
    // the horizontal bar scales by its HEIGHT: 1 rem = height / 12 (1920x52 -> 4.33 px, 1920x120 -> 10 px); the width is what is left
    remPx = height / ref.h;
  } else if (format === 'bar-v') {
    // the vertical bar scales by its width: 200 px = 20 rem
    remPx = width / ref.w;
  } else {
    remPx = Math.min(width / ref.w, height / ref.h);
  }
  remPx = Math.max(remPx, 0.1);
  return {
    format,
    remPx,
    w: width / remPx,
    h: height / remPx,
  };
}
