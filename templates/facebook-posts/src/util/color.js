export function hexToRgbObject(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const result2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : (result2 ? {
    r: parseInt(result2[1] + '' + result2[1], 16),
    g: parseInt(result2[2] + '' + result2[2], 16),
    b: parseInt(result2[3] + '' + result2[3], 16)
  } : null);
}

export function hexToRgba(hexColor, alpha) {
  const { r, g, b } = hexToRgbObject(hexColor) || {};

  if ((r && g && b) === undefined) return 'transparent';

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}