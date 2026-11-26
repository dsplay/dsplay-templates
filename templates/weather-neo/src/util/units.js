// Temperatures arrive in Celsius; wind in m/s (assumed, spec weather-base section 1).

export const isNumber = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

/** "27º" in the chosen unit (integer), or '' without a number. */
export function tempText(celsius, unit) {
  if (!isNumber(celsius)) {
    return '';
  }
  const c = Number(celsius);
  return `${Math.round(unit === 'fahrenheit' ? (c * 9) / 5 + 32 : c)}º`;
}

/**
 * Wind from m/s: 'kmh' (default): "16 km/h" (x 3.6, integer); 'ms': "4,6 m/s" (one decimal). Independent of the temperature unit.
 * '' without a number; 0 shows 0.
 */
export function windText(ms, windUnit, locale) {
  if (!isNumber(ms) || Number(ms) < 0) {
    return '';
  }
  const v = Number(ms);
  if (windUnit === 'ms') {
    const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
    const text = v.toFixed(1);
    return `${['pt', 'es', 'it', 'de', 'nl'].indexOf(lng) >= 0 ? text.replace('.', ',') : text} m/s`;
  }
  return `${Math.round(v * 3.6)} km/h`;
}
