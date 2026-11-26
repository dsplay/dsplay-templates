// Small color helpers (hex only). Everything here is plain arithmetic: no CSS variables, no color-mix().

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

const NAMED = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  blue: '#0000ff',
  green: '#008000',
  gray: '#808080',
  grey: '#808080',
  orange: '#ffa500',
  darkorange: '#ff8c00',
  teal: '#008080',
  navy: '#000080',
  yellow: '#ffff00',
};

/** @returns {[number, number, number] | null} */
export function parseColor(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const raw = value.trim().toLowerCase();
  const hex = NAMED[raw] || raw;
  const match = HEX.exec(hex);
  if (!match) {
    return null;
  }
  let digits = match[1];
  if (digits.length === 3) {
    digits = digits.split('').map((c) => c + c).join('');
  }
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16));
}

const clampByte = (n) => Math.max(0, Math.min(255, Math.round(n)));

export function toHex(rgb) {
  return `#${rgb.map((n) => `0${clampByte(n).toString(16)}`.slice(-2)).join('')}`;
}

export function toRgba(color, alpha) {
  const rgb = parseColor(color) || [0, 0, 0];
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

/** Moves `color` toward `target` by `amount` (0..1). */
export function mix(color, target, amount) {
  const a = parseColor(color);
  const b = parseColor(target);
  if (!a || !b) {
    return color;
  }
  return toHex(a.map((n, i) => n + (b[i] - n) * amount));
}

/** Multiplies each channel (0 = black, 1 = same). */
export function scale(color, factor) {
  const rgb = parseColor(color);
  return rgb ? toHex(rgb.map((n) => n * factor)) : color;
}

const channel = (n) => {
  const s = n / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance (0..1). */
export function luminance(color) {
  const rgb = parseColor(color);
  if (!rgb) {
    return 0;
  }
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

/** WCAG contrast ratio between two colors (1..21). */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
