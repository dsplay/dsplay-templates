// The weather model (spec weather-base.md): what `media.result.data.weather` says, turned into what the screen shows.

const ICONS = ['thunder', 'rain', 'snow', 'mist', 'clear-day', 'clear-night', 'few-clouds-day', 'few-clouds-night', 'clouds'];

const num = (value) => (value === null || value === undefined || value === '' ? NaN : Number(value));

/** Code -> { family, icon, key }: background family, icon name and the `t()` key of the text (spec base section 4). */
export function conditionOf(code, day) {
  const c = Number(code);
  const dn = day ? 'day' : 'night';
  if (c >= 200 && c <= 233) return { family: 'rain', icon: 'thunder', key: 'Thunderstorm' };
  if (c >= 300 && c <= 302) return { family: 'rain', icon: 'rain', key: 'Drizzle' };
  if (c >= 500 && c <= 522) return { family: 'rain', icon: 'rain', key: 'Rain' };
  if (c >= 600 && c <= 623) return { family: 'snow', icon: 'snow', key: 'Snow' };
  if (c >= 700 && c <= 751) return { family: 'mist', icon: 'mist', key: 'Fog' };
  if (c === 800) return { family: 'clear', icon: `clear-${dn}`, key: 'Clear sky' };
  if (c === 801) return { family: 'clear', icon: `few-clouds-${dn}`, key: 'Partly cloudy' };
  if (c === 802 || c === 803) return { family: 'clouds', icon: 'clouds', key: 'Cloudy' };
  if (c === 804) return { family: 'clouds', icon: 'clouds', key: 'Overcast' };
  return { family: 'clouds', icon: 'clouds', key: '' };
}

export const isIcon = (name) => ICONS.indexOf(name) !== -1;

const minutesOf = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
};

/** Day or night by the sun times of `current` against the device clock; without them, day is 06:00-18:00. */
export function isDay(current, now) {
  const at = now.getHours() * 60 + now.getMinutes();
  const rise = minutesOf(current && current.sunrise);
  const set = minutesOf(current && current.sunset);
  if (Number.isFinite(rise) && Number.isFinite(set)) {
    return at >= rise && at < set;
  }
  return at >= 360 && at < 1080;
}

/** Celsius as given, or Fahrenheit rounded; always an integer. */
export const temperature = (celsius, unit) => Math.round(unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius);

/**
 * The wind (spec weather-base 1): the service gives m/s. `kmh` (default) = m/s x 3.6, an integer; `ms` = m/s with one decimal (the decimal
 * separator by language). 0 shows 0; missing, negative or not a number: '' (the item goes away).
 * @returns {{ value: string, unit: string } | null}
 */
export function windOf(ms, windUnit, language) {
  const v = num(ms);
  if (!Number.isFinite(v) || v < 0) {
    return null;
  }
  if (windUnit === 'ms') {
    const text = (Math.round(v * 10) / 10).toFixed(1);
    return { value: language === 'en' ? text : text.replace('.', ','), unit: 'm/s' };
  }
  return { value: String(Math.round(v * 3.6)), unit: 'km/h' };
}

/**
 * @param {object} media the template's `media`
 * @param {Date} now
 * @returns {null | { city: string, current: object, days: object[], outdatedAt: Date|null, day: boolean }} null: unavailable
 */
export function parseMedia(media, now) {
  const result = media && media.result;
  const weather = result && result.data && result.data.weather;
  const current = weather && weather.current;
  if (!current || !Number.isFinite(num(current.temp))) {
    return null;
  }
  let outdatedAt = null;
  const validity = result.validity ? new Date(result.validity) : null;
  if (validity && !Number.isNaN(validity.getTime()) && validity.getTime() < now.getTime()) {
    if (result.showOutdated === false) {
      return null;
    }
    outdatedAt = validity;
  }
  const list = Array.isArray(weather.forecast) ? weather.forecast : [];
  // always up to 5 days (the first 5 when the service sends more); only the ones that exist, no placeholders
  const days = list
    .filter((d) => d && Number.isFinite(num(d.max)) && Number.isFinite(num(d.min)))
    .slice(0, 5)
    .map((d) => ({
      code: d.code, date: d.date, min: num(d.min), max: num(d.max),
    }));
  return {
    city: String(weather.city || ''),
    current: {
      code: current.code,
      description: String(current.description || ''),
      temp: num(current.temp),
      min: num(current.min),
      max: num(current.max),
      humidity: num(current.humidity),
      wind: current.wind,
      sunrise: current.sunrise,
      sunset: current.sunset,
    },
    days,
    outdatedAt,
    day: isDay(current, now),
  };
}
