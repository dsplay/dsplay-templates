import { describe, it, expect } from 'vitest';
import {
  faceSize, dialMarks, handLengths, handPoses, contour, WELL_INSET,
} from './dial';

const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const land = faceSize(184, 100);

describe('contour', () => {
  it('is the face without a well and 2 rem smaller with one', () => {
    expect(contour(land, false)).toBe(land);
    const c = contour(land, true);
    expect([c.a, c.b, c.r]).toEqual([land.a - WELL_INSET, land.b - WELL_INSET, land.r - WELL_INSET]);
  });
});

describe('dialMarks with a well', () => {
  it('numerals sit further in than without a well (5.8 vs 4.8 rem, from a smaller outline)', () => {
    const plain = dialMarks(land, { numeralHours: ALL });
    const wellMarks = dialMarks(land, { numeralHours: ALL, well: true });
    const n12 = (d) => d.numerals.find((n) => n.label === 12);
    // 12 o'clock: y = -(rho - inset - ext); rho shrinks by 2 and the inset grows by 1 => 3 rem lower
    expect(Math.abs(n12(plain).y) - Math.abs(n12(wellMarks).y)).toBeCloseTo(3, 1);
  });

  it('nothing is closer than 3 rem to the outline of the well (ticks at the centre line)', () => {
    const c = contour(land, true);
    const { tickPath } = dialMarks(land, { well: true });
    // first tick = minute 0 at the top: "M x y1 L x y2", centre at -(b' - 3), half length 1 => the outer end is 2 rem in
    const [x1, y1, x2, y2] = tickPath.match(/-?\d+(\.\d+)?/g).slice(0, 4).map(Number);
    expect(x1).toBeCloseTo(x2, 5);
    const outerY = Math.min(y1, y2);
    expect(Math.abs(outerY)).toBeCloseTo(c.b - 2, 1);
  });
});

describe('hands with a well', () => {
  it('are fixed, 70% of the well radius at most, and never reach a numeral', () => {
    const { numerals } = dialMarks(land, { numeralHours: ALL, well: true });
    const len = handLengths(land, numerals, true);
    expect(len.second).toBeLessThanOrEqual(0.7 * (land.b - WELL_INSET) + 1e-9);
    expect(len.minute / len.second).toBeCloseTo(0.97, 2);
    expect(len.hour / len.second).toBeCloseTo(0.61, 2);
    const poses = handPoses(land, { hour: 3, minute: 0, second: 0 }, numerals, true);
    expect(poses.hour.theta).toBeCloseTo(90, 5);
  });

  it('the length does not depend on the time', () => {
    const { numerals } = dialMarks(land, { numeralHours: ALL, well: true });
    const a = handPoses(land, { hour: 1, minute: 5, second: 7 }, numerals, true);
    const b = handPoses(land, { hour: 9, minute: 45, second: 30 }, numerals, true);
    expect(a.second.length).toBe(b.second.length);
  });
});
