// The design screen of each format, in rem (spec weather-neo, section 2). 1 rem = 10 px on the design screen.
// Bars are 12 rem tall (scale by height); the others keep a fixed design size centered on the screen.

export const DESIGN = {
  land: { w: 192, h: 108 },
  port: { w: 108, h: 192 },
  sq: { w: 108, h: 108 },
  wide: { w: 192, h: 48 },
  v: { w: 20, h: 192 },
};

/** land = landscape, 4:3, 16:9; port = portrait; sq = square; wide = 1920x480; a = 1920x52; b = 1920x120; v = 200x1920 */
export function setOf(width, height) {
  const ratio = width / Math.max(1, height);
  if (ratio >= 6) {
    return height < 70 ? 'a' : 'b';
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
  let remPx;
  if (set === 'a' || set === 'b') {
    remPx = height / 12;
  } else {
    remPx = Math.min(width / DESIGN[set].w, height / DESIGN[set].h);
  }
  remPx = Math.max(remPx, 0.1);
  const bar = set === 'a' || set === 'b';
  return {
    set,
    remPx,
    w: bar ? width / remPx : DESIGN[set].w,
    h: bar ? 12 : DESIGN[set].h,
  };
}
