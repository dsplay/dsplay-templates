import { describe, it, expect } from 'vitest';
import i18n from '../i18n';
import {
  buildCompactDate, buildEventDate, formatTime, normalizeRange,
} from './format-event-date';

const at = (y, mo, d, h = 0, mi = 0) => new Date(y, mo - 1, d, h, mi).toISOString();
const tIn = (lng) => i18n.getFixedT(lng);

describe('buildEventDate stack (vertical bar)', () => {
  it('multi-day: day and time on separate lines, no year, no wrapping PM', () => {
    const date = buildEventDate(at(2023, 7, 12, 21, 25), at(2023, 7, 13, 14, 5), { t: tIn('pt'), locale: 'pt_br', timeFormat: '12h' });
    expect(date.stack).toEqual(['12 jul', '9:25\u00a0PM', '13 jul', '2:05\u00a0PM']);
  });
});

describe('formatTime', () => {
  it('uses 24 h and 12 h', () => {
    const date = new Date(2023, 6, 11, 13, 5);
    expect(formatTime(date, '24h')).toBe('13:05');
    expect(formatTime(date, '12h')).toBe('1:05\u00a0PM');
    expect(formatTime(new Date(2023, 6, 11, 0, 0), '12h')).toBe('12:00\u00a0AM');
    expect(formatTime(new Date(2023, 6, 11, 12, 30), '12h')).toBe('12:30\u00a0PM');
  });
});

describe('buildEventDate', () => {
  const pt = { t: tIn('pt'), locale: 'pt_br', timeFormat: '24h' };

  it('one day: weekday, day, month and year, then the hours', () => {
    expect(buildEventDate(at(2023, 7, 11, 13), at(2023, 7, 11, 14), pt)).toEqual({
      kind: 'one-day',
      parts: ['ter, 11 jul 2023', '13:00 – 14:00'],
    });
  });

  it('many days: both dates with month and year', () => {
    expect(buildEventDate(at(2023, 7, 11, 13), at(2023, 7, 15, 14), pt)).toEqual({
      kind: 'multi-day',
      parts: ['11 jul 2023, 13:00', '15 jul 2023, 14:00'],
      stack: ['11 jul', '13:00', '15 jul', '14:00'],
    });
  });

  it('only a start date', () => {
    expect(buildEventDate(at(2023, 7, 11, 13), undefined, pt)).toEqual({
      kind: 'start-only',
      parts: ['ter, 11 jul 2023', '13:00'],
    });
  });

  it('en_us: month first and 12 h', () => {
    const en = { t: tIn('en'), locale: 'en_us', timeFormat: '12h' };
    expect(buildEventDate(at(2023, 7, 11, 13), at(2023, 7, 11, 14), en).parts).toEqual(['Tue, Jul 11, 2023', '1:00\u00a0PM – 2:00\u00a0PM']);
  });

  it('german writes the day with a dot', () => {
    const de = { t: tIn('de'), locale: 'de_de', timeFormat: '24h' };
    expect(buildEventDate(at(2023, 7, 11, 13), undefined, de).parts[0]).toBe('Di, 11. Jul 2023');
  });

  it('is null without dates or with an invalid start', () => {
    expect(buildEventDate(undefined, undefined, pt)).toBeNull();
    expect(buildEventDate('not a date', at(2023, 7, 11), pt)).toBeNull();
  });

  it('treats an end before the start as a single instant', () => {
    expect(normalizeRange(at(2023, 7, 11, 13), at(2023, 7, 11, 9)).end).toBeNull();
    expect(buildEventDate(at(2023, 7, 11, 13), at(2023, 7, 11, 9), pt).kind).toBe('start-only');
  });

  it('falls back to English for an unknown language', () => {
    expect(buildEventDate(at(2023, 7, 11, 13), undefined, { t: tIn('xx'), locale: 'xx_yy', timeFormat: '24h' }).parts[0]).toBe('Tue, 11 Jul 2023');
  });
});

describe('buildCompactDate', () => {
  const pt = { t: tIn('pt'), locale: 'pt_br' };
  it('formats one day, a range in one month and across months', () => {
    expect(buildCompactDate(at(2023, 7, 11), at(2023, 7, 11, 18), pt)).toBe('11 jul');
    expect(buildCompactDate(at(2023, 7, 11), at(2023, 7, 15), pt)).toBe('11–15 jul');
    expect(buildCompactDate(at(2023, 7, 28), at(2023, 8, 2), pt)).toBe('28 jul – 2 ago');
    expect(buildCompactDate(undefined, undefined, pt)).toBeNull();
  });
});
