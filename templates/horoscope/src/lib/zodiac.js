// The twelve signs: their glyph (a 24 x 24 stroke path), constellation (stars on a 100 x 100 box and the lines between them, as indexes),
// the dates and element the answer would give, used when an answer leaves them out, and the hex of each lucky colour.

export const SIGN_IDS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export const ELEMENTS = ['fire', 'earth', 'air', 'water'];

export const COLOR_IDS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'white', 'gold'];

export const COLOR_HEX = {
  red: '#ef5b5b',
  orange: '#ff9f43',
  yellow: '#ffd84d',
  green: '#5fd88a',
  teal: '#2dd4bf',
  blue: '#5b9dff',
  purple: '#a78bfa',
  pink: '#f472b6',
  white: '#e8edf5',
  gold: '#f6c451',
};

export const GLYPH = {
  aries: 'M12 21V9 M12 9C12 5 9.5 3 7 3.5 4 4 3.5 8 5.5 10 M12 9c0-4 2.5-6 5-5.5 3 .5 3.5 4.5 1.5 6.5',
  taurus: 'M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M4 4c0 4 3 7 8 7s8-3 8-7',
  gemini: 'M6 4c3 2 9 2 12 0 M6 20c3-2 9-2 12 0 M9 4v16 M15 4v16',
  cancer: 'M7 9a2.5 2.5 0 1 0 0-.01z M17 15a2.5 2.5 0 1 0 0-.01z M9.5 9C12 5 18 5 21 9 M14.5 15C12 19 6 19 3 15',
  leo: 'M10 16a3 3 0 1 0-6 0 3 3 0 0 0 6 0z M10 15c0-8 3-11 6-11s4 2 4 5c0 4-3 5-3 9 0 2 1 4 3 4',
  virgo: 'M3 5v13 M3 8c0-3 5-3 5 0v10 M8 8c0-3 5-3 5 0v8c0 4 3 5 6 4 M14 17c4 0 6 2 4 4',
  libra: 'M3 20h18 M5 15h4.5a5 5 0 1 1 5 0H19',
  scorpio: 'M3 5v13 M3 8c0-3 5-3 5 0v10 M8 8c0-3 5-3 5 0v10c0 2 2 3 4 2l3-3 M20 16l-.5 4-4-.5',
  sagittarius: 'M5 19L19 5 M10 5h9v9 M7 12l5 5',
  capricorn: 'M3 6c2 3 3 6 3 11 M6 9c0-4 4-5 6-1l3 8c1 3 4 3 5 0a3 3 0 1 0-5-1',
  aquarius: 'M3 10l3-3 3 3 3-3 3 3 3-3 3 3 M3 17l3-3 3 3 3-3 3 3 3-3 3 3',
  pisces: 'M5 4c4 3 4 13 0 16 M19 4c-4 3-4 13 0 16 M4 12h16',
};

export const CONSTELLATION = {
  aries: { s: [[16, 62], [40, 50], [62, 40], [82, 46], [30, 78]], e: [[0, 1], [1, 2], [2, 3], [0, 4]] },
  taurus: { s: [[12, 22], [38, 48], [55, 58], [78, 44], [92, 24], [60, 80], [26, 70]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [1, 6]] },
  gemini: { s: [[25, 14], [30, 40], [35, 66], [30, 90], [60, 12], [62, 38], [58, 62], [72, 86]], e: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 5], [2, 6]] },
  cancer: { s: [[50, 18], [50, 48], [26, 74], [74, 80], [30, 34]], e: [[0, 1], [1, 2], [1, 3], [1, 4]] },
  leo: { s: [[18, 58], [26, 40], [38, 28], [52, 30], [54, 46], [72, 58], [88, 50], [78, 74]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 5]] },
  virgo: { s: [[15, 30], [32, 46], [50, 38], [66, 56], [86, 48], [56, 76], [38, 84]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6]] },
  libra: { s: [[50, 18], [24, 50], [76, 54], [34, 82], [72, 86]], e: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]] },
  scorpio: { s: [[16, 24], [30, 32], [40, 46], [48, 62], [58, 74], [72, 82], [86, 72], [88, 56], [10, 38]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [0, 8]] },
  sagittarius: { s: [[26, 70], [40, 52], [58, 48], [72, 60], [64, 78], [44, 82], [52, 28]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6]] },
  capricorn: { s: [[14, 34], [40, 24], [70, 40], [86, 62], [60, 80], [34, 66]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
  aquarius: { s: [[10, 42], [28, 30], [44, 44], [60, 32], [76, 46], [90, 36], [42, 70], [62, 78]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]] },
  pisces: { s: [[14, 28], [32, 46], [50, 60], [68, 42], [86, 26], [50, 84]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]] },
};

/** `from` and `to` are MM-DD; `match` is what the answer should say when it does not. */
export const SIGN_DEFAULTS = {
  aries: { from: '03-21', to: '04-19', element: 'fire' },
  taurus: { from: '04-20', to: '05-20', element: 'earth' },
  gemini: { from: '05-21', to: '06-20', element: 'air' },
  cancer: { from: '06-21', to: '07-22', element: 'water' },
  leo: { from: '07-23', to: '08-22', element: 'fire' },
  virgo: { from: '08-23', to: '09-22', element: 'earth' },
  libra: { from: '09-23', to: '10-22', element: 'air' },
  scorpio: { from: '10-23', to: '11-21', element: 'water' },
  sagittarius: { from: '11-22', to: '12-21', element: 'fire' },
  capricorn: { from: '12-22', to: '01-19', element: 'earth' },
  aquarius: { from: '01-20', to: '02-18', element: 'air' },
  pisces: { from: '02-19', to: '03-20', element: 'water' },
};

/** The stars of a sign's constellation scaled to a box, with the lines between them: `{ pts: [{ x, y, r }], lines: [{ x1, y1, x2, y2 }] }`. */
export function constellationOf(id, width, height) {
  const sign = CONSTELLATION[id];
  if (!sign) return { pts: [], lines: [] };
  const pts = sign.s.map(([x, y], i) => ({ x: (x * width) / 100, y: (y * height) / 100, r: 1.6 + ((i * 7) % 3) * 0.9 }));
  const lines = sign.e.map(([a, b]) => ({
    x1: pts[a].x, y1: pts[a].y, x2: pts[b].x, y2: pts[b].y,
  }));
  return { pts, lines };
}
