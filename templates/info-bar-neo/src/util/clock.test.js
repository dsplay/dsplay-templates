import { describe, it, expect } from 'vitest';
import { formatClock, languageOf, msToNextMinute } from './clock';

const sunday = new Date(2026, 10, 15, 13, 5, 30);

describe('formatClock', () => {
  it('formats 24h in portuguese by default table', () => {
    expect(formatClock(sunday, 'pt_br', '24h')).toEqual({ time: '13:05', date: 'Domingo, 15 de novembro' });
  });
  it('formats 12h in english', () => {
    expect(formatClock(sunday, 'en_us', '12h')).toEqual({ time: '1:05 PM', date: 'Sunday, November 15' });
  });
  it('midnight in 12h is 12 AM', () => {
    expect(formatClock(new Date(2026, 0, 1, 0, 7), 'en', '12h').time).toBe('12:07 AM');
  });
  it('spanish, and unknown languages fall back to english', () => {
    expect(formatClock(sunday, 'es', '24h').date).toBe('Domingo, 15 de noviembre');
    expect(languageOf('de_de')).toBe('en');
  });
  it('invalid date gives null so the clock disappears', () => {
    expect(formatClock(new Date('x'), 'pt', '24h')).toBeNull();
    expect(formatClock(undefined, 'pt', '24h')).toBeNull();
  });
  it('waits for the next minute', () => {
    expect(msToNextMinute(sunday)).toBe(30000);
    expect(msToNextMinute(new Date(2026, 0, 1, 0, 0, 59, 999))).toBe(1000);
  });
});

describe('shortDate', () => {
  it('dd/MM, and MM/dd for English', async () => {
    const { shortDate } = await import('./clock');
    const d = new Date(2026, 9, 1, 13, 14);
    expect(shortDate(d, 'pt_br')).toBe('01/10');
    expect(shortDate(d, 'en_us')).toBe('10/01');
    expect(shortDate(new Date('x'), 'pt')).toBe('');
  });
});
