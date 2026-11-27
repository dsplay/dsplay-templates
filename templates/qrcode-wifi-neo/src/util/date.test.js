import { describe, it, expect } from 'vitest';
import { dayLabel } from './date';

describe('dayLabel', () => {
  it('weekday and date by locale', () => {
    expect(dayLabel('2026-04-09', 'pt_br')).toEqual({ day: 'Qui', date: '09/04' });
    expect(dayLabel('2026-04-09', 'en_us')).toEqual({ day: 'Thu', date: '04/09' });
    expect(dayLabel('2026-04-09', 'de_de').day).toBe('Do');
  });
  it('empty for a bad date', () => {
    expect(dayLabel('x', 'pt')).toEqual({ day: '', date: '' });
  });
});
