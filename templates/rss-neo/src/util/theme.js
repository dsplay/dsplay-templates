import {
  contrast, luminance, mix, parseColor, toHex, toRgba,
} from './color';

// Flat look: an opaque card over a plain base, separated by a thin border. No shadows anywhere.
const PRESETS = {
  light: {
    base: '#EEF1F5',
    card: '#FFFFFF',
    border: 'rgba(21,22,24,0.10)',
    text: '#151618',
    muted: '#4A4F57',
    primary: '#1F5FA3',
    onPrimary: '#FFFFFF',
  },
  dark: {
    base: '#15181D',
    card: '#20252C',
    border: 'rgba(255,255,255,0.12)',
    text: '#F2F4F8',
    muted: '#B8C0CC',
    primary: '#6DB3F2',
    onPrimary: '#151618',
  },
};

const MIN_TEXT_CONTRAST = 4.5;
const INKS = ['#151618', '#F2F4F8', '#000000', '#FFFFFF'];

/** `color` if it reads on every surface at 4.5:1, else `fallback`. */
function readable(color, surfaces, fallback) {
  return parseColor(color) && surfaces.every((s) => contrast(color, s) >= MIN_TEXT_CONTRAST) ? color : fallback;
}

/** The preset inks first; mid grays need pure black/white. */
function inkFor(surfaces) {
  return INKS.find((ink) => surfaces.every((s) => contrast(ink, s) >= MIN_TEXT_CONTRAST))
    || (contrast('#000000', surfaces[0]) >= contrast('#FFFFFF', surfaces[0]) ? '#000000' : '#FFFFFF');
}

/**
 * @param {object} options
 * @param {string} options.mode 'light' | 'dark' | 'custom'
 * @param {string} [options.primary]
 * @param {string} [options.text]
 * @param {string} [options.background]
 */
export default function buildTheme({
  mode, primary, text, background,
}) {
  const preset = PRESETS[mode === 'dark' ? 'dark' : 'light'];
  let theme = preset;

  if (mode === 'custom' && parseColor(background)) {
    const base = toHex(parseColor(background));
    const card = luminance(base) > 0.5 ? '#FFFFFF' : mix(base, '#FFFFFF', 0.08);
    const surfaces = [base, card];
    const ink = readable(text, surfaces, inkFor(surfaces));
    const accent = parseColor(primary) ? primary : preset.primary;
    theme = {
      base,
      card,
      border: toRgba(ink, 0.12),
      text: ink,
      muted: mix(ink, card, 0.3),
      primary: accent,
      onPrimary: contrast('#FFFFFF', accent) >= contrast('#151618', accent) ? '#FFFFFF' : '#151618',
    };
  }

  const surfaces = [theme.base, theme.card];
  return {
    mode,
    base: theme.base,
    card: theme.card,
    border: theme.border,
    text: theme.text,
    muted: readable(theme.muted, surfaces, theme.text),
    primary: theme.primary,
    onPrimary: theme.onPrimary,
    // the accent as TEXT (category, "Read more"): only when it reads on the card (and the base), else the text color
    accentText: readable(theme.primary, surfaces, theme.text),
  };
}
