export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';
export const H_BANNER = 'h-banner';
export const V_BANNER = 'v-banner';
export const SQUARE = 'square';

export const DEFAULT_BANNER_FACTOR = 4;
export const DEFAULT_SQUARE_FACTOR = 0.2;

export function calculateScreenInfo({
  squareFactor = DEFAULT_SQUARE_FACTOR,
  bannerFactor = DEFAULT_BANNER_FACTOR,
} = {}) {
  if (window) {
    const {
      innerHeight,
      innerWidth,
    } = window;
    const h = innerHeight;
    const w = innerWidth;
    let screenFormat = LANDSCAPE;

    const relation = Math.abs(1 - w / h);

    if (relation < squareFactor) {
      screenFormat = SQUARE;
    } else if (w / h > 1) {
      // horizontal
      const factor = w / h;

      if (factor >= bannerFactor) {
        screenFormat = H_BANNER;
      } else {
        screenFormat = LANDSCAPE;
      }
    } else {
      // vertical
      const factor = h / w;

      // console.log('v factor:', factor);
      if (factor >= bannerFactor) {
        screenFormat = V_BANNER;
      } else {
        screenFormat = PORTRAIT;
      }
    }

    return {
      w,
      h,
      screenFormat,
    };
  }

  return undefined;
}
