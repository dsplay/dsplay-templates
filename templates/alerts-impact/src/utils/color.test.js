import { describe, it, expect } from 'vitest';
import {
  normalizeColor, contrast, inkFor, INK, PAPER, DEFAULT_PLATE,
} from './color';

describe('normalizeColor', () => {
  it('accepts #RGB, #RRGGBB and no hash', () => {
    expect(normalizeColor('#fa0')).toBe('#FFAA00');
    expect(normalizeColor('d50000')).toBe('#D50000');
    expect(normalizeColor(' #ff9500 ')).toBe('#FF9500');
  });
  it.each([[''], [undefined], ['red'], ['#12'], ['rgb(1,2,3)']])('falls back to the default plate for %j', (v) => {
    expect(normalizeColor(v)).toBe(DEFAULT_PLATE);
  });
});

describe('contrast', () => {
  it('matches the spec table', () => {
    expect(contrast(INK, '#FFD600')).toBeCloseTo(13.05, 1);
    expect(contrast(INK, PAPER)).toBeCloseTo(18.4, 1);
    expect(contrast(PAPER, '#D50000')).toBeCloseTo(5.5, 1);
    expect(contrast(INK, '#FF9500')).toBeCloseTo(8.4, 1);
  });
});

describe('inkFor', () => {
  it('uses ink on yellow and orange, white on red', () => {
    expect(inkFor('#FFD600')).toBe(INK);
    expect(inkFor('#FF9500')).toBe(INK);
    expect(inkFor('#D50000')).toBe(PAPER);
  });
});
