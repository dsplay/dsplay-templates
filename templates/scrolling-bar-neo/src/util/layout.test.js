import { describe, it, expect } from 'vitest';
import {
  droppedAt, dropOrder, nextLevel, windowAt,
} from './layout';

const all = {
  weather: true, clock: true, circle: true, company: true,
};
const base = { set: 'b', has: all };

describe('drop order: weather, hour, feed circle, company logo (the logos are last)', () => {
  it('the order', () => {
    expect(dropOrder('b')).toEqual(['weather', 'clock', 'circle', 'company']);
    expect(dropOrder('c')).toEqual(['circle', 'company']);
    expect(droppedAt(2, 'b')).toEqual({
      weather: true, clock: true, circle: false, company: false,
    });
  });
});

describe('window and hysteresis 56/60', () => {
  it('the circle eats from the window: B with everything is about 117 rem (spec)', () => {
    // widget of 120 rem with the circle inside: 120 - 5 - 3 = 112
    expect(windowAt({
      ...base, box: 120, current: 0, level: 0,
    })).toBe(112);
  });

  it('keeps everything while the window is wide', () => {
    expect(nextLevel({ ...base, box: 125, current: 0 })).toBe(0);
  });

  it('weather goes first, then the hour, then the circle, then the company', () => {
    expect(nextLevel({ ...base, box: 60, current: 0 })).toBe(1); // 60 - 8 = 52 < 56
    expect(nextLevel({ ...base, box: 90, current: 1 })).toBe(1); // 90 + 22.6 - 8 stays wide... no: window = 82 >= 56
    expect(nextLevel({ ...base, box: 60, current: 1 })).toBe(2);
    expect(nextLevel({ ...base, box: 40, current: 2 })).toBe(3);
    expect(nextLevel({ ...base, box: 40, current: 3 })).toBe(4);
    expect(nextLevel({ ...base, box: 10, current: 4 })).toBe(4);
  });

  it('a block only comes back at 60 rem or more', () => {
    // weather out (level 1); with it back the window would be box - 22.6 - 8
    expect(nextLevel({ ...base, box: 90, current: 1 })).toBe(1); // 90 - 22.6 - 8 = 59.4 < 60
    expect(nextLevel({ ...base, box: 91, current: 1 })).toBe(0); // 60.4
  });

  it('set c: only the circle and the company logo can go (50/54)', () => {
    const c = { set: 'c', has: { ...all, weather: false, clock: false } };
    expect(nextLevel({ ...c, box: 52, current: 0 })).toBe(1); // 52 - 7.4 = 44.6 < 50
    expect(nextLevel({ ...c, box: 30, current: 2 })).toBe(2);
  });

  it('an absent block gives no room', () => {
    const none = { ...all, circle: false };
    expect(windowAt({
      set: 'b', has: none, box: 80, current: 0, level: 3,
    })).toBe(80 + 16.6 + 6 + 12.5 + 2);
  });
});
