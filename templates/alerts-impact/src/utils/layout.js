// Maps the window size + the lib's screenFormat to this template's layout name and its "design screen".
// 1rem is 10px on the design screen (see useRootScale in @dsplay/react-template-utils), so every size in the stylesheets is written in rem.

const DESIGN_SCREENS = {
  landscape: [1920, 1080],
  portrait: [1080, 1920],
  square: [1080, 1080],
  wide: [1920, 480],
  'strip-h': [1920, 52],
  'strip-v': [200, 1920],
};

// H banners at 6:1 or flatter only fit one line of text (1920x52); the 4:1..6:1 ones (1920x480) get the row layout.
const STRIP_RATIO = 6;

export function getLayout(screenFormat, w, h) {
  switch (screenFormat) {
    case 'h-banner':
      return w / h >= STRIP_RATIO ? 'strip-h' : 'wide';
    case 'v-banner':
      return 'strip-v';
    case 'square':
      return 'square';
    case 'portrait':
      return 'portrait';
    default:
      return 'landscape';
  }
}

// Design screen [refWidth, refHeight] of a layout; the lib's useRootScale turns it into the root font-size.
export function getDesignScreen(layout) {
  return DESIGN_SCREENS[layout] || DESIGN_SCREENS.landscape;
}

// Messages longer than this give the text more room and the icon less.
export const LONG_MESSAGE_LENGTH = 60;

// [min, max] font size (rem, design screen) of the message per layout (spec section 4). Nothing below 2.6 rem.
const FIT_RANGES = {
  landscape: [5, 14],
  portrait: [5, 14],
  square: [5, 14],
  wide: [3, 8],
  'strip-h': [2.6, 2.6],
  'strip-v': [2.6, 4],
};

export function getFitRange(layout) {
  return FIT_RANGES[layout] || FIT_RANGES.landscape;
}
