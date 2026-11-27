// The design screen of each format, in rem (spec qrcode-wifi-neo, section 5). 1 rem = 10 px on the design screen.
// The H bar is 5.2 rem tall (scale by height); the others keep a fixed design size centered on the screen.

export const DESIGN = {
  land: { w: 192, h: 108 },
  port: { w: 108, h: 192 },
  sq: { w: 108, h: 108 },
  wide: { w: 192, h: 48 },
  v: { w: 20, h: 192 },
};

export const H_BAR_REM = 5.2;

/** land = landscape, 4:3, 16:9; port = portrait; sq = square; wide = 1920x480; h = 1920x52; v = 200x1920 */
export function setOf(width, height) {
  const ratio = width / Math.max(1, height);
  if (ratio >= 6) {
    return 'h';
  }
  if (ratio <= 1 / 6) {
    return 'v';
  }
  if (ratio >= 3) {
    return 'wide';
  }
  if (ratio >= 1.2) {
    return 'land';
  }
  if (ratio > 0.8) {
    return 'sq';
  }
  return 'port';
}

/** @returns {{ set: string, remPx: number, w: number, h: number }} w/h: the design screen in rem */
export default function stageOf(width, height) {
  const set = setOf(width, height);
  const remPx = Math.max(set === 'h' ? height / H_BAR_REM : Math.min(width / DESIGN[set].w, height / DESIGN[set].h), 0.1);
  return {
    set,
    remPx,
    w: set === 'h' ? width / remPx : DESIGN[set].w,
    h: set === 'h' ? H_BAR_REM : DESIGN[set].h,
  };
}
