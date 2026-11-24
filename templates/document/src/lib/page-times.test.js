import { describe, it, expect } from 'vitest';
import pageTimes from './page-times';

describe('pageTimes', () => {
  it('gives every page the same share and the last one the margin on top', () => {
    expect(pageTimes(26000, 3, 2000)).toEqual([8000, 8000, 10000]);
  });

  it('keeps the whole duration', () => {
    const times = pageTimes(30000, 7, 2000);
    expect(times.reduce((a, b) => a + b, 0)).toBe(30000);
  });

  it('never gives a page less than 1 ms, even for a duration shorter than the pages', () => {
    expect(pageTimes(2, 5, 2000).every((t) => t >= 1)).toBe(true);
  });

  it('treats a one-page document as a single page of the whole duration', () => {
    expect(pageTimes(10000, 1)).toEqual([10000]);
  });
});
