// Where everything sits, in rem on the design screen of each format (spec meeting-room-neo, section 5).
// A rect is [x, y, w, h]. Drop order when something is missing: no host logo -> the place card takes its column;
// no event logo -> the name block takes its room and centers; no place -> omitted.

export const box = ([x, y, w, h]) => ({
  position: 'absolute', left: `${x}rem`, top: `${y}rem`, width: `${w}rem`, height: `${h}rem`,
});

const GAP = 3;

/** n items in a row inside [x, y, w, h], each at most `max` wide, centered. */
function row(x, y, w, h, n, max) {
  const each = Math.min(max, (w - GAP * (n - 1)) / n);
  const total = each * n + GAP * (n - 1);
  const start = x + (w - total) / 2;
  return Array.from({ length: n }, (_, i) => [start + i * (each + GAP), y, each, h]);
}

/**
 * @param {string} set land | port | sq | wide | v
 * @param {{ eventLogo: boolean, hostLogo: boolean, place: boolean, chip: boolean }} has
 * @returns {object} chip, block (+ align 'top'|'center'), event, host, place, placeText (rects or null) and the sizes
 */
export default function layoutOf(set, has) {
  const L = {
    chip: null, block: null, align: 'top', vbar: false, event: null, host: null, place: null, placeText: null, sizes: {},
  };
  if (set === 'land') {
    const right = has.hostLogo || has.place;
    const blockW = right ? 108 : 176;
    L.chip = has.chip ? [8, 10, 90, 7] : null;
    L.event = has.eventLogo ? [8, 66, 60, 36] : null;
    if (has.eventLogo) {
      L.block = [8, has.chip ? 20 : 12, blockW, has.chip ? 42 : 50];
    } else {
      L.block = [8, 20, blockW, 82];
      L.align = 'center';
    }
    if (has.hostLogo && has.place) {
      L.host = [126, 8, 58, 44];
      L.place = [126, 62, 58, 40];
    } else if (has.hostLogo) {
      L.host = [126, 8, 58, 44];
    } else if (has.place) {
      L.place = [126, 8, 58, 94];
    }
    L.sizes = { name: 13, nameMin: 6, nameLines: 3, date: 5, dateMin: 3.4, place: 5, placeMin: 3.4, placeLines: 4, chip: 3.4, textW: blockW - 3 };
  } else if (set === 'port') {
    L.chip = has.chip ? [6, has.eventLogo ? 50 : 8, 96, 7] : null;
    L.event = has.eventLogo ? [6, 6, 96, 40] : null;
    const top = has.eventLogo ? 60 : 20;
    const bottom = has.hostLogo || has.place;
    L.block = [6, has.chip ? top : top - 8, 96, bottom ? 62 : 150];
    if (!has.eventLogo && !has.chip) L.block[1] = 12;
    if (!has.eventLogo) L.align = 'center';
    if (has.hostLogo && has.place) {
      L.host = [6, 126, 96, 28];
      L.place = [6, 158, 96, 28];
    } else if (has.hostLogo) {
      L.host = [6, 158, 96, 28];
    } else if (has.place) {
      L.place = [6, 158, 96, 28];
    }
    L.sizes = { name: 11, nameMin: 6, nameLines: 4, date: 5.5, dateMin: 3.4, place: 5, placeMin: 3.4, placeLines: 3, chip: 3.4, textW: 93 };
  } else if (set === 'sq') {
    L.chip = has.chip ? [6, 6, 96, 6] : null;
    const cards = [has.eventLogo && 'event', has.hostLogo && 'host', has.place && 'place'].filter(Boolean);
    L.block = [6, has.chip ? 16 : 8, 96, cards.length ? 52 : 90];
    if (!cards.length) L.align = 'center';
    row(6, 72, 96, 30, Math.max(cards.length, 1), 30).slice(0, cards.length).forEach((rect, i) => { L[cards[i]] = rect; });
    L.sizes = { name: 9, nameMin: 5, nameLines: 3, date: 4.6, dateMin: 3.2, place: 4.4, placeMin: 3, placeLines: 3, chip: 3.2, textW: 93 };
  } else if (set === 'wide') {
    const rightW = has.hostLogo || has.chip ? 46 : 0;
    L.event = has.eventLogo ? [6, 6, 36, 36] : null;
    const blockX = has.eventLogo ? 48 : 8;
    L.block = [blockX, 6, 192 - blockX - (rightW ? rightW + 10 : 8), 36];
    L.align = 'center';
    if (has.chip) L.chip = [142, has.hostLogo ? 6 : 21, 46, 6];
    if (has.hostLogo) L.host = [148, has.chip ? 14 : 6, 34, has.chip ? 28 : 36];
    L.placeText = has.place;
    L.sizes = { name: 10, nameMin: 5, nameLines: 2, date: 4.2, dateMin: 3.2, place: 3.6, placeMin: 3, placeLines: 1, chip: 3.2, textW: L.block[2] - 3 };
  } else {
    L.vbar = true;
    // v bar: tile, name, date (4 lines), chip, place as text; the host logo drops
    L.event = has.eventLogo ? [2, 4, 16, 16] : null;
    L.block = [2, has.eventLogo ? 24 : 6, 16, has.eventLogo ? 164 : 182];
    L.chip = has.chip ? [2, 0, 16, 5] : null;
    L.placeText = has.place;
    L.sizes = { name: 4.2, nameMin: 3, nameLines: 6, date: 3.4, dateMin: 2.6, place: 3.4, placeMin: 2.6, placeLines: 3, chip: 2.6, textW: 16 };
  }
  return L;
}
