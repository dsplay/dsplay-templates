/**
 * @typedef {object} RgbColor
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */

/**
 * Parses a 3- or 6-digit hex color into its RGB components.
 * @param {string} hexColor - e.g. `#fff` or `#ffffff`
 * @returns {RgbColor | undefined} `undefined` when `hexColor` isn't a valid hex color
 */
export function hexToRgbObject(hexColor) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }

  const result2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hexColor);
  if (result2) {
    return {
      r: parseInt(`${result2[1]}${result2[1]}`, 16),
      g: parseInt(`${result2[2]}${result2[2]}`, 16),
      b: parseInt(`${result2[3]}${result2[3]}`, 16),
    };
  }

  return undefined;
}

/**
 * Converts a hex color into a CSS `rgb(...)` string.
 * @param {string} hexColor - e.g. `#fff` or `#ffffff`
 * @returns {string} A `rgb(r, g, b)` string, or `'transparent'` when `hexColor` isn't valid
 */
export function hexToRgb(hexColor) {
  const { r, g, b } = hexToRgbObject(hexColor) || {};

  if ((r && g && b) === undefined) return 'transparent';

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts a hex color into a CSS `rgba(...)` string.
 * @param {string} hexColor - e.g. `#fff` or `#ffffff`
 * @param {number} alpha - Alpha value between 0 and 1
 * @returns {string} A `rgba(r, g, b, alpha)` string, or `'transparent'` when `hexColor` isn't valid
 */
export function hexToRgba(hexColor, alpha) {
  const { r, g, b } = hexToRgbObject(hexColor) || {};

  if ((r && g && b) === undefined) return 'transparent';

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
