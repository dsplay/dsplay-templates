import { describe, it, expect } from 'vitest';
import {
  conditionOf, isDay, parseMedia, temperature, windOf,
} from './weather';
import { dayLabel } from './date';

const media = (extra) => ({
  result: {
    validity: '2999-01-01T00:00:00Z',
    showOutdated: true,
    data: {
      weather: {
        city: 'X',
        current: {
          code: 800, temp: 23, min: 12, max: 27, humidity: 78, wind: 4.58, sunrise: '05:00', sunset: '18:00',
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          code: 800, date: `2026-11-${10 + i}`, min: 10 + i, max: 20 + i,
        })),
        ...extra,
      },
    },
  },
});

describe('conditionOf', () => {
  it('maps the codes of the base spec', () => {
    expect(conditionOf(200, true)).toEqual({ family: 'rain', icon: 'thunder', key: 'Thunderstorm' });
    expect(conditionOf(300, true).key).toBe('Drizzle');
    expect(conditionOf(500, true).icon).toBe('rain');
    expect(conditionOf(600, true).family).toBe('snow');
    expect(conditionOf(700, true).icon).toBe('mist');
    expect(conditionOf(800, true).icon).toBe('clear-day');
    expect(conditionOf(800, false).icon).toBe('clear-night');
    expect(conditionOf(801, false)).toEqual({ family: 'clear', icon: 'few-clouds-night', key: 'Partly cloudy' });
    expect(conditionOf(804, true).key).toBe('Overcast');
    expect(conditionOf(900, true)).toEqual({ family: 'clouds', icon: 'clouds', key: '' });
  });
});

describe('day and night', () => {
  it('by the sun times; 06:00-18:00 without them', () => {
    expect(isDay({ sunrise: '05:00', sunset: '18:00' }, new Date(2026, 10, 15, 17, 59))).toBe(true);
    expect(isDay({ sunrise: '05:00', sunset: '18:00' }, new Date(2026, 10, 15, 18, 0))).toBe(false);
    expect(isDay({}, new Date(2026, 10, 15, 5, 59))).toBe(false);
    expect(isDay(null, new Date(2026, 10, 15, 6, 0))).toBe(true);
  });
});

describe('units', () => {
  it('temperature: celsius or fahrenheit, integer', () => {
    expect(temperature(23, 'celsius')).toBe(23);
    expect(temperature(23, 'fahrenheit')).toBe(73);
    expect(temperature(-0.4, 'celsius')).toBe(-0);
  });

  it('wind km/h = m/s x 3.6 integer; m/s with one decimal; independent of the temperature unit', () => {
    expect(windOf(4.58, 'kmh', 'pt')).toEqual({ value: '16', unit: 'km/h' });
    expect(windOf(4.58, 'ms', 'pt')).toEqual({ value: '4,6', unit: 'm/s' });
    expect(windOf(4.58, 'ms', 'en')).toEqual({ value: '4.6', unit: 'm/s' });
    expect(windOf(4.58, 'bad', 'pt')).toEqual({ value: '16', unit: 'km/h' });
  });

  it('wind 0 shows 0; missing, negative or not a number: nothing', () => {
    expect(windOf(0, 'kmh', 'pt')).toEqual({ value: '0', unit: 'km/h' });
    expect(windOf(0, 'ms', 'pt')).toEqual({ value: '0,0', unit: 'm/s' });
    expect(windOf(undefined, 'kmh', 'pt')).toBeNull();
    expect(windOf('x', 'kmh', 'pt')).toBeNull();
    expect(windOf(-1, 'kmh', 'pt')).toBeNull();
  });
});

describe('parseMedia', () => {
  const now = new Date(2026, 10, 15, 12, 0);

  it('uses the first 5 days of a service that sends more', () => {
    expect(parseMedia(media(), now).days).toHaveLength(5);
    expect(parseMedia(media(), now).days[0].date).toBe('2026-11-10');
  });

  it('only the days that exist: 3, 1 and 0', () => {
    expect(parseMedia(media({ forecast: media().result.data.weather.forecast.slice(0, 3) }), now).days).toHaveLength(3);
    expect(parseMedia(media({ forecast: [] }), now).days).toHaveLength(0);
    expect(parseMedia(media({ forecast: undefined }), now).days).toHaveLength(0);
  });

  it('unavailable without data, with outdated data and showOutdated false', () => {
    expect(parseMedia({}, now)).toBeNull();
    expect(parseMedia({ result: { data: {} } }, now)).toBeNull();
    const old = media();
    old.result.validity = '2000-01-01T00:00:00Z';
    expect(parseMedia(old, now).outdatedAt).toBeInstanceOf(Date);
    old.result.showOutdated = false;
    expect(parseMedia(old, now)).toBeNull();
  });
});

describe('dayLabel', () => {
  it('weekday and date by the locale (mm/dd only for en_us)', () => {
    expect(dayLabel('2026-04-09', 'pt_br')).toEqual({ day: 'Qui', date: '09/04' });
    expect(dayLabel('2026-04-09', 'en_us')).toEqual({ day: 'Thu', date: '04/09' });
    expect(dayLabel('2026-04-09', 'en_gb')).toEqual({ day: 'Thu', date: '09/04' });
    expect(dayLabel('nope', 'pt')).toBeNull();
  });
});
