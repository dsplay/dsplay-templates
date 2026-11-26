// Photo fitting (contract of the blurred photo): `cover` when the photo looks like the frame, otherwise the whole photo
// (`contain`) over a blurred copy of itself that fills the frame.

// "auto" decides by the crop that `cover` would need (decision of the Alê, contract of the blurred photo, section 1):
// wide frames (aspect >= 1.2) keep `cover` for a horizontal photo (aspect >= 1.2) up to 55% of the photo cropped;
// vertical or nearly square frames up to 35%; thumbnails never. Otherwise: the whole photo over a blurred copy.
export const WIDE_FRAME = 1.2;
export const MIN_HORIZONTAL_PHOTO = 1.2;
export const MAX_CROP_WIDE = 0.55;
export const MAX_CROP_TALL = 0.35;
// the blur in two steps: the photo is cropped to a canvas of 64 px, which is shrunk to the final one of 16 px (the one shown)
export const BLUR_SIZE = 64;
export const FINAL_SIZE = 16;

/**
 * The fraction of the photo that `cover` would throw away: 1 - min(photo/frame, frame/photo) by aspect ratios.
 * @param {number} naturalW photo width, px
 * @param {number} naturalH photo height, px
 * @param {number} frameRatio frame width / height
 */
export function cropOf(naturalW, naturalH, frameRatio) {
  if (!naturalW || !naturalH || !frameRatio) {
    return 0;
  }
  const photo = naturalW / naturalH;
  return 1 - Math.min(photo / frameRatio, frameRatio / photo);
}

/**
 * Does this photo need the blurred background + whole photo?
 * @param {'auto'|'cover'|'contain'} mode `photo_fit`
 * @param {{ w: number, h: number }|null} natural photo size once loaded
 * @param {number} frameRatio
 * @param {boolean} [small] thumbnails: always blurred + whole
 */
export function needsBlur(mode, natural, frameRatio, small) {
  if (small || mode === 'contain') {
    return true;
  }
  if (mode === 'cover' || !natural) {
    return false;
  }
  const crop = cropOf(natural.w, natural.h, frameRatio);
  if (frameRatio >= WIDE_FRAME) {
    return !(natural.w / natural.h >= MIN_HORIZONTAL_PHOTO && crop <= MAX_CROP_WIDE);
  }
  return crop > MAX_CROP_TALL;
}

/** A canvas size: `long` px (64 for the first step, 16 for the final one) on the long side, same proportion as the frame. */
export function blurCanvasSize(frameRatio, long = BLUR_SIZE) {
  const ratio = frameRatio > 0 ? frameRatio : 1;
  return ratio >= 1
    ? { w: long, h: Math.max(1, Math.round(long / ratio)) }
    : { w: Math.max(1, Math.round(long * ratio)), h: long };
}

/** The source rectangle that crops the photo "cover" style for a canvas of that proportion. */
export function coverSource(naturalW, naturalH, canvasW, canvasH) {
  const target = canvasW / canvasH;
  const source = naturalW / naturalH;
  if (source > target) {
    const w = naturalH * target;
    return {
      x: (naturalW - w) / 2, y: 0, w, h: naturalH,
    };
  }
  const h = naturalW / target;
  return {
    x: 0, y: (naturalH - h) / 2, w: naturalW, h,
  };
}
