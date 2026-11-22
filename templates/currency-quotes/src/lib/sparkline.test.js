import { describe, it, expect } from 'vitest';
import {
  sparkPoints, sparkArea, periodTrend, lastPoint,
} from './sparkline';

describe('sparkPoints', () => {
  it('runs from the bottom (lowest) to the top (highest) of the box, with a padding', () => {
    expect(sparkPoints([1, 3, 2], 100, 50, 0)).toBe('0,50 50,0 100,25');
    expect(sparkPoints([1, 3], 104, 54, 2)).toBe('2,52 102,2');
  });

  it('draws a flat series across the middle', () => {
    expect(sparkPoints([5, 5, 5], 100, 40, 0)).toBe('0,20 50,20 100,20');
  });

  it('is empty with fewer than two values', () => {
    expect(sparkPoints([], 100, 50)).toBe('');
    expect(sparkPoints([4], 100, 50)).toBe('');
    expect(sparkPoints(undefined, 100, 50)).toBe('');
  });
});

describe('sparkArea', () => {
  it('closes the line along the bottom', () => {
    expect(sparkArea([1, 3], 100, 50, 0)).toBe('0,50 100,0 100,50 0,50');
    expect(sparkArea([1], 100, 50)).toBe('');
  });
});

describe('lastPoint', () => {
  it('is the end of the line', () => {
    expect(lastPoint([1, 3, 2], 100, 50, 0)).toEqual({ x: 100, y: 25 });
    expect(lastPoint([1, 3], 104, 54, 2)).toEqual({ x: 102, y: 2 });
    expect(lastPoint([1], 100, 50)).toBeNull();
  });
});

describe('periodTrend', () => {
  it('compares the last value with the first', () => {
    expect(periodTrend([1, 2, 3])).toBe('up');
    expect(periodTrend([3, 2, 1])).toBe('down');
    expect(periodTrend([2, 9, 2])).toBe('flat');
    expect(periodTrend([2])).toBe('flat');
  });
});
