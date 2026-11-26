import { windText } from './weather';

/** Humidity, wind and sun of the current weather; each only if the data exists (no "--", no invented 0). */
export default function detailsOf(current, windUnit, locale) {
  const humidity = Number(current.humidity);
  const sun = /^\d{1,2}:\d{2}/.test(String(current.sunrise || '')) && /^\d{1,2}:\d{2}/.test(String(current.sunset || ''))
    ? `${String(current.sunrise).slice(0, 5)}–${String(current.sunset).slice(0, 5)}`
    : null;
  return {
    humidity: current.humidity === undefined || current.humidity === null || current.humidity === '' || !Number.isFinite(humidity) ? null : Math.round(humidity),
    wind: windText(current.wind, windUnit, locale),
    sun,
  };
}
