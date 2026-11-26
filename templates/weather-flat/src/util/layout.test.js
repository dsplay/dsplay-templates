import { describe, it, expect } from 'vitest';
import {
  fullLayout, wideLayout, GAP, MARGIN,
} from './layout';

const top = (r) => Math.round(r.y * 1000) / 1000;
const bottom = (r) => Math.round((r.y + r.h) * 1000) / 1000;
const right = (r) => Math.round((r.x + r.w) * 1000) / 1000;

describe('landscape grid (192 x 108 and wider/shorter windows)', () => {
  [[192, 108], [219.4, 108], [192, 144], [256, 108]].forEach(([w, h]) => {
    it(`the two columns share top and bottom, neighbors are ${GAP} rem apart (${w} x ${h})`, () => {
      const l = fullLayout('landscape', { w, h }, { pills: 5, stats: 3 });
      // top: `now` and the logo; bottom: detail cards and the last pill
      expect(top(l.now)).toBe(MARGIN);
      expect(top(l.logo)).toBe(MARGIN);
      expect(bottom(l.stats[0])).toBe(h - MARGIN);
      expect(bottom(l.pills[4])).toBe(h - MARGIN);
      // same height for the three detail cards and the five pills
      expect(new Set(l.stats.map(top)).size).toBe(1);
      expect(new Set(l.pills.map((p) => Math.round(p.h * 1000))).size).toBe(1);
      // gaps: now -> stats, logo -> first pill, pill -> pill
      expect(top(l.stats[0]) - bottom(l.now)).toBeCloseTo(GAP, 5);
      expect(top(l.pills[0]) - bottom(l.logo)).toBeCloseTo(GAP, 5);
      expect(top(l.pills[1]) - bottom(l.pills[0])).toBeCloseTo(GAP, 5);
      // the right edge of the pills is the right edge of the logo
      expect(right(l.pills[0])).toBe(right(l.logo));
    });
  });
});

describe('portrait and square grids', () => {
  it('portrait: now, details and pills are stacked with the same gap and the same side margins', () => {
    const l = fullLayout('portrait', { w: 108, h: 192 }, { pills: 5, stats: 3 });
    expect(top(l.stats[0]) - bottom(l.now)).toBeCloseTo(GAP, 5);
    expect(top(l.pills[0]) - bottom(l.stats[0])).toBeCloseTo(GAP, 5);
    expect(bottom(l.pills[0])).toBe(192 - MARGIN);
    expect(l.now.x).toBe(MARGIN);
    expect(right(l.now)).toBe(108 - MARGIN);
    expect(right(l.pills[4])).toBeCloseTo(108 - MARGIN, 5);
    expect(right(l.stats[2])).toBeCloseTo(108 - MARGIN, 5);
    expect(top(l.now) - bottom(l.logo)).toBeCloseTo(GAP, 5);
  });
  it('square: now above the five pills, same gap, side margins equal', () => {
    const l = fullLayout('square', { w: 108, h: 108 }, { pills: 5, stats: 0 });
    expect(top(l.pills[0]) - bottom(l.now)).toBeCloseTo(GAP, 5);
    expect(bottom(l.pills[0])).toBe(108 - MARGIN);
    expect(right(l.pills[4])).toBeCloseTo(108 - MARGIN, 5);
    expect(new Set(l.pills.map(top)).size).toBe(1);
  });
  it('fewer days keep the size and are centered', () => {
    const five = fullLayout('square', { w: 108, h: 108 }, { pills: 5, stats: 0 });
    const three = fullLayout('square', { w: 108, h: 108 }, { pills: 3, stats: 0 });
    expect(three.pills[0].w).toBeCloseTo(five.pills[0].w, 5);
    expect(three.pills[0].x - MARGIN).toBeCloseTo(108 - MARGIN - right(three.pills[2]), 5);
  });
});

describe('wide grid', () => {
  it('now and the five pills share top and bottom', () => {
    const l = wideLayout({ w: 192, h: 48 }, { pills: 5, logo: true });
    expect(top(l.now)).toBe(MARGIN);
    expect(bottom(l.now)).toBe(48 - MARGIN);
    l.pills.forEach((p) => {
      expect(top(p)).toBe(MARGIN);
      expect(bottom(p)).toBe(48 - MARGIN);
    });
    expect(top(l.logo) - MARGIN).toBeCloseTo(48 - MARGIN - bottom(l.logo), 5);
  });
});
