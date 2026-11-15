import { THEMES, THEME_INSETS, themeArt } from './theme-art';

// What a post may bring besides its text: a named background (the template paints it), named text colours and sizes, an alignment. A name the template does
// not know is ignored, never passed on as a style.
export const BACKGROUNDS = {
  navy: '#12284c', teal: '#0b3b4a', green: '#14532d', purple: '#4c1d95', red: '#7f1d1d', orange: '#9a3412', white: '#ffffff', black: '#000000',
};

// Named colours: the post says "red", the template decides which red, one set tuned for dark backgrounds and one for the white one.
const COLORS_ON_DARK = {
  red: '#ff8a80', orange: '#fdba74', amber: '#fbbf24', green: '#86efac', teal: '#5eead4', blue: '#93c5fd', purple: '#d8b4fe', pink: '#f9a8d4',
};
const COLORS_ON_LIGHT = {
  red: '#b91c1c', orange: '#c2410c', amber: '#b45309', green: '#15803d', teal: '#0f766e', blue: '#1d4ed8', purple: '#7e22ce', pink: '#be185d',
};

// Sizes are relative to the text the template fits to the region.
export const SIZES = { small: 0.75, large: 1.4, xlarge: 1.9 };

export const ALIGNS = { left: 'flex-start', center: 'center', right: 'flex-end' };

const has = (table, key) => typeof key === 'string' && Object.hasOwn(table, key);

export const known = (table, key) => (has(table, key) ? key : '');

/** The layout a post is drawn in: only the three the gateway sends, the card for anything else. */
export const kindOf = (media) => (media.kind === 'ticker' || media.kind === 'long_post' ? media.kind : 'card');

/** The colours of the region: the template's variables, the post's own background, or its design (always light text on its dark gradient); `insets` is the room the design's art takes. */
export function lookOf(media, textColor, backgroundColor, width, height) {
  const background = known(BACKGROUNDS, media.background);
  const theme = known(THEMES, media.theme);
  const light = !theme && background === 'white';
  const style = {
    color: light ? '#111827' : textColor,
    backgroundColor: background ? BACKGROUNDS[background] : backgroundColor,
  };
  if (theme) {
    style.color = '#ffffff';
    style.backgroundColor = THEMES[theme][1];
    // encodeURIComponent leaves ( ) and ' alone; escaping them too keeps the url safe inside url("...") for every CSS parser.
    const art = encodeURIComponent(themeArt(theme, width, height)).replace(/[()']/g, (char) => `%${char.codePointAt(0).toString(16).toUpperCase()}`);
    style.backgroundImage = `url("data:image/svg+xml;utf8,${art}")`;
    style.backgroundRepeat = 'no-repeat';
    style.backgroundSize = '100% 100%';
  }
  return { style, colors: light ? COLORS_ON_LIGHT : COLORS_ON_DARK, insets: theme ? THEME_INSETS[theme] : null };
}

/** Only a picture the gateway (an http(s) url) or the dashboard preview (a small JPEG data url) can send. */
export const imageSource = (value) => (typeof value === 'string' && /^(https?:\/\/|data:image\/jpeg;base64,)/.test(value) ? value : '');
