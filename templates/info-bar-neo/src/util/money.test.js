import { describe, it, expect } from 'vitest';
import { formatMoney, rateOf } from './money';

describe('formatMoney', () => {
  it('uses the separators of the language', () => {
    expect(formatMoney(90909.09, 'pt_br')).toBe('90.909,09');
    expect(formatMoney(5.656, 'pt_br')).toBe('5,66');
    expect(formatMoney(90909.09, 'en_us')).toBe('90,909.09');
  });
  it('never shows zero or garbage', () => {
    expect(formatMoney(0, 'pt_br')).toBe('');
    expect(formatMoney(undefined, 'pt_br')).toBe('');
    expect(formatMoney('x', 'pt_br')).toBe('');
  });
});

describe('rateOf', () => {
  it('inverts the table (sources per target)', () => {
    expect(rateOf({ brl: { usd: 0.2 } }, 'BRL', 'USD')).toBeCloseTo(5, 5);
    expect(rateOf({ brl: {} }, 'BRL', 'USD')).toBe(0);
    expect(rateOf(null, 'BRL', 'USD')).toBe(0);
  });
});
