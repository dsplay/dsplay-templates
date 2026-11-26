// Rectangles of the layouts, in rem, on a stage that is the whole window (spec M-001 v2, sections 2.0 to 2.2).
// The hero (cover) spans the full width and everything above the cards; the card strip is a fixed height glued to the bottom;
// the hero height and the description card width absorb the window proportion.

export const rem = (n) => `${Math.round(n * 1000) / 1000}rem`;

export const rectStyle = ({
  x, y, w, h,
}) => ({
  left: rem(x), top: rem(y), width: rem(w), height: rem(h),
});

export const MARGIN = 4;
export const CARD_GAP = 4;
// the vertical QR card: tile 20 (QR 16 + 2 rem quiet margin) + "Read more" below; 3 rem padding each side
export const QR_CARD_W = 26;
// how far the cards rise over the hero
export const OVERLAP = 6;

const STRIP = { landscape: 34, square: 34, portrait: 42 };

const HEADLINE = {
  landscape: {
    max: 9, min: 6.4, maxLines: 3, top: 4, widthMax: 130,
  },
  portrait: {
    max: 8, min: 5.6, maxLines: 5, top: 20, widthMax: 1000,
  },
  square: {
    max: 7, min: 5.2, maxLines: 4, top: 14, widthMax: 1000,
  },
};

const headlineBox = (format, stageW) => {
  const h = HEADLINE[format];
  return { ...h, width: Math.min(h.widthMax, stageW - 2 * MARGIN) };
};

/**
 * hero: the cover, a description card (flex) and the vertical QR card.
 * @param {string} format landscape | portrait | square
 * @param {{ w: number, h: number, hasDesc: boolean, hasQr: boolean }} stage
 */
export function heroGeometry(format, {
  w, h, hasDesc, hasQr,
}) {
  const strip = STRIP[format];
  const hasCards = hasDesc || hasQr;
  const cardsY = hasCards ? h - MARGIN - strip : h;
  const qrX = w - MARGIN - QR_CARD_W;
  return {
    cover: {
      x: 0, y: 0, w, h: hasCards ? cardsY + OVERLAP : h,
    },
    cardsY,
    desc: hasDesc ? {
      x: MARGIN, y: cardsY, w: hasQr ? qrX - CARD_GAP - MARGIN : w - 2 * MARGIN, h: strip,
    } : null,
    qr: hasQr ? {
      x: qrX, y: cardsY, w: QR_CARD_W, h: strip,
    } : null,
    descLines: { landscape: 4, portrait: 5, square: 4 }[format],
    headline: headlineBox(format, w),
    clock: format === 'square' ? 'time' : 'full',
  };
}

/** wide: the cover takes 37.5% of the width (full height, bleeding), one flexible card on the rest. */
export function wideGeometry(stageW, stageH, hasPhoto) {
  const coverW = Math.round(stageW * 0.375 * 100) / 100;
  return {
    cover: hasPhoto ? {
      x: 0, y: 0, w: coverW, h: stageH,
    } : null,
    card: hasPhoto ? {
      x: coverW + CARD_GAP, y: MARGIN, w: stageW - coverW - CARD_GAP - MARGIN, h: stageH - 2 * MARGIN,
    } : {
      x: MARGIN, y: MARGIN, w: stageW - 2 * MARGIN, h: stageH - 2 * MARGIN,
    },
  };
}

// cards (spec 2.2): taller strip so the description respects its floor; the column of the next items is 80 rem wide
export const NEXT_COLUMN_W = 80;

/**
 * cards: the current item (description + vertical QR) and the next items.
 * Landscape: strip 44; current card flexible, then a column of two 80x20 cards. Portrait: current 100x40, then two 100x22.
 * @param {string} format landscape | portrait (square falls back to hero)
 */
export function cardsGeometry(format, { w, h }) {
  const portrait = format === 'portrait';
  const strip = portrait ? 40 + CARD_GAP + 22 + CARD_GAP + 22 : 44;
  const cardsY = h - MARGIN - strip;
  const listW = w - 2 * MARGIN;
  return {
    cover: {
      x: 0, y: 0, w, h: cardsY + OVERLAP,
    },
    cardsY,
    list: {
      x: MARGIN, y: cardsY, w: listW, h: strip,
    },
    portrait,
    currentH: portrait ? 40 : 44,
    nextH: portrait ? 22 : 20,
    // room of the current card's description: text starts at 6 (marker) + right padding 3, the QR column (26) and 5 of space
    textWidth: (portrait ? listW : listW - NEXT_COLUMN_W - CARD_GAP) - 6 - 3 - QR_CARD_W - 5,
    descLines: portrait ? 5 : 6,
    thumb: 14,
    headline: headlineBox(format, w),
    clock: 'full',
  };
}

/** how many items the cards layout shows (current + 2 next); square has no cards layout */
export const cardCount = (format, available) => (format === 'square' ? 0 : Math.min(available, 3));
