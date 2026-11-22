import { describe, it, expect } from 'vitest';
import {
  formatMonthDay, formatRange, levelOf, lngOf, longDate, monthDayOf, normalizeIteration, pickSigns, readSigns, screenIndexOf, screensOf, shortDate, unitsOf,
} from './model';
import { SIGN_IDS } from './zodiac';
import { exampleResult } from '../test-support/fixture';

const t = (key, values = {}) => {
  const map = { Mar: 'mar', Apr: 'abr', Nov: 'nov' };
  return (map[key] || key).replace(/{{(\w+)}}/g, (_, name) => values[name]);
};

describe('lngOf', () => {
  it('takes the language of the player locale', () => {
    expect(lngOf('pt_br')).toBe('pt');
    expect(lngOf('en-US')).toBe('en');
    expect(lngOf(undefined)).toBe('en');
    expect(lngOf('')).toBe('en');
  });
});

describe('normalizeIteration', () => {
  it('is a whole number from 0 up', () => {
    expect(normalizeIteration(7)).toBe(7);
    expect(normalizeIteration('3')).toBe(3);
    expect(normalizeIteration(2.9)).toBe(2);
    expect(normalizeIteration(-4)).toBe(0);
    expect(normalizeIteration(undefined)).toBe(0);
    expect(normalizeIteration(NaN)).toBe(0);
  });
});

describe('levelOf and unitsOf', () => {
  it('keeps a score between 1 and 5, a middle one when it is not a number', () => {
    expect(levelOf(4)).toBe(4);
    expect(levelOf(9)).toBe(5);
    expect(levelOf(0)).toBe(1);
    expect(levelOf(3.6)).toBe(4);
    expect(levelOf('x')).toBe(3);
    expect(levelOf(undefined)).toBe(3);
  });

  it('lights as many units as the score', () => {
    expect(unitsOf(3)).toEqual([true, true, true, false, false]);
    expect(unitsOf(5).every(Boolean)).toBe(true);
  });
});

describe('readSigns', () => {
  it('reads the twelve signs of the example answer in zodiac order', () => {
    const signs = readSigns(exampleResult());
    expect(signs.map((s) => s.id)).toEqual(SIGN_IDS);
    expect(signs[4]).toMatchObject({
      id: 'leo', from: '07-23', to: '08-22', element: 'fire', keyword: 'Confiança', love: 4, work: 5, health: 3, luckyNumber: 7, luckyColor: 'gold', compatible: 'aries',
    });
  });

  it('puts the signs in zodiac order whatever the order of the answer', () => {
    const { signs } = exampleResult();
    expect(readSigns({ signs: [...signs].reverse() }).map((s) => s.id)).toEqual(SIGN_IDS);
  });

  it('fills in dates and element from the table, and drops what it cannot trust', () => {
    const [sign] = readSigns({
      signs: [{
        sign: 'aries', text: ' Hello ', from: 'x', element: 'metal', luckyNumber: 0, luckyColor: 'mauve', compatible: 'aries', love: 'a',
      }],
    });
    expect(sign).toMatchObject({
      from: '03-21', to: '04-19', element: 'fire', text: 'Hello', keyword: '', love: 3, luckyNumber: null, luckyColor: null, compatible: null,
    });
  });

  it('drops a sign with no text, an unknown sign and a repeated sign', () => {
    const signs = readSigns({
      signs: [
        { sign: 'leo', text: 'one' }, { sign: 'leo', text: 'two' }, { sign: 'aries', text: '' }, { sign: 'dragon', text: 'x' }, null, { sign: 'libra', text: 'three' },
      ],
    });
    expect(signs.map((s) => [s.id, s.text])).toEqual([['leo', 'one'], ['libra', 'three']]);
  });

  it('gives nothing for an answer with no signs', () => {
    expect(readSigns(undefined)).toEqual([]);
    expect(readSigns({})).toEqual([]);
    expect(readSigns({ signs: 'x' })).toEqual([]);
  });
});

describe('pickSigns', () => {
  const signs = readSigns(exampleResult());

  it('shows the sign iteration % 12, one a screen', () => {
    expect(pickSigns(signs, 0)[0].id).toBe('aries');
    expect(pickSigns(signs, 4)[0].id).toBe('leo');
    expect(pickSigns(signs, 12)[0].id).toBe('aries');
    expect(pickSigns(signs, 23)[0].id).toBe('pisces');
  });

  it('shows pair iteration % 6 as signs 2p and 2p + 1 for two a screen', () => {
    expect(pickSigns(signs, 0, 2).map((s) => s.id)).toEqual(['aries', 'taurus']);
    expect(pickSigns(signs, 2, 2).map((s) => s.id)).toEqual(['leo', 'virgo']);
    expect(pickSigns(signs, 5, 2).map((s) => s.id)).toEqual(['aquarius', 'pisces']);
    expect(pickSigns(signs, 6, 2).map((s) => s.id)).toEqual(['aries', 'taurus']);
  });

  it('copes with a short list and with nothing', () => {
    expect(pickSigns(signs.slice(0, 1), 5, 2).map((s) => s.id)).toEqual(['aries']);
    expect(pickSigns(signs.slice(0, 3), 1, 2).map((s) => s.id)).toEqual(['aries', 'taurus']);
    expect(pickSigns([], 3)).toEqual([]);
    expect(pickSigns(signs, undefined)[0].id).toBe('aries');
  });

  it('counts the screens', () => {
    expect(screensOf(12, 1)).toBe(12);
    expect(screensOf(12, 2)).toBe(6);
    expect(screensOf(3, 2)).toBe(1);
    expect(screenIndexOf(12, 8, 2)).toBe(2);
    expect(screenIndexOf(12, 8, 1)).toBe(8);
  });
});

describe('dates', () => {
  it('reads a month and a day', () => {
    expect(monthDayOf('03-21')).toEqual({ month: 3, day: 21 });
    expect(monthDayOf('13-01')).toBeNull();
    expect(monthDayOf('3-21')).toBeNull();
    expect(monthDayOf(undefined)).toBeNull();
  });

  it('writes them with the template\'s own month names and order', () => {
    expect(formatMonthDay('03-21', t)).toBe('mar 21');
    expect(formatRange('03-21', '04-19', t)).toBe('mar 21 – abr 19');
    expect(formatMonthDay('xx', t)).toBe('');
  });

  it('writes the player\'s own date', () => {
    const date = new Date(2026, 10, 15);
    expect(shortDate(date, t)).toBe('nov 15');
    expect(longDate(date, 'en')).toMatch(/Sunday, November 15/);
    expect(longDate(date, 'pt')).toMatch(/domingo, 15 de novembro/);
    // a language the browser does not know falls back to English
    expect(longDate(date, 'xx-invalid-lang-tag-')).toMatch(/Sunday/);
  });
});
