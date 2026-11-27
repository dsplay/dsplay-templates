import { describe, it, expect } from 'vitest';
import moment from 'moment';
import {
  shortDate, dayAndMonth, numericDate, timeText,
} from './date-text';

// Monday, 16 November 2026, 19:05
const date = moment([2026, 10, 16, 19, 5, 0]);

describe('date text', () => {
  it('writes the short date per language', () => {
    expect(shortDate(date, 'pt')).toBe('seg, 16 nov');
    expect(shortDate(date, 'en')).toBe('Mon, Nov 16');
    expect(shortDate(date, 'xx')).toBe('Mon, 16 Nov');
  });

  it('writes day and month in full', () => {
    expect(dayAndMonth(date, 'pt')).toBe('16 de novembro');
    expect(dayAndMonth(date, 'de')).toBe('16. November');
    expect(dayAndMonth(date, 'en')).toBe('November 16');
  });

  it('writes the numeric date', () => {
    expect(numericDate(date, 'pt')).toBe('seg 16/11');
    expect(numericDate(date, 'en')).toBe('Mon 11/16');
  });

  it('writes the time in 24h or 12h', () => {
    expect(timeText(date)).toBe('19:05');
    expect(timeText(date, true)).toBe('7:05 PM');
    expect(timeText(moment([2026, 10, 16, 0, 5, 0]), true)).toBe('12:05 AM');
  });
});
