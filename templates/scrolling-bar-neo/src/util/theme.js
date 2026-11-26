import {
  contrast, luminance, mix, parseColor, scale, toHex,
} from './color';

// Neumorphic theme (spec M-013 v2, section 5). Light comes from the top-left: L is the highlight, D the shade.
// Every surface has the same color as the base, which is what makes the relief work.
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
const INKS = ['#151618', '#F2F4F8', '#000000', '#FFFFFF'];

// Text inside an inset sits on the shadow peaks: it must read on the base, the shade and the highlight.
const worst = (ink, base, shades) => Math.min(
  contrast(ink, base),
  contrast(ink, shades.dark),
  contrast(ink, shades.light),
);

/**
 * A shade the ink cannot read on is pulled back toward the base until it can (mid-gray bases: no ink reads on both peaks;
 * the relief gives way, the text does not). Pure white/black shades on the other side stay as they are.
 */
function readableShade(ink, base, shade) {
  for (let t = 1; t > 0; t -= 0.1) {
    const candidate = mix(base, shade, t);
    if (contrast(ink, candidate) >= MIN_TEXT_CONTRAST) {
      return candidate;
    }
  }
  return base;
}

/** Highlight and shade for any base color (spec: rule for extreme bases). */
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
  let theme = preset;

  if (mode === 'custom' && parseColor(background)) {
    const base = toHex(parseColor(background));
    const shades = shadowsFor(base);
    const inkOk = (ink) => worst(ink, base, shades) >= MIN_TEXT_CONTRAST;
    const fallbackInk = INKS.find(inkOk)
      || (contrast('#000000', base) >= contrast('#FFFFFF', base) ? '#000000' : '#FFFFFF');
    const ink = parseColor(text) && inkOk(text) ? text : fallbackInk;
    Object.keys(shades).forEach((key) => {
      shades[key] = readableShade(ink, base, shades[key]);
    });
    const accent = parseColor(primary) ? primary : preset.primary;
    theme = {
      base,
      ...shades,
      text: ink,
      muted: mix(ink, base, 0.3),
      primary: accent,
      onPrimary: contrast('#FFFFFF', accent) >= contrast('#151618', accent) ? '#FFFFFF' : '#151618',
    };
  }

  return {
    mode,
    base: theme.base,
    light: strong ? theme.lightStrong : theme.light,
    dark: strong ? theme.darkStrong : theme.dark,
    text: theme.text,
    // the date and the unit sit on the flat surface (never in an inset): muted must read on the base
    muted: contrast(theme.muted, theme.base) >= MIN_TEXT_CONTRAST ? theme.muted : theme.text,
    primary: theme.primary,
    onPrimary: theme.onPrimary,
    // the accent as TEXT, only when it reads on the base (kept for the standard loading screen, which takes the accent)
    accentText: contrast(theme.primary, theme.base) >= MIN_TEXT_CONTRAST ? theme.primary : theme.text,
    strong,
  };
}

// offset / blur in rem; the relief is decoration, so "strong" only enlarges it a little (<= 0.8 / 1.8 rem). Same as the info bar.
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

const shadowOf = (theme, kind, o, b) => {
  if (kind === 'inset') {
    return `inset ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}, inset ${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}`;
  }
  return `${rem(-o)} ${rem(-o)} ${rem(b)} ${theme.light}, ${rem(o)} ${rem(o)} ${rem(b)} ${theme.dark}`;
};

/** The two-shadow `box-shadow` of a surface. kind: 'elevated2' | 'elevated1' | 'inset'. */
export function reliefShadow(theme, kind) {
  const [o, b] = sizeOf(kind, theme.strong);
  return shadowOf(theme, kind, o, b);
}

// The bar's relief is bigger than the RSS one because 1 rem is only 4.33 px on a 52 px bar (spec M-014 v2 section 2.1):
// set a: offset 0.6 / blur 1.2 rem; other sets: 0.4 / 0.9; "strong" adds 0.2 rem to both. kind: 'elevated1' | 'inset'.
export function barShadow(theme, kind, set) {
  const extra = theme.strong ? 0.2 : 0;
  return shadowOf(theme, kind, (set === 'a' ? 0.6 : 0.4) + extra, (set === 'a' ? 1.2 : 0.9) + extra);
}
