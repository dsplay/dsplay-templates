import { describe, it, expect } from 'vitest';
import { exampleResult } from '../test-support/fixture';
import {
  addDays, daysAway, daysBetween, formatDate, holidayOn, isoOf, lngOf, monthGrid, readHolidays, readLongWeekends, viewOf, weekdayOf,
} from './model';
import { NAMES, DATE_PATTERNS, WEEK_START } from './names';

describe('dates', () => {
  it('counts calendar days, not instants', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-09-01', '2026-09-07')).toBe(6);
    expect(weekdayOf('2026-09-07')).toBe(1);
    expect(daysAway('2026-09-07', '2026-09-01')).toBe(0);
  });

  it('takes the day on the screen clock', () => {
    expect(isoOf(new Date(2026, 8, 7, 23, 59))).toBe('2026-09-07');
    expect(isoOf(new Date(2026, 0, 2, 0, 0))).toBe('2026-01-02');
  });

  it('speaks only the template languages, English for any other', () => {
    expect(lngOf('pt_br')).toBe('pt');
    expect(lngOf('de-AT')).toBe('de');
    expect(lngOf('ja_jp')).toBe('en');
    expect(lngOf(undefined)).toBe('en');
  });

  it('writes a date in the order of the language', () => {
    expect(formatDate('2026-09-07', 'pt')).toBe('segunda-feira, 7 de setembro');
    expect(formatDate('2026-09-07', 'en')).toBe('Monday, September 7');
    expect(formatDate('2026-09-07', 'de', { short: true })).toBe('Mo, 7. Sep');
  });

  it('has complete names for every language', () => {
    Object.keys(NAMES).forEach((lng) => {
      expect(NAMES[lng].months).toHaveLength(12);
      expect(NAMES[lng].monthsShort).toHaveLength(12);
      expect(NAMES[lng].weekdays).toHaveLength(7);
      expect(NAMES[lng].weekdaysShort).toHaveLength(7);
      expect(DATE_PATTERNS[lng]).toMatch(/{wd}.*{d}|{wd}.*{m}/);
      expect([0, 1]).toContain(WEEK_START[lng]);
    });
  });
});

describe('monthGrid', () => {
  it('lays a month out in whole weeks, padded with empty cells', () => {
    const grid = monthGrid('2026-09-15', 0);
    expect(grid.weeks.every((week) => week.length === 7)).toBe(true);
    expect(grid.weeks[0].findIndex(Boolean)).toBe(2);
    expect(grid.weeks.flat().filter(Boolean)).toHaveLength(30);
    expect(monthGrid('2026-09-15', 1).weeks[0].findIndex(Boolean)).toBe(1);
  });

  it('handles December and a month that starts on the first day of the week', () => {
    expect(monthGrid('2026-12-31', 0).weeks.flat().filter(Boolean)).toHaveLength(31);
    expect(monthGrid('2026-02-10', 0).weeks).toHaveLength(4);
  });
});

describe('readHolidays', () => {
  it('keeps the entries with a date and a name, in date order, and fills what is missing', () => {
    const list = readHolidays({
      holidays: [
        { date: '2026-09-07', name: ' Independência ', kind: 'independence', scope: 'national', type: 'public' },
        { date: 'nope', name: 'x' },
        { date: '2026-01-01', name: '' },
        { date: '2026-02-14', name: 'Carnaval', days: 5, kind: 'unknown', scope: 'weird', type: 'optional' },
        null,
      ],
    });
    expect(list.map((h) => h.name)).toEqual(['Carnaval', 'Independência']);
    expect(list[0]).toMatchObject({ days: 5, kind: 'generic', scope: 'national', type: 'optional' });
  });

  it('is empty for a missing or broken answer', () => {
    expect(readHolidays(undefined)).toEqual([]);
    expect(readHolidays({ holidays: 'x' })).toEqual([]);
    expect(readLongWeekends({})).toEqual([]);
  });
});

describe('viewOf with the example answer (São Paulo)', () => {
  const result = exampleResult();

  it('is on a holiday: the holiday is current and the next one is the next day off', () => {
    const view = viewOf(result, '2026-09-07');
    expect(view.current.map((h) => h.name)).toEqual(['Dia da Independência']);
    expect(view.next.date > '2026-09-07').toBe(true);
    expect(view.empty).toBe(false);
  });

  it('is on an ordinary day: nothing current, the next holiday counts the days', () => {
    const view = viewOf(result, '2026-09-01');
    expect(view.current).toEqual([]);
    expect(view.next.name).toBe('Dia da Independência');
    expect(daysAway(view.today, view.next.date)).toBe(6);
    expect(view.longWeekend).toMatchObject({ from: '2026-09-05', to: '2026-09-07', days: 3 });
  });

  it('keeps a long holiday current on each of its days', () => {
    const carnival = readHolidays(result).find((h) => h.name === 'Carnaval');
    expect(carnival.days).toBe(5);
    expect(viewOf(result, '2026-02-16').current.map((h) => h.name)).toContain('Carnaval');
    expect(viewOf(result, '2026-02-18').current.map((h) => h.name)).toContain('Carnaval');
  });

  it('skips an optional day when it looks for the next day off, and falls back to it when it is all there is', () => {
    const only = { holidays: [{ date: '2026-06-04', name: 'Corpo de Deus', type: 'optional' }] };
    expect(viewOf(only, '2026-06-01').next.name).toBe('Corpo de Deus');
    const both = { holidays: [{ date: '2026-06-04', name: 'Corpo de Deus', type: 'optional' }, { date: '2026-06-10', name: 'Dia X', type: 'public' }] };
    expect(viewOf(both, '2026-06-01').next.name).toBe('Dia X');
  });

  it('is empty when nothing is on and nothing is ahead', () => {
    expect(viewOf({ holidays: [] }, '2026-06-01').empty).toBe(true);
    expect(viewOf(undefined, '2026-06-01').empty).toBe(true);
    expect(viewOf(result, '2031-01-01').empty).toBe(true);
  });

  it('finds the holiday of a day, a public one before an optional one', () => {
    const list = readHolidays({ holidays: [{ date: '2026-02-14', name: 'Carnaval', days: 5, type: 'optional' }, { date: '2026-02-16', name: 'Outro', type: 'public' }] });
    expect(holidayOn(list, '2026-02-16').name).toBe('Outro');
    expect(holidayOn(list, '2026-02-15').name).toBe('Carnaval');
    expect(holidayOn(list, '2026-02-20')).toBeNull();
  });

  it('reads the long weekends with their length', () => {
    expect(readLongWeekends({ longWeekends: [{ from: '2026-09-05', to: '2026-09-07' }] })).toEqual([{ from: '2026-09-05', to: '2026-09-07', days: 3 }]);
  });
});
