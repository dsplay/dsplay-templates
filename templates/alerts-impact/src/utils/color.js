// Plate color (`color_primary`) and the ink that reads on it (tokens-impact.md section 2). No color-mix, no CSS vars: plain JS.

export const INK = '#141414';
export const PAPER = '#FFFFFF';
export const DEFAULT_PLATE = '#FFD600';

/** "#RGB" / "#RRGGBB" (with or without "#") -> "#RRGGBB" upper case; anything else -> fallback. */
export function normalizeColor(value, fallback = DEFAULT_PLATE) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value || '').trim());
  if (!match) {
    return fallback;
  }
  const digits = match[1].length === 3 ? match[1].replace(/./g, '$&$&') : match[1];
  return `#${digits.toUpperCase()}`;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}

/** WCAG 2.x contrast ratio of two "#RRGGBB" colors. */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Ink for symbols painted straight on the plate: ink if >= 7:1, else white if >= 4.5:1, else ink. */
export function inkFor(plate) {
  if (contrast(INK, plate) >= 7) {
    return INK;
  }
  return contrast(PAPER, plate) >= 4.5 ? PAPER : INK;
}
