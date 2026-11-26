import plainText from './text';

// Weather data model of the current template: media.result = { validity, showOutdated, data: { weather: { city, country, current, forecast[] } } }.
// Temperatures arrive in Celsius; `unit` converts on screen. Wind arrives in m/s (assumed, Weatherbit default).

/** code -> { group, icon (day variant), textKey, family } (weather-base 4) */
export function groupOf(code) {
  const c = Number(code);
  if (c >= 200 && c <= 233) {
    return { group: 'thunder', icon: 'thunder', text: 'Thunderstorm', family: 'rain' };
  }
  if (c >= 300 && c <= 302) {
    return { group: 'drizzle', icon: 'rain', text: 'Drizzle', family: 'rain' };
  }
  if (c >= 500 && c <= 522) {
    return { group: 'rain', icon: 'rain', text: 'Rain', family: 'rain' };
  }
  if (c >= 600 && c <= 623) {
    return { group: 'snow', icon: 'snow', text: 'Snow', family: 'snow' };
  }
  if (c >= 700 && c <= 751) {
    return { group: 'mist', icon: 'mist', text: 'Fog', family: 'mist' };
  }
  if (c === 800) {
    return { group: 'clear', icon: 'clear', text: 'Clear sky', family: 'clear' };
  }
  if (c === 801) {
    return { group: 'few', icon: 'few-clouds', text: 'Partly cloudy', family: 'clear' };
  }
  if (c === 802 || c === 803) {
    return { group: 'clouds', icon: 'clouds', text: 'Cloudy', family: 'clouds' };
  }
  if (c === 804) {
    return { group: 'overcast', icon: 'clouds', text: 'Overcast', family: 'clouds' };
  }
  return { group: 'unknown', icon: 'clouds', text: 'Unknown', family: 'clouds' };
}

/** The file name of the icon: clear and few-clouds have day and night variants. */
export function iconName(icon, day) {
  return icon === 'clear' || icon === 'few-clouds' ? `${icon}-${day ? 'day' : 'night'}` : icon;
}

const toMinutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Day or night: sunrise/sunset of `current` against the device clock; without them, day is 06:00 to 18:00. */
export function isDay(current, now) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const rise = toMinutes(current && current.sunrise);
  const set = toMinutes(current && current.sunset);
  if (rise !== null && set !== null && rise < set) {
    return minutes >= rise && minutes < set;
  }
  return minutes >= 360 && minutes < 1080;
}

const number = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));

/** Temperature in the chosen unit, rounded (Fahrenheit = C x 9/5 + 32). null stays null. */
export function toUnit(celsius, unit) {
  const c = number(celsius);
  if (c === null) {
    return null;
  }
  return Math.round(unit === 'fahrenheit' ? (c * 9) / 5 + 32 : c);
}

/**
 * The wind text part: `wind_unit` 'kmh' (default) = m/s x 3.6, rounded to an integer, label km/h; 'ms' = m/s unchanged with one
 * decimal (comma or dot by locale), label m/s. Independent of `unit` (temperature); no mph. 0 shows 0; missing, negative or
 * non-numeric: null (the item disappears).
 * @returns {{ value: string, label: string } | null}
 */
export function windText(ms, windUnit, locale) {
  const w = number(ms);
  if (w === null || w < 0) {
    return null;
  }
  if (windUnit === 'ms') {
    const fixed = (Math.round(w * 10) / 10).toFixed(1);
    const dot = ['en'].indexOf(String(locale || 'en').toLowerCase().split(/[_-]/)[0]) !== -1;
    return { value: dot ? fixed : fixed.replace('.', ','), label: 'm/s' };
  }
  return { value: String(Math.round(w * 3.6)), label: 'km/h' };
}

const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};
const pad = (n) => (n < 10 ? `0${n}` : String(n));

/** 'pt_BR' -> 'pt'; no table -> 'en' */
export function languageOf(locale) {
  const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
  return WEEKDAYS[lng] ? lng : 'en';
}

/** { weekday: 'Qui', date: '09/04' } from 'YYYY-MM-DD'; mm/dd only for en_us. null if the date is invalid. No Intl. */
export function formatDay(dateText, locale) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateText || ''));
  if (!m) {
    return null;
  }
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const us = String(locale || '').toLowerCase().replace('-', '_') === 'en_us';
  return {
    weekday: WEEKDAYS[languageOf(locale)][date.getDay()],
    date: us ? `${pad(date.getMonth() + 1)}/${pad(date.getDate())}` : `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`,
  };
}

/**
 * The weather to show, or a reason it is unavailable.
 * @returns {{ ok: false } | { ok: true, city: string, current: object, forecast: object[], outdated: Date|null }}
 */
export function readWeather(media, now) {
  const result = media && media.result;
  const weather = result && result.data && result.data.weather;
  const current = weather && weather.current;
  if (!current || number(current.temp) === null) {
    return { ok: false };
  }
  let outdated = null;
  const validity = result.validity ? new Date(result.validity) : null;
  if (validity && !Number.isNaN(validity.getTime()) && validity.getTime() < now.getTime()) {
    if (result.showOutdated === false) {
      return { ok: false };
    }
    outdated = validity;
  }
  const forecast = (Array.isArray(weather.forecast) ? weather.forecast : [])
    .filter((day) => day && number(day.max) !== null && number(day.min) !== null);
  return {
    ok: true,
    city: plainText(weather.city),
    current,
    forecast,
    outdated,
  };
}

/** 'HH:MM' of today's date, or 'dd/mm' (mm/dd in en_us) when it is another day, for the outdated badge. */
export function outdatedLabel(validity, now, locale) {
  const sameDay = validity.getFullYear() === now.getFullYear() && validity.getMonth() === now.getMonth() && validity.getDate() === now.getDate();
  if (sameDay) {
    return { kind: 'time', value: `${pad(validity.getHours())}:${pad(validity.getMinutes())}` };
  }
  const us = String(locale || '').toLowerCase().replace('-', '_') === 'en_us';
  const d = pad(validity.getDate());
  const mo = pad(validity.getMonth() + 1);
  return { kind: 'date', value: us ? `${mo}/${d}` : `${d}/${mo}` };
}
