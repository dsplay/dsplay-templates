import { describe, it, expect } from 'vitest';
import layoutFor, { maxCities, marksFor } from './layout';

const sum = (rows) => rows.reduce((a, b) => a + b, 0);

describe('layoutFor (M-011 §0.9 table; pages hold at most 4 clocks)', () => {
  it('gives the diameters and rows of the table', () => {
    const table = {
      landscape: [[40, [1]], [38, [2]], [34, [3]], [30, [4]]],
      portrait: [[56, [1]], [38, [2]], [36, [2, 1]], [36, [2, 2]]],
      square: [[40, [1]], [34, [2]], [24, [3]], [24, [2, 2]]],
    };
    Object.keys(table).forEach((format) => {
      table[format].forEach(([d, rows], i) => {
        const layout = layoutFor(format, i + 1, true);
        expect(layout.d).toBe(d);
        expect(layout.rows).toEqual(rows);
        expect(sum(layout.rows)).toBe(i + 1);
      });
    });
  });

  it('wide: one row, D = min(28, 0.78 x 184 / n), at least 19; bars: 4.2 rem and min(16, 192/n - 10)', () => {
    expect(layoutFor('wide', 4, false).d).toBeCloseTo(28, 5);
    expect(layoutFor('wide', 8, false).d).toBe(19);
    expect(layoutFor('strip-h', 4, false).d).toBe(4.2);
    expect(layoutFor('strip-v', 4, false).d).toBe(16);
  });

  it('keeps the logo band only on the three big formats, and only with a logo', () => {
    expect(layoutFor('landscape', 4, true).logo).toEqual({ band: 12, height: 8 });
    expect(layoutFor('landscape', 4, false).logo.band).toBe(0);
    ['wide', 'strip-h', 'strip-v'].forEach((f) => expect(layoutFor(f, 4, true).logo.band).toBe(0));
  });
});

describe('the carved well of the dial (only D >= 36)', () => {
  it('is on for landscape 1-2, portrait 1-4 and square 1; off for landscape 3-4, square 2-4, wide and the bars', () => {
    expect([1, 2, 3, 4].map((n) => layoutFor('landscape', n, true).well)).toEqual([true, true, false, false]);
    expect([1, 2, 3, 4].map((n) => layoutFor('portrait', n, true).well)).toEqual([true, true, true, true]);
    expect([1, 2, 3, 4].map((n) => layoutFor('square', n, true).well)).toEqual([true, false, false, false]);
    ['wide', 'strip-h', 'strip-v'].forEach((f) => expect(layoutFor(f, 4, false).well).toBe(false));
  });
});

describe('the map (flat on the base: no well, no frame)', () => {
  it('is flat in every grid format, at 70% when the middle band allows it', () => {
    expect(layoutFor('portrait', 1, true).map).toMatchObject({ mode: 'flat', scale: 0.7 });
    expect(layoutFor('portrait', 4, true).map).toMatchObject({ mode: 'flat', scale: 0.7 });
    expect(layoutFor('square', 3, true).map).toMatchObject({ mode: 'flat', scale: 0.7 });
    const land4 = layoutFor('landscape', 4, true).map;
    expect(land4.mode).toBe('flat');
    expect(land4.scale).toBeCloseTo(48 / (0.73 * 128), 2); // the whole middle band (100 - 12 - 36 - 4)
    expect(land4.well).toBeUndefined();
  });

  it('shrinks to fit the middle band (landscape n=1)', () => {
    const { map } = layoutFor('landscape', 1, true);
    expect(map.mode).toBe('flat');
    expect(map.scale).toBeCloseTo(38 / (0.73 * 128), 2);
  });

  it('is behind the clocks, flat, on the wide format; no map on the bars', () => {
    expect(layoutFor('wide', 4, false).map).toMatchObject({ mode: 'behind', scale: 0.7 });
    expect(layoutFor('strip-h', 4, false).map).toBeNull();
    expect(layoutFor('strip-v', 4, false).map).toBeNull();
  });

  it('gives the middle band back to the map when there is no logo', () => {
    expect(layoutFor('landscape', 4, false).map.scale).toBeGreaterThan(layoutFor('landscape', 4, true).map.scale);
  });
});

describe('maxCities', () => {
  it('is 8, and 4 on the square', () => {
    expect(maxCities('landscape')).toBe(8);
    expect(maxCities('square')).toBe(4);
  });
});

describe('marksFor', () => {
  it('gives all 12 numerals only from D = 56 (the name inside takes the room between 4 and 8)', () => {
    expect(marksFor(56, false)).toMatchObject({ marks: 'all' });
    expect(marksFor(56, false).numeralHours).toHaveLength(12);
    expect(marksFor(90, false).numeralHours).toHaveLength(12);
    expect(marksFor(55.9, false).numeralHours).toEqual([0, 3, 6, 9]);
  });

  it('gives only 12/3/6/9 from 21 up to 56 (landscape 4-8 cities, portrait, wide up to 7)', () => {
    [46, 42, 38, 33, 30, 26.7, 22.3, 21].forEach((d) => {
      expect(marksFor(d, false).numeralHours).toEqual([0, 3, 6, 9]);
    });
  });

  it('gives only dots below 21 (wide with 8 cities) and 4 dots on the bar slices', () => {
    expect(marksFor(19, false)).toEqual({ marks: 'dots', numeralHours: [] });
    expect(marksFor(14, true)).toEqual({ marks: 'icon', numeralHours: [] });
  });

  it('gives 12 numerals only to the portrait with one city (D = 56)', () => {
    const full = [];
    ['landscape', 'portrait', 'square', 'wide'].forEach((format) => {
      for (let n = 1; n <= 8; n += 1) {
        if (format === 'square' && n > 4) break;
        if (marksFor(layoutFor(format, n, false).d, false).numeralHours.length === 12) full.push(`${format}-${n}`);
      }
    });
    expect(full).toEqual(['portrait-1']);
  });

  it('gives only dots to the wide format with 7 and 8 cities (D = 20.5 and 19), 12/3/6/9 with 6', () => {
    expect(marksFor(layoutFor('wide', 8, false).d, false).marks).toBe('dots');
    expect(marksFor(layoutFor('wide', 7, false).d, false).marks).toBe('dots');
    expect(marksFor(layoutFor('wide', 6, false).d, false).numeralHours).toEqual([0, 3, 6, 9]);
  });
});
