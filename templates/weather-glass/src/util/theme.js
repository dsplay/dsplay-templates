import { contrast, parseColor, toHex } from './color';

// Glass theme (spec weather-glass 3 and 9): the film of the panels, the ink, the accent. Dark is the default.
export const DEFAULT_PRIMARY = '#4B3FC4';
export const DEFAULT_BACKGROUND = '#161C3A';

const FILMS = {
  dark: { image: 'linear-gradient(to bottom, rgba(255,255,255,.14), rgba(255,255,255,.04))', border: 'rgba(255,255,255,.22)', top: 'rgba(255,255,255,.38)' },
  light: { image: 'linear-gradient(to bottom, rgba(255,255,255,.55), rgba(255,255,255,.30))', border: 'rgba(255,255,255,.70)', top: 'rgba(255,255,255,.70)' },
  // with a photo behind: a dark glass (no light gradient)
  photo: { image: 'linear-gradient(rgba(10,12,30,.45), rgba(10,12,30,.45))', border: 'rgba(255,255,255,.22)', top: 'rgba(255,255,255,.38)' },
};

const INKS = ['#151618', '#FFFFFF'];

/**
 * @param {object} p
 * @param {string} p.mode 'dark' | 'light' | 'custom'
 * @param {boolean} p.hasImage a background photo is in use: light does not apply, the glass is dark
 * @param {string} [p.primary] accent
 * @param {string} [p.text] ink (custom only)
 * @param {string} [p.background] base color (custom only)
 */
export default function buildTheme({
  mode, hasImage, primary, text, background,
}) {
  const accent = parseColor(primary) ? toHex(parseColor(primary)) : DEFAULT_PRIMARY;
  const onPrimary = contrast('#FFFFFF', accent) >= contrast('#151618', accent) ? '#FFFFFF' : '#151618';
  let kind = mode === 'light' ? 'light' : 'dark';
  let ink = kind === 'light' ? '#151618' : '#FFFFFF';
  let muted = kind === 'light' ? '#3F4756' : 'rgba(255,255,255,0.8)';
  let base = null;

  if (mode === 'custom' && parseColor(background)) {
    base = toHex(parseColor(background));
    const lightBase = contrast('#FFFFFF', base) < contrast('#151618', base);
    kind = lightBase ? 'light' : 'dark';
    const readable = INKS.find((i) => contrast(i, base) >= 4.5)
      || (contrast('#000000', base) >= contrast('#FFFFFF', base) ? '#000000' : '#FFFFFF');
    ink = parseColor(text) && contrast(text, base) >= 4.5 ? text : readable;
    muted = ink;
  }
  const film = hasImage ? FILMS.photo : FILMS[kind];
  if (hasImage) {
    ink = '#FFFFFF';
    muted = 'rgba(255,255,255,0.8)';
    kind = 'dark';
  }
  return {
    mode: kind,
    custom: base,
    text: ink,
    muted,
    film,
    primary: accent,
    onPrimary,
    // a light theme draws the icons on a dark seal (the icons are white and yellow)
    seal: kind === 'light' && !hasImage,
  };
}
