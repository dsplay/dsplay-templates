import { describe, it, expect } from 'vitest';
import { conditionOf, isDay } from './condition';

describe('conditionOf', () => {
  it('maps codes to text, family and icon (day/night)', () => {
    expect(conditionOf(200, true)).toMatchObject({ text: 'Thunderstorm', family: 'rain', icon: 'thunder' });
    expect(conditionOf(300, true)).toMatchObject({ text: 'Drizzle', icon: 'rain' });
    expect(conditionOf(500, true)).toMatchObject({ text: 'Rain', family: 'rain' });
    expect(conditionOf(600, true)).toMatchObject({ family: 'snow', icon: 'snow' });
    expect(conditionOf(700, true)).toMatchObject({ family: 'mist', icon: 'mist' });
    expect(conditionOf(800, true).icon).toBe('clear-day');
    expect(conditionOf(800, false).icon).toBe('clear-night');
    expect(conditionOf(801, false)).toMatchObject({ icon: 'few-clouds-night', family: 'clear' });
    expect(conditionOf(802, true).text).toBe('Cloudy');
    expect(conditionOf(804, true).text).toBe('Overcast');
  });
  it('unknown codes are clouds with the service text', () => {
    expect(conditionOf(900, true)).toMatchObject({ icon: 'clouds', family: 'clouds', known: false });
    expect(conditionOf(undefined, true).known).toBe(false);
  });
});

describe('isDay', () => {
  const at = (h, m) => new Date(2026, 10, 15, h, m);
  it('compares the clock with sunrise and sunset', () => {
    expect(isDay('05:00', '18:00', at(12, 0))).toBe(true);
    expect(isDay('05:00', '18:00', at(18, 0))).toBe(false);
    expect(isDay('05:00', '18:00', at(4, 59))).toBe(false);
  });
  it('without data: 06:00-18:00', () => {
    expect(isDay('', '', at(6, 0))).toBe(true);
    expect(isDay(undefined, undefined, at(18, 30))).toBe(false);
  });
});
