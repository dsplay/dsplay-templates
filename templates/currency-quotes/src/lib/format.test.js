import { describe, it, expect } from 'vitest';
import {
  autoDecimals, formatPrice, formatChange, trendOf, formatDate,
} from './format';

describe('autoDecimals', () => {
  it('gives 4 significant digits, never fewer than 2 decimals and never more than 8', () => {
    expect(autoDecimals(61729.52)).toBe(2);
    expect(autoDecimals(1738.83)).toBe(2);
    expect(autoDecimals(5.934)).toBe(3);
    expect(autoDecimals(0.9641)).toBe(4);
    expect(autoDecimals(0.05744)).toBe(5);
    expect(autoDecimals(0.006285)).toBe(6);
    expect(autoDecimals(0.000003748)).toBe(8);
    expect(autoDecimals(5e-7)).toBe(8);
  });

  it('falls back to 2 for what is not a positive number', () => {
    expect(autoDecimals(0)).toBe(2);
    expect(autoDecimals(NaN)).toBe(2);
  });
});

describe('formatPrice', () => {
  it('writes each price with the decimals of its size in auto mode, so that no crypto price rounds to zero', () => {
    expect(formatPrice(61729.5153, 'auto', 'en')).toBe('61,729.52');
    expect(formatPrice(5.9343, 'auto', 'en')).toBe('5.934');
    expect(formatPrice(0.057440392, 'auto', 'en')).toBe('0.05744');
    expect(formatPrice(0.0000037480637, 'auto', 'en')).toBe('0.00000375');
  });

  it('uses the language of the screen for the separators', () => {
    expect(formatPrice(61729.5153, 'auto', 'pt')).toBe('61.729,52');
    expect(formatPrice(61729.5153, 'auto', 'de')).toBe('61.729,52');
  });

  it('uses a fixed number of decimals when the media asks for it', () => {
    expect(formatPrice(5.9343, 0, 'en')).toBe('6');
    expect(formatPrice(5.9343, 4, 'en')).toBe('5.9343');
  });

  it('never shows a price as a zero: it says it is smaller than the smallest it can write', () => {
    expect(formatPrice(5e-10, 'auto', 'en')).toBe('< 0.00000001');
    expect(formatPrice(0.004, 2, 'en')).toBe('< 0.01');
  });

  it('is empty for what is not a number', () => {
    expect(formatPrice(undefined)).toBe('');
    expect(formatPrice(NaN)).toBe('');
  });
});

describe('formatChange and trendOf', () => {
  it('always writes the sign', () => {
    expect(formatChange(1.236, 'en')).toBe('+1.24%');
    expect(formatChange(-0.5, 'en')).toBe('-0.50%');
    expect(formatChange(0, 'en')).toBe('0.00%');
    expect(formatChange(0.001, 'en')).toBe('0.00%');
    expect(formatChange(1.236, 'pt')).toBe('+1,24%');
  });

  it('is empty when the change is unknown', () => {
    expect(formatChange(null)).toBe('');
    expect(formatChange(undefined)).toBe('');
  });

  it('is flat under 0.005% and when unknown', () => {
    expect(trendOf(0.4)).toBe('up');
    expect(trendOf(-0.4)).toBe('down');
    expect(trendOf(0.004)).toBe('flat');
    expect(trendOf(null)).toBe('flat');
  });
});

describe('formatDate', () => {
  it('writes the date in the language of the screen, in UTC so that the day never moves', () => {
    expect(formatDate('2026-11-20', 'en')).toMatch(/20/);
    expect(formatDate('2026-11-20', 'en')).toMatch(/2026/);
    expect(formatDate('2026-11-20', 'pt')).toMatch(/nov/i);
  });

  it('gives back what is not a date as it came', () => {
    expect(formatDate('soon', 'en')).toBe('soon');
    expect(formatDate(undefined, 'en')).toBe('');
  });
});
