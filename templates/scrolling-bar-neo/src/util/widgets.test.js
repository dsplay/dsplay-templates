import { describe, it, expect } from 'vitest';
import { parseOrder, DEFAULT_ORDER } from './widgets';

describe('parseOrder', () => {
  it('defaults', () => {
    expect(DEFAULT_ORDER).toEqual(['clock', 'weather', 'ticker', 'company']);
    expect(parseOrder('')).toEqual(DEFAULT_ORDER);
    expect(parseOrder(undefined)).toEqual(DEFAULT_ORDER);
  });
  it('reads names and appends the missing ones', () => {
    expect(parseOrder('ticker, clock')).toEqual(['ticker', 'clock', 'weather', 'company']);
  });
  it('reads letters, with commas or glued', () => {
    expect(parseOrder('s,w,n,c')).toEqual(['company', 'weather', 'ticker', 'clock']);
    expect(parseOrder('SWNC')).toEqual(['company', 'weather', 'ticker', 'clock']);
  });
  it('accepts news as an alias of ticker', () => {
    expect(parseOrder('news')[0]).toBe('ticker');
  });
  it('reads sponsor (the old name) as company', () => {
    expect(parseOrder('sponsor,clock').slice(0, 2)).toEqual(['company', 'clock']);
  });
  it('drops repeats and unknown tokens (quotes do not exist here)', () => {
    expect(parseOrder('c,c,x,weather')).toEqual(['clock', 'weather', 'ticker', 'company']);
  });
});
