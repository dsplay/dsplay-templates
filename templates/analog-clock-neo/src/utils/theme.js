import {
  contrast, luminance, mix, parseColor, scale, toHex,
} from './color';

// Neumorphic tokens (tokens-neomorfismo.md). Light comes from the top-left: L is the highlight (top/left), D the
// shade (bottom/right). The face has the SAME color as the screen base, which is what makes the relief work.
const PRESETS = {
  light: {
    base: '#E4E9F0',
    light: '#FFFFFF',
    dark: '#9AA8BE',
    darkStrong: '#8F9DB4',
    lightStrong: '#FFFFFF',
    text: '#151618',
    muted: '#4A4F57',
    primary: '#D94A22', // M-007 neo §3: #E5562D is only 3.02:1 on the light base, #D94A22 is 3.5:1
  },
  dark: {
    base: '#23272E',
    light: '#3A414D',
    dark: '#0E1013',
    darkStrong: '#07080A',
    lightStrong: '#454C59',
    text: '#F2F4F8',
    muted: '#B8C0CC',
    primary: '#E5562D', // 4.1:1 on the dark base
  },
};

const MIN_TEXT_CONTRAST = 4.5;
const MIN_GRAPHIC_CONTRAST = 3;

/** Highlight and shade for any base color (derivation rule, tokens-neomorfismo.md section 2). */
export function shadowsFor(base) {
  const lum = luminance(base);
  if (lum < 0.02) {
    return {
      light: mix(base, '#FFFFFF', 0.14), dark: '#000000', lightStrong: mix(base, '#FFFFFF', 0.22), darkStrong: '#000000',
    };
  }
  if (lum > 0.85) {
    return {
      light: '#FFFFFF', dark: scale(base, 0.7), lightStrong: '#FFFFFF', darkStrong: scale(base, 0.6),
    };
  }
  if (lum > 0.4) {
    return {
      light: mix(base, '#FFFFFF', 0.6), dark: scale(base, 0.72), lightStrong: '#FFFFFF', darkStrong: scale(base, 0.62),
    };
  }
  return {
    light: mix(base, '#FFFFFF', 0.12), dark: scale(base, 0.45), lightStrong: mix(base, '#FFFFFF', 0.2), darkStrong: scale(base, 0.35),
  };
}

const valid = (color) => (parseColor(color) ? toHex(parseColor(color)) : '');

// the preset inks first; mid grays need pure black/white to reach the contrast against the base AND the shade peak
function inkFor(base, peak, candidates) {
  const ok = (ink) => contrast(ink, base) >= MIN_TEXT_CONTRAST && contrast(ink, peak) >= MIN_TEXT_CONTRAST;
  return [...candidates, '#000000', '#FFFFFF'].find(ok)
    || (contrast('#000000', base) >= contrast('#FFFFFF', base) ? '#000000' : '#FFFFFF');
}

/**
 * Everything the screen paints with, derived in JS (inline styles; no CSS variables).
 * @param {object} options
 * @param {'light'|'dark'} options.theme
 * @param {'default'|'aluminum'} options.clockTheme
 * @param {string} [options.background] `background_color` (default style only)
 * @param {string} [options.primary] `color_primary`
 * @param {string} [options.face] `color_face` (aluminum: the base of the screen and of the face)
 * @param {string} [options.hands] `color_hands` (aluminum: hands and numerals)
 * @param {string} [options.secondHand] `color_second_hand` (aluminum: seconds hand and pin)
 * @param {string} [options.reliefStrength] 'normal' | 'strong'
 */
export default function buildClockTheme({
  theme, clockTheme, background, primary, face, hands, secondHand, reliefStrength,
}) {
  const strong = reliefStrength === 'strong';
  const preset = PRESETS[theme === 'dark' ? 'dark' : 'light'];
  const aluminum = clockTheme === 'aluminum';

  let base;
  if (aluminum) {
    base = valid(face) || '#FFFFFF';
  } else {
    base = valid(background) || preset.base;
  }
  const isPreset = !aluminum && base.toLowerCase() === preset.base.toLowerCase();
  const shades = isPreset ? preset : shadowsFor(base);
  const light = strong ? (shades.lightStrong || shades.light) : shades.light;
  const dark = strong ? (shades.darkStrong || shades.dark) : shades.dark;

  // the ink of the digital text, the date and the label: >= 4.5:1 against the base and against the peak of the shade
  const peak = luminance(dark) < luminance(base) ? dark : base;
  const text = isPreset ? preset.text : inkFor(base, peak, ['#151618', '#F2F4F8']);
  const ink = aluminum ? (valid(hands) || '#111111') : text; // hands and numerals
  const accent = valid(primary) || preset.primary;
  const secondColor = aluminum ? (valid(secondHand) || '#111111') : accent;
  // the accent (seconds hand, pin) must be >= 3:1 against the base, else the text color
  const second = contrast(secondColor, base) >= MIN_GRAPHIC_CONTRAST ? secondColor : text;
  const muted = aluminum
    ? mix(ink, '#FFFFFF', 0.4)
    : (isPreset ? preset.muted : mix(text, base, 0.3));

  return {
    theme: theme === 'dark' ? 'dark' : 'light',
    aluminum,
    strong,
    base,
    light,
    dark,
    text,
    ink,
    muted: contrast(muted, base) >= MIN_TEXT_CONTRAST || aluminum ? muted : text, // minute ticks
    // date and label: always >= 4.5:1 (aluminum: the chosen ink, since its muted tone is only for the ticks)
    label: aluminum ? text : (contrast(muted, base) >= MIN_TEXT_CONTRAST ? muted : text),
    second,
    // the flat face of the thin bar H: the base 4% deeper
    flat: scale(base, 0.96),
  };
}

// offset / blur in rem; "strong" only enlarges it a little (<= 0.8 / 1.8 rem)
const SIZES = {
  elevated2: [0.6, 1.4],
  elevated1: [0.3, 0.7],
  inset: [0.4, 0.9],
};

const rem = (n) => `${Math.round(n * 100) / 100}rem`;

/** The two-shadow `box-shadow` of a surface. kind: 'elevated2' | 'elevated1' | 'inset'. */
export function reliefShadow(theme, kind) {
  const [base, blurBase] = SIZES[kind];
  const o = theme.strong ? Math.min(0.8, base * 1.3) : base;
  const b = theme.strong ? Math.min(1.8, blurBase * 1.3) : blurBase;
  if (kind === 'inset') {
    return `inset ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}, inset ${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}`;
  }
  return `${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}, ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}`;
}
