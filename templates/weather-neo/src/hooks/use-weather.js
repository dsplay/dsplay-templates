import { useMemo } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import { conditionOf, isDay } from '../util/condition';
import { isNumber } from '../util/units';

/**
 * media.result -> what the screen needs, or { ok: false } (indisponível).
 * Outdated data (validity in the past) is shown with a notice when `showOutdated` is true.
 * @param {Date} now
 */
export default function useWeather(now) {
  const media = useMedia();
  const result = media && media.result;

  return useMemo(() => {
    const weather = result && result.data && result.data.weather;
    const current = weather && weather.current;
    if (!current || !isNumber(current.temp)) {
      return { ok: false };
    }
    const validity = result.validity ? new Date(result.validity) : null;
    const validTime = validity && !Number.isNaN(validity.getTime()) ? validity : null;
    const outdated = Boolean(validTime) && now.getTime() > validTime.getTime();
    if (outdated && result.showOutdated === false) {
      return { ok: false };
    }
    const day = isDay(current.sunrise, current.sunset, now);
    const condition = conditionOf(current.code, day);
    const forecast = (Array.isArray(weather.forecast) ? weather.forecast : [])
      .filter((item) => item && isNumber(item.max) && isNumber(item.min))
      .map((item) => ({
        date: item.date,
        max: Number(item.max),
        min: Number(item.min),
        condition: conditionOf(item.code, true),
      }));
    return {
      ok: true,
      city: String(weather.city || ''),
      temp: Number(current.temp),
      min: isNumber(current.min) ? Number(current.min) : null,
      max: isNumber(current.max) ? Number(current.max) : null,
      description: String(current.description || ''),
      humidity: isNumber(current.humidity) ? Number(current.humidity) : null,
      wind: isNumber(current.wind) && Number(current.wind) >= 0 ? Number(current.wind) : null,
      sunrise: /^\d{1,2}:\d{2}/.test(String(current.sunrise || '')) ? String(current.sunrise).slice(0, 5) : '',
      sunset: /^\d{1,2}:\d{2}/.test(String(current.sunset || '')) ? String(current.sunset).slice(0, 5) : '',
      day,
      condition,
      forecast,
      outdated,
      validity: validTime,
    };
  }, [result, now]);
}
