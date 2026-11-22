import { describe, it, expect } from 'vitest';
import {
  lngOf, readDecimals, readSeries, readItems, readQuotes, MAX_ITEMS,
} from './model';

const item = (code, extra = {}) => ({ code, name: code, kind: 'fiat', price: 1.5, changePct: 0.2, series: [1, 2], ...extra });

describe('lngOf', () => {
  it('takes the language of the locale', () => {
    expect(lngOf('pt_br')).toBe('pt');
    expect(lngOf('en-GB')).toBe('en');
    expect(lngOf(undefined)).toBe('en');
  });
});

describe('readDecimals', () => {
  it('is auto unless the media asks for a whole number from 0 to 8', () => {
    expect(readDecimals('auto')).toBe('auto');
    expect(readDecimals(undefined)).toBe('auto');
    expect(readDecimals(null)).toBe('auto');
    expect(readDecimals('')).toBe('auto');
    expect(readDecimals(0)).toBe(0);
    expect(readDecimals('3')).toBe(3);
    expect(readDecimals(9)).toBe('auto');
    expect(readDecimals(1.5)).toBe('auto');
  });
});

describe('readSeries', () => {
  it('keeps the finite numbers, and nothing at all when fewer than two are left', () => {
    expect(readSeries([1, 'x', 2, null, 3])).toEqual([1, 2, 3]);
    expect(readSeries([1])).toEqual([]);
    expect(readSeries('nope')).toEqual([]);
  });
});

describe('readItems', () => {
  it('drops an item with no code or no positive price', () => {
    const items = readItems({ items: [item('USD'), item(''), item('EUR', { price: 0 }), item('GBP', { price: 'x' }), null] });
    expect(items.map((i) => i.code)).toEqual(['USD']);
  });

  it('upper-cases the code, defaults the kind to fiat and the change to unknown', () => {
    const [one] = readItems({ items: [{ code: 'btc', price: 2, kind: 'crypto' }, { code: 'x', price: 1 }] });
    expect(one).toMatchObject({ code: 'BTC', kind: 'crypto', changePct: null, series: [] });
    expect(readItems({ items: [{ code: 'x', price: 1 }] })[0].kind).toBe('fiat');
  });

  it(`keeps at most ${MAX_ITEMS}`, () => {
    const items = Array.from({ length: 20 }, (_, i) => item(`C${i}`));
    expect(readItems({ items })).toHaveLength(MAX_ITEMS);
  });
});

describe('readQuotes', () => {
  it('is null when there is nothing to show', () => {
    expect(readQuotes(null)).toBeNull();
    expect(readQuotes({ items: [] })).toBeNull();
    expect(readQuotes({})).toBeNull();
  });

  it('reads the base, the date, the mode, the period and the decimals with their defaults', () => {
    const quotes = readQuotes({ base: 'brl', date: '2026-11-20', items: [item('USD')] });
    expect(quotes).toMatchObject({ base: 'BRL', date: '2026-11-20', mode: 'price', period: 'none', decimals: 'auto' });
    const other = readQuotes({
      base: 'BRL', mode: 'inverse', period: '30d', decimals: 4, items: [item('USD')],
    });
    expect(other).toMatchObject({ mode: 'inverse', period: '30d', decimals: 4 });
    expect(readQuotes({ period: '1y', items: [item('USD')] }).period).toBe('none');
  });
});
