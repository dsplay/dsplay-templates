// Rectangles (rem) of the full screens, on a stage that is the whole window (spec weather-flat 3). The design screen of each format
// gives the numbers; what the window has beyond it goes to the flexible parts (the `now` height, the pills column or row).

export const rem = (n) => `${Math.round(n * 1000) / 1000}rem`;
export const rectStyle = ({
  x, y, w, h,
}) => ({
  left: rem(x), top: rem(y), width: rem(w), height: rem(h),
});

export const MARGIN = 4;

// font sizes by format (rem): the `now` card, a forecast pill and a detail card
export const SIZES = {
  landscape: {
    now: {
      city: 5.5, icon: 26, temp: 24, minmax: 4.5, desc: 4.5,
    },
    pill: {
      day: 4.5, date: 3, icon: 9, max: 5.5, min: 4.4,
    },
    stat: { label: 3, value: 8, sun: 4.4 },
  },
  portrait: {
    now: {
      city: 6, icon: 24, temp: 22, minmax: 5, desc: 4.5,
    },
    pill: {
      day: 4.5, date: 0, icon: 11, max: 5.5, min: 4.6,
    },
    stat: { label: 3, value: 7, sun: 4.2 },
  },
  square: {
    now: {
      city: 5, icon: 16, temp: 18, minmax: 4.2, desc: 4.5, line: 3.6,
    },
    pill: {
      day: 3.6, date: 0, icon: 8, max: 4.5, min: 3.8,
    },
    stat: null,
  },
  wide: {
    now: {
      city: 4.5, icon: 16, temp: 14, minmax: 4, desc: 0, line: 3.4,
    },
    pill: {
      day: 3.6, date: 0, icon: 8, max: 4.5, min: 3.8,
    },
    stat: null,
  },
};

// the forecast is always five days (decision of the Alê): fewer days keep the same size and are centered as a group
export const DAYS = 5;

/** n equal slots of `total` rem with `gap` between them. */
function slots(start, total, n, gap) {
  const size = (total - gap * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) => ({ start: start + i * (size + gap), size }));
}

// One grid: 4 rem outer margins, 3 rem between neighbors (blocks of a row or column share top and bottom to the pixel).
export const GAP = 3;
const LOGO_H = 8;
const LOGO_W = 18;

/**
 * @param {string} format landscape | portrait | square
 * @param {{ w: number, h: number }} stage
 * @param {{ pills: number, stats: number }} count
 */
export function fullLayout(format, { w, h }, { pills, stats }) {
  const bottom = h - MARGIN;
  const logo = {
    x: w - MARGIN - LOGO_W, y: MARGIN, w: LOGO_W, h: LOGO_H,
  };
  const belowLogo = MARGIN + LOGO_H + GAP;
  if (format === 'portrait') {
    const statH = 26;
    const pillH = 54;
    const stripH = pills ? pillH : 0;
    const statY = bottom - stripH - (pills ? GAP : 0) - (stats ? statH : 0);
    const nowBottom = (stats ? statY : bottom - stripH - (pills ? GAP : 0));
    const colGap = 2.5;
    const colW = (w - 2 * MARGIN - 4 * colGap) / 5;
    const groupW = pills * colW + Math.max(0, pills - 1) * colGap;
    const startX = MARGIN + (w - 2 * MARGIN - groupW) / 2;
    return {
      logo,
      now: {
        x: MARGIN, y: belowLogo, w: w - 2 * MARGIN, h: nowBottom - (stats ? GAP : 0) - belowLogo,
      },
      stats: slots(MARGIN, w - 2 * MARGIN, 3, GAP).slice(0, stats).map((sl) => ({
        x: sl.start, y: statY, w: sl.size, h: statH,
      })),
      pills: Array.from({ length: pills }, (_, i) => ({
        x: startX + i * (colW + colGap), y: bottom - pillH, w: colW, h: pillH,
      })),
      horizontalPills: false,
    };
  }
  if (format === 'square') {
    const pillH = 32;
    const colGap = 2.5;
    const colW = (w - 2 * MARGIN - 4 * colGap) / 5;
    const groupW = pills * colW + Math.max(0, pills - 1) * colGap;
    const startX = MARGIN + (w - 2 * MARGIN - groupW) / 2;
    const nowBottom = pills ? bottom - pillH - GAP : bottom;
    return {
      logo,
      now: {
        x: MARGIN, y: belowLogo, w: w - 2 * MARGIN, h: nowBottom - belowLogo,
      },
      stats: [],
      pills: Array.from({ length: pills }, (_, i) => ({
        x: startX + i * (colW + colGap), y: bottom - pillH, w: colW, h: pillH,
      })),
      horizontalPills: false,
    };
  }
  // landscape: left column (now + detail cards) and right column (logo + five pills) share top (4) and bottom (h - 4)
  const leftW = 108;
  const statH = 31;
  const nowBottom = stats ? bottom - statH - GAP : bottom;
  const colX = MARGIN + leftW + MARGIN;
  const pillAvail = bottom - belowLogo;
  // the height of five pills (fewer days keep it and are centered as a group in the column)
  const pillH = (pillAvail - GAP * 4) / 5;
  const groupH = pills * pillH + Math.max(0, pills - 1) * GAP;
  const pillStart = belowLogo + (pillAvail - groupH) / 2;
  return {
    logo,
    now: {
      x: MARGIN, y: MARGIN, w: leftW, h: nowBottom - MARGIN,
    },
    stats: slots(MARGIN, leftW, 3, GAP).slice(0, stats).map((sl) => ({
      x: sl.start, y: bottom - statH, w: sl.size, h: statH,
    })),
    pills: Array.from({ length: pills }, (_, i) => ({
      x: colX, y: pillStart + i * (pillH + GAP), w: w - MARGIN - colX, h: pillH,
    })),
    horizontalPills: true,
  };
}

/** wide: `now` on the left (78 rem), up to 5 vertical pills, the logo tile (16 x 7) at the right. */
export function wideLayout({ w, h }, { pills, logo }) {
  const logoW = logo ? 16 : 0;
  const areaX = 4 + 78 + 4;
  const areaW = w - areaX - (logo ? logoW + 8 : 4);
  const colW = Math.min(20, (areaW - 2.5 * 4) / 5);
  const groupW = pills * colW + Math.max(0, pills - 1) * 2.5;
  const startX = areaX + (areaW - groupW) / 2;
  return {
    now: {
      x: 4, y: 4, w: 78, h: h - 8,
    },
    pills: Array.from({ length: pills }, (_, i) => ({
      x: startX + i * (colW + 2.5), y: 4, w: colW, h: h - 8,
    })),
    logo: {
      x: w - MARGIN - logoW, y: (h - 7) / 2, w: logoW, h: 7,
    },
  };
}
