// What fits in a horizontal bar (spec 2.4): when the headline would get less than 56 rem, things fall in this order:
// category chip, feed circle, company tile. The headline never goes. Inputs are static for a given screen, so no hysteresis state
// is needed (the 56/60 rem hysteresis of the scrolling bar only matters when the room changes while it is shown).

export const MIN_TEXT = 56;
const MARGIN_LEFT = 2;
const MARGIN_RIGHT = 4;
const GAP = 3;

/** Estimated width of the category chip (3 rem uppercase, letter-spaced) in rem. */
export function chipWidth(label, size) {
  return label ? 2.8 + String(label).length * size * 0.72 : 0;
}

/**
 * @param {{ stageW: number, tile: number, circle: number, chip: number }} widths rem; 0 = that part does not exist
 * @returns {{ chip: boolean, circle: boolean, tile: boolean, text: number }}
 */
export default function barLayout({
  stageW, tile, circle, chip,
}) {
  const show = { chip: chip > 0, circle: circle > 0, tile: tile > 0 };
  const widths = { chip, circle, tile };
  const textRoom = () => stageW - MARGIN_LEFT - MARGIN_RIGHT
    - Object.keys(show).reduce((sum, key) => sum + (show[key] ? widths[key] + GAP : 0), 0);
  ['chip', 'circle', 'tile'].forEach((key) => {
    if (show[key] && textRoom() < MIN_TEXT) {
      show[key] = false;
    }
  });
  return { ...show, text: textRoom() };
}
