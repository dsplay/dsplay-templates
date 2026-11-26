import {
  contrast, luminance, mix, parseColor, scale, toHex,
} from './color';

// Light comes from the top-left: L is the highlight (top/left), D the shade (bottom/right).
// Every card has the same color as the base, which is what makes the relief work.
const PRESETS = {
  light: {
    base: '#E4E9F0',
    light: '#FFFFFF',
    dark: '#9AA8BE',
    darkStrong: '#8F9DB4',
    lightStrong: '#FFFFFF',
    text: '#151618',
    muted: '#4A4F57',
    primary: '#1F5FA3',
    onPrimary: '#FFFFFF',
  },
  dark: {
    base: '#23272E',
    light: '#3A414D',
    dark: '#0E1013',
    darkStrong: '#07080A',
    lightStrong: '#454C59',
    text: '#F2F4F8',
    muted: '#B8C0CC',
    primary: '#6DB3F2',
    onPrimary: '#151618',
  },
};

const MIN_TEXT_CONTRAST = 4.5;

function readable(color, base, fallback) {
  return parseColor(color) && contrast(color, base) >= MIN_TEXT_CONTRAST ? color : fallback;
}

/** Highlight and shade for any base color (rule of the spec, section 3.2). */
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

/**
 * @param {object} options
 * @param {string} options.mode 'light' | 'dark' | 'custom'
 * @param {string} [options.primary]
 * @param {string} [options.text]
 * @param {string} [options.background]
 * @param {string} [options.reliefStrength] 'normal' | 'strong'
 */
export default function buildTheme({
  mode, primary, text, background, reliefStrength,
}) {
  const strong = reliefStrength === 'strong';
  const preset = PRESETS[mode === 'dark' ? 'dark' : 'light'];
  let theme;

  if (mode === 'custom' && parseColor(background)) {
    const base = toHex(parseColor(background));
    const shades = shadowsFor(base);
    // the preset inks first; mid grays need pure black/white to reach 4.5:1
    const defaultText = ['#151618', '#F2F4F8', '#000000', '#FFFFFF']
      .find((ink) => contrast(ink, base) >= MIN_TEXT_CONTRAST)
      || (contrast('#000000', base) >= contrast('#FFFFFF', base) ? '#000000' : '#FFFFFF');
    const color = readable(text, base, defaultText);
    const accent = parseColor(primary) ? primary : preset.primary;
    theme = {
      base,
      ...shades,
      text: color,
      muted: mix(color, base, 0.3),
      primary: accent,
      onPrimary: contrast('#FFFFFF', accent) >= contrast('#151618', accent) ? '#FFFFFF' : '#151618',
    };
  } else {
    theme = { ...preset };
  }

  const out = {
    mode,
    base: theme.base,
    light: strong ? theme.lightStrong : theme.light,
    dark: strong ? theme.darkStrong : theme.dark,
    text: theme.text,
    muted: readable(theme.muted, theme.base, theme.text),
    primary: theme.primary,
    onPrimary: theme.onPrimary,
    strong,
  };
  // smooth flat panel used when there is no photo at all: accent at 15% over the base
  out.panel = mix(out.base, out.primary, 0.15);
  // the accent as TEXT (category, "Read more"): only when it reads on the base, else the text color
  out.accentText = readable(out.primary, out.base, out.text);
  return out;
}

// offset / blur in rem; the relief is decoration, so "strong" only enlarges it a little (<= 0.8 / 1.8 rem)
const SIZES = {
  elevated2: [0.6, 1.4],
  elevated1: [0.3, 0.7],
  inset: [0.4, 0.9],
};

function sizeOf(kind, strong) {
  const [offset, blur] = SIZES[kind];
  if (!strong) {
    return [offset, blur];
  }
  return [Math.min(0.8, offset * 1.3), Math.min(1.8, blur * 1.3)];
}

const rem = (n) => `${Math.round(n * 100) / 100}rem`;

/** The two-shadow `box-shadow` of a surface. kind: 'elevated2' | 'elevated1' | 'inset'. */
export function reliefShadow(theme, kind) {
  const [o, b] = sizeOf(kind, theme.strong);
  if (kind === 'inset') {
    return `inset ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}, inset ${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}`;
  }
  return `${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}, ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}`;
}

// The bar's relief is bigger than the RSS one because 1 rem is only 4.33 px on a 52 px bar (spec M-014 v2 section 2.1):
// set a: offset 0.6 / blur 1.2 rem; other sets: 0.4 / 0.9; "strong" adds 0.2 rem to both. kind: 'elevated1' | 'inset'.
export function barShadow(theme, kind, set) {
  const extra = theme.strong ? 0.2 : 0;
  const o = (set === 'a' ? 0.6 : 0.4) + extra;
  const b = (set === 'a' ? 1.2 : 0.9) + extra;
  if (kind === 'inset') {
    return `inset ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}, inset ${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}`;
  }
  return `${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}, ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}`;
}
