import { describe, it, expect } from 'vitest';
import clockOffset from './clock-offset';

describe('clockOffset', () => {
  it('is how far the device clock is behind or ahead of the time the player reports', () => {
    expect(clockOffset(10_000_000, 4_000_000)).toBe(6_000_000);
    expect(clockOffset(4_000_000, 10_000_000)).toBe(-6_000_000);
  });

  it('is 0 when the player says nothing usable', () => {
    for (const bad of [undefined, null, '', 'soon', 0, -5, NaN]) expect(clockOffset(bad, 1_000)).toBe(0);
  });

  it('takes the timestamp as a string too', () => {
    expect(clockOffset('2000', 1_000)).toBe(1_000);
  });
});
