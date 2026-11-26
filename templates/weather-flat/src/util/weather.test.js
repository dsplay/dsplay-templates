import { describe, it, expect } from 'vitest';
import {
  groupOf, iconName, isDay, toUnit, windText, formatDay, readWeather, outdatedLabel, languageOf,
} from './weather';
import { recolor, familyColor } from './palette';

describe('groupOf', () => {
  it('maps the service codes to icon, text and family', () => {
    expect(groupOf(211)).toMatchObject({ icon: 'thunder', text: 'Thunderstorm', family: 'rain' });
    expect(groupOf(300)).toMatchObject({ icon: 'rain', text: 'Drizzle' });
    expect(groupOf(502)).toMatchObject({ icon: 'rain', text: 'Rain' });
    expect(groupOf(601)).toMatchObject({ icon: 'snow', family: 'snow' });
    expect(groupOf(741)).toMatchObject({ icon: 'mist', text: 'Fog' });
    expect(groupOf(800)).toMatchObject({ icon: 'clear', family: 'clear' });
    expect(groupOf(801)).toMatchObject({ icon: 'few-clouds', family: 'clear' });
    expect(groupOf(803)).toMatchObject({ icon: 'clouds', text: 'Cloudy' });
    expect(groupOf(804)).toMatchObject({ text: 'Overcast' });
    expect(groupOf(900)).toMatchObject({ icon: 'clouds', text: 'Unknown', family: 'clouds' });
    expect(groupOf('abc')).toMatchObject({ text: 'Unknown' });
  });
  it('day and night variants only for clear and few clouds', () => {
    expect(iconName('clear', false)).toBe('clear-night');
    expect(iconName('few-clouds', true)).toBe('few-clouds-day');
    expect(iconName('rain', false)).toBe('rain');
  });
});

describe('isDay', () => {
  const at = (h, m) => new Date(2026, 10, 15, h, m);
  it('uses sunrise and sunset of the current weather', () => {
    const current = { sunrise: '05:30', sunset: '17:45' };
    expect(isDay(current, at(5, 29))).toBe(false);
    expect(isDay(current, at(5, 30))).toBe(true);
    expect(isDay(current, at(17, 44))).toBe(true);
    expect(isDay(current, at(17, 45))).toBe(false);
  });
  it('without them, day is 06:00 to 18:00', () => {
    expect(isDay({}, at(6, 0))).toBe(true);
    expect(isDay({}, at(18, 0))).toBe(false);
    expect(isDay(undefined, at(12, 0))).toBe(true);
  });
});

describe('units', () => {
  it('converts temperature and wind', () => {
    expect(toUnit(23, 'celsius')).toBe(23);
    expect(toUnit(23, 'fahrenheit')).toBe(73);
    expect(toUnit(-5.4, 'celsius')).toBe(-5);
    expect(toUnit(undefined, 'celsius')).toBeNull();
  });
  it('wind: km/h by default, m/s on request, independent of the temperature unit, no mph', () => {
    expect(windText(4.58, 'kmh', 'pt')).toEqual({ value: '16', label: 'km/h' });
    expect(windText(4.58, undefined, 'pt')).toEqual({ value: '16', label: 'km/h' });
    expect(windText(4.58, 'invalid', 'pt')).toEqual({ value: '16', label: 'km/h' });
    expect(windText(4.58, 'ms', 'pt_BR')).toEqual({ value: '4,6', label: 'm/s' });
    expect(windText(4.58, 'ms', 'en_us')).toEqual({ value: '4.6', label: 'm/s' });
    expect(windText(3, 'ms', 'es')).toEqual({ value: '3,0', label: 'm/s' });
  });
  it('wind: 0 shows 0; missing, negative and non-numeric disappear', () => {
    expect(windText(0, 'kmh', 'pt')).toEqual({ value: '0', label: 'km/h' });
    expect(windText(0, 'ms', 'en')).toEqual({ value: '0.0', label: 'm/s' });
    ['x', undefined, null, '', -1].forEach((bad) => expect(windText(bad, 'kmh', 'pt')).toBeNull());
  });
});

describe('formatDay', () => {
  it('weekday and date by locale, no Intl', () => {
    expect(formatDay('2020-04-09', 'pt_BR')).toEqual({ weekday: 'Qui', date: '09/04' });
    expect(formatDay('2020-04-09', 'en_us')).toEqual({ weekday: 'Thu', date: '04/09' });
    expect(formatDay('2020-04-09', 'es_ES')).toEqual({ weekday: 'Jue', date: '09/04' });
    expect(formatDay('2020-04-09', 'de_DE')).toEqual({ weekday: 'Thu', date: '09/04' });
    expect(formatDay('nope', 'pt')).toBeNull();
    expect(languageOf('nl_NL')).toBe('en');
  });
});

describe('readWeather', () => {
  const now = new Date('2026-11-15T12:00:00Z');
  const media = (result) => ({ result });
  const good = (extra) => ({
    validity: '2026-11-15T13:00:00Z',
    showOutdated: true,
    data: { weather: { city: 'Lisboa', current: { code: 800, temp: 20 }, forecast: [{ min: 1, max: 5 }, { min: 'x', max: 3 }] } },
    ...extra,
  });
  it('reads the weather and drops forecast days without min or max', () => {
    const r = readWeather(media(good()), now);
    expect(r.ok).toBe(true);
    expect(r.city).toBe('Lisboa');
    expect(r.forecast).toHaveLength(1);
    expect(r.outdated).toBeNull();
  });
  it('is unavailable without result, current or a numeric temperature', () => {
    expect(readWeather({}, now).ok).toBe(false);
    expect(readWeather(media({}), now).ok).toBe(false);
    expect(readWeather(media({ data: { weather: { current: { temp: 'x' } } } }), now).ok).toBe(false);
  });
  it('outdated data: shown with the badge, or unavailable when showOutdated is false', () => {
    const old = good({ validity: '2026-11-15T10:00:00Z' });
    expect(readWeather(media(old), now).outdated).toBeInstanceOf(Date);
    expect(readWeather(media({ ...old, showOutdated: false }), now).ok).toBe(false);
  });
  it('the badge says the time today, else the date', () => {
    expect(outdatedLabel(new Date(2026, 10, 15, 9, 5), new Date(2026, 10, 15, 12, 0), 'pt')).toEqual({ kind: 'time', value: '09:05' });
    expect(outdatedLabel(new Date(2026, 10, 14, 9, 5), new Date(2026, 10, 15, 12, 0), 'pt')).toEqual({ kind: 'date', value: '14/11' });
    expect(outdatedLabel(new Date(2026, 10, 14, 9, 5), new Date(2026, 10, 15, 12, 0), 'en_us')).toEqual({ kind: 'date', value: '11/14' });
  });
});

describe('palette', () => {
  it('family colors by day and night; unknown family falls back to clouds', () => {
    expect(familyColor('clear', true)).toBe('#1F5FA3');
    expect(familyColor('rain', false)).toBe('#1F2A44');
    expect(familyColor('nope', true)).toBe('#4A5A72');
  });
  it('recolors the icon for light cards only', () => {
    const svg = '<path fill="#FFFFFF"/><path stroke="#FFC83D"/><path stroke="#9AD1FF"/><path fill="#9AB0C4"/>';
    expect(recolor(svg, false)).toBe(svg);
    const light = recolor(svg, true);
    expect(light).toContain('#4A4F57');
    expect(light).toContain('#B26A00');
    expect(light).toContain('#1F5FA3');
    expect(light).not.toContain('#FFFFFF');
  });
});
