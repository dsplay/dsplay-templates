// Weather: the service's `code` (OpenWeather-like) or the Weatherbit `icon` ("c02d") to one of the 8 icons,
// and the icons recolored per theme (the originals are white/yellow, made for dark backgrounds).

export function iconNameOf(code, icon) {
  const day = !/n$/.test(String(icon || ''));
  const c = Number(code);
  if (c >= 200 && c <= 233) return 'thunder';
  if ((c >= 300 && c <= 302) || (c >= 500 && c <= 522)) return 'rain';
  if (c >= 600 && c <= 623) return 'snow';
  if (c >= 700 && c <= 751) return 'mist';
  if (c === 800) return day ? 'clear-day' : 'clear-night';
  if (c === 801) return day ? 'few-clouds-day' : 'few-clouds-night';
  if (c >= 802 && c <= 804) return 'clouds';
  // no usable code: the Weatherbit icon ("t01d", "r02n", "c02d"...)
  const kind = String(icon || '').charAt(0);
  const digits = Number(String(icon || '').slice(1, 3));
  if (kind === 't') return 'thunder';
  if (kind === 'd' || kind === 'r') return 'rain';
  if (kind === 's') return 'snow';
  if (kind === 'a') return 'mist';
  if (kind === 'c' && digits === 1) return day ? 'clear-day' : 'clear-night';
  if (kind === 'c' && digits === 2) return day ? 'few-clouds-day' : 'few-clouds-night';
  return 'clouds';
}

// Light-base palette (spec M-014 v2 section 2.1, Tico 15/nov): base luminance > 0.4 uses it; dark keeps the originals.
const LIGHT = {
  '#FFFFFF': '#4A4F57', '#9AB0C4': '#4A4F57', '#FFC83D': '#B26A00', '#9AD1FF': '#1F5FA3',
};

const recolor = (color, lightBase) => (lightBase ? (LIGHT[color.toUpperCase()] || color) : color);

/**
 * The SVG as a data URI for <img>, recolored for a light base. Every filled shape gets a 1.6-unit outline in the base
 * color, so a cloud over a sun (or a bolt over a cloud) never merges.
 */
export function iconSource(svg, base, lightBase) {
  const colored = svg
    .replace(/fill="(#[0-9A-Fa-f]{6})"/g, (_, color) => (
      `fill="${recolor(color, lightBase)}" stroke="${base}" stroke-width="1.6" stroke-linejoin="round"`))
    .replace(/<g stroke="(#[0-9A-Fa-f]{6})"/g, (_, color) => `<g stroke="${recolor(color, lightBase)}"`);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(colored)}`;
}
