// The design screen of each format, in rem (spec meeting-room-neo, section 5). 1 rem = 10 px on the design screen.
// The H bar scales by height: 5.2 rem for the 52 px bar, 12 rem for the 120 px one; the others keep a fixed design size.

export const DESIGN = {
  land: { w: 192, h: 108 },
  port: { w: 108, h: 192 },
  sq: { w: 108, h: 108 },
  wide: { w: 192, h: 48 },
  v: { w: 20, h: 192 },
};

export const H_BAR_THIN = 5.2;
export const H_BAR_TALL = 12;

/** land = landscape, 4:3, 16:9; port = portrait; sq = square; wide = 1920x480; h = 1920x52 / 1920x120; v = 200x1920 */
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

/** The H bar is 5.2 rem tall when it is thin (ratio >= 25, such as 1920x52) and 12 rem tall otherwise (1920x120). */
export const hBarRem = (width, height) => (width / Math.max(1, height) >= 25 ? H_BAR_THIN : H_BAR_TALL);

/** @returns {{ set: string, remPx: number, w: number, h: number, tall: boolean }} w/h: the design screen in rem */
export default function stageOf(width, height) {
  const set = setOf(width, height);
  const barRem = hBarRem(width, height);
  const remPx = Math.max(set === 'h' ? height / barRem : Math.min(width / DESIGN[set].w, height / DESIGN[set].h), 0.1);
  return {
    set,
    remPx,
    w: set === 'h' ? width / remPx : DESIGN[set].w,
    h: set === 'h' ? barRem : DESIGN[set].h,
    tall: set === 'h' && barRem === H_BAR_TALL,
  };
}
