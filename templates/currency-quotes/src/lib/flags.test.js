import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { FLAG_OF, flagUrl, flagUrlsOf } from './flags';

const FILES = readdirSync(resolve(import.meta.dirname, '../assets/flags')).filter((name) => name.endsWith('.svg')).map((name) => name.replace('.svg', ''));

describe('FLAG_OF', () => {
  it('points every currency at a flag file that is in the template, and keeps no file that nothing uses', () => {
    const used = new Set(Object.values(FLAG_OF));
    Object.entries(FLAG_OF).forEach(([code, file]) => expect(FILES, code).toContain(file));
    FILES.forEach((file) => expect(used.has(file), file).toBe(true));
  });

  it('is keyed by the upper-case code of a currency', () => {
    Object.keys(FLAG_OF).forEach((code) => expect(code).toMatch(/^[A-Z]{3}$/));
  });

  it('has the flag of the European Union for the euro, and of one country for the dollar, the pound and the real', () => {
    expect(FLAG_OF.EUR).toBe('eu');
    expect(FLAG_OF.USD).toBe('us');
    expect(FLAG_OF.GBP).toBe('gb');
    expect(FLAG_OF.BRL).toBe('br');
  });

  it('has no flag for what is shared by several countries or is not a country: CFA francs, metals, SDR, cryptos', () => {
    ['XOF', 'XAF', 'XCD', 'XPF', 'XCG', 'XAU', 'XAG', 'XPD', 'XPT', 'XDR', 'BTC', 'ETH', 'USDT'].forEach((code) => expect(FLAG_OF[code], code).toBeUndefined());
  });
});

describe('flagUrl', () => {
  it('gives the url of a flag, whatever the case of the code', () => {
    expect(flagUrl('USD')).toMatch(/us.*\.svg/);
    expect(flagUrl('usd')).toBe(flagUrl('USD'));
  });

  it('gives null when there is no flag', () => {
    expect(flagUrl('BTC')).toBeNull();
    expect(flagUrl('XOF')).toBeNull();
    expect(flagUrl('')).toBeNull();
    expect(flagUrl(undefined)).toBeNull();
  });
});

describe('flagUrlsOf', () => {
  it('lists the flags of the base and of the fiat items, once each, and none for a crypto', () => {
    const quotes = {
      base: 'BRL',
      items: [{ code: 'USD', kind: 'fiat' }, { code: 'BTC', kind: 'crypto' }, { code: 'CNY', kind: 'fiat' }, { code: 'CNH', kind: 'fiat' }],
    };
    const urls = flagUrlsOf(quotes);
    expect(urls).toHaveLength(3);
    expect(urls).toContain(flagUrl('BRL'));
    expect(urls).toContain(flagUrl('USD'));
    expect(urls).toContain(flagUrl('CNY'));
  });

  it('is empty without an answer', () => {
    expect(flagUrlsOf(null)).toEqual([]);
  });
});
