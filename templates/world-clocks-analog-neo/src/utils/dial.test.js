import { describe, it, expect } from 'vitest';
import {
  faceSize, dialMarks, handLengths, handPoses, nameLayout, NAME_MIN_SIZE,
} from './dial';
import { marksFor } from './layout';

// D (rem) of M-011 §0.5 and the hand lengths it lists (seconds / minutes / hours)
const TABLE = [
  [90, 24.5, 23.8, 14.9], [80, 21.2, 20.5, 12.9], [76, 19.8, 19.2, 12.1], [70, 17.8, 17.3, 10.9],
  [60, 14.5, 14.0, 8.8], [56, 13.1, 12.7, 8.0], [46, 13.3, 12.9, 8.1], [42, 11.7, 11.3, 7.1],
  [38, 10.0, 9.7, 6.1], [33, 8.7, 8.4, 5.3], [30, 7.9, 7.7, 4.8], [26.7, 7.0, 6.8, 4.3],
  [22.3, 5.9, 5.7, 3.6], [19, 6.6, 6.5, 4.1],
  // M-011 §0.9
  [40, 10.8, 10.5, 6.6], [36, 9.5, 9.2, 5.8], [34, 9.0, 8.7, 5.5], [28, 7.4, 7.2, 4.5], [24, 6.3, 6.1, 3.9],
  [20.5, 7.2, 7.0, 4.4],
];
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const marksOf = (D) => {
  const { numeralHours } = marksFor(D, false);
  return dialMarks(faceSize(D), { ticks: true, dotHours: ALL, numeralHours });
};

describe('hands (M-011 §0.5 table)', () => {
  it.each(TABLE)('D = %s: seconds %s, minutes %s, hours %s', (D, s, m, h) => {
    const len = handLengths(faceSize(D), marksOf(D).numerals);
    expect(len.second).toBeCloseTo(s, 0);
    expect(len.minute).toBeCloseTo(m, 0);
    expect(len.hour).toBeCloseTo(h, 0);
  });

  it('keeps one length at every time, and turns by the real angle (6 deg/min, 30 deg/h)', () => {
    const face = faceSize(56);
    const { numerals } = marksOf(56);
    const lens = new Set();
    for (let m = 0; m < 60; m += 1) {
      const p = handPoses(face, { hour: 1, minute: m, second: 30 }, numerals);
      lens.add(`${p.hour.length}|${p.minute.length}|${p.second.length}`);
      expect(p.minute.theta).toBeCloseTo(6 * (m + 0.5));
      expect(p.hour.theta).toBeCloseTo(30 * (1 + m / 60));
      expect(p.second.theta).toBeCloseTo(180);
    }
    expect(lens.size).toBe(1);
  });

  it('never touches a numeral, in any direction (sampled along the second hand)', () => {
    TABLE.forEach(([D]) => {
      const { numerals } = marksOf(D);
      const { second } = handLengths(faceSize(D), numerals);
      let hit = false;
      for (let deg = 0; deg < 360; deg += 1) {
        for (let t = 0; t <= 1; t += 0.05) {
          const x = Math.sin((deg * Math.PI) / 180) * second * t;
          const y = -Math.cos((deg * Math.PI) / 180) * second * t;
          hit = hit || numerals.some((n) => Math.abs(x - n.x) < n.w / 2 && Math.abs(y - n.y) < n.h / 2);
        }
      }
      expect(hit).toBe(false);
    });
  });
});

describe('name inside the face', () => {
  it.each(TABLE)('D = %s: the name box (0.34 R below the centre) collides with no numeral and stays in the circle', (D) => {
    const face = faceSize(D);
    const { numerals } = marksOf(D);
    const name = nameLayout(face, numerals);
    expect(name.fontSize).toBeCloseTo(Math.max(0.1 * D, NAME_MIN_SIZE));
    expect(name.y).toBeCloseTo(0.34 * face.R);
    expect(name.maxWidth).toBeLessThanOrEqual(1.3 * face.R + 1e-9);
    const half = (name.fontSize * 1.15) / 2;
    numerals.forEach((n) => {
      const apartX = Math.abs(n.x) - n.w / 2 >= name.maxWidth / 2 - 1e-9;
      const apartY = Math.abs(n.y - name.y) >= half + n.h / 2 - 1e-9;
      expect(apartX || apartY).toBe(true);
    });
    const corner = Math.hypot(name.maxWidth / 2, name.y + half);
    expect(corner).toBeLessThanOrEqual(face.R + 1e-6);
  });

  it('fits ~9 letters at D >= 56 and ~11 on the 12/3/6/9 faces', () => {
    const letters = (D) => Math.floor(nameLayout(faceSize(D), marksOf(D).numerals).maxWidth
      / (0.58 * nameLayout(faceSize(D)).fontSize));
    expect(letters(56)).toBeGreaterThanOrEqual(9);
    expect(letters(38)).toBeGreaterThanOrEqual(10);
  });
});

describe('dialMarks', () => {
  it('puts marks and numerals on a circle: 12/3/6/9 on the axes, the rest at 30 degrees', () => {
    const { numerals } = marksOf(70);
    const at = (label) => numerals.find((n) => n.label === label);
    expect(at(12).x).toBeCloseTo(0);
    expect(at(12).y).toBeLessThan(0);
    expect(at(3).y).toBeCloseTo(0);
    expect(at(3).x).toBeGreaterThan(0);
    expect(at(6).y).toBeGreaterThan(0);
    expect(at(9).x).toBeLessThan(0);
    // the numerals stay inside the face, 2u from the border at least
    numerals.forEach((n) => {
      expect(Math.hypot(Math.abs(n.x) + n.w / 2, Math.abs(n.y) + n.h / 2)).toBeLessThanOrEqual(35);
    });
  });

  it('draws 60 ticks (12 as dots) with ticks on, only the 12 dots with ticks off', () => {
    const face = faceSize(56);
    const all = dialMarks(face, { ticks: true, dotHours: ALL });
    expect(all.tickPath.split('M').length - 1).toBe(48);
    expect(all.dotPath.split('M').length - 1).toBe(12);
    const dots = dialMarks(face, { ticks: false, dotHours: ALL });
    expect(dots.tickPath).toBe('');
    expect(dots.dotPath.split('M').length - 1).toBe(12);
  });
});

describe('the carved well (world-clocks-analog-neo)', () => {
  it('measures the marks from the well: ticks and numerals sit further in than on a plain disc', () => {
    const face = faceSize(40);
    const plain = dialMarks(face, { numeralHours: [0, 3, 6, 9] });
    const carved = dialMarks(face, { numeralHours: [0, 3, 6, 9], well: true });
    const twelve = (d) => d.numerals.find((n) => n.label === 12);
    // rho' = R - 2 and 5.8 instead of 4.8 => the numeral 12 is 3 rem lower
    expect(Math.abs(twelve(plain).y) - Math.abs(twelve(carved).y)).toBeCloseTo(3, 1);
  });

  it('nothing is closer than 3 rem to the well outline: the outer end of a tick is 2 rem inside rho\'', () => {
    const face = faceSize(40);
    const { tickPath } = dialMarks(face, { well: true });
    const [x1, y1, x2, y2] = tickPath.match(/-?\d+(\.\d+)?/g).slice(0, 4).map(Number);
    expect(x1).toBeCloseTo(x2, 5);
    expect(Math.abs(Math.min(y1, y2))).toBeCloseTo(face.R - 2 - 2, 1);
  });

  it('hands stay under 70% of the well radius and keep 0.61 : 0.97 : 1', () => {
    const face = faceSize(40);
    const { numerals } = dialMarks(face, { numeralHours: [0, 3, 6, 9], well: true });
    const len = handLengths(face, numerals, true);
    expect(len.second).toBeLessThanOrEqual(0.7 * (face.R - 2) + 1e-9);
    expect(len.minute / len.second).toBeCloseTo(0.97, 2);
    expect(len.hour / len.second).toBeCloseTo(0.61, 2);
    expect(handPoses(face, { hour: 3, minute: 0, second: 0 }, numerals, true).hour.theta).toBe(90);
  });

  it('the name never overlaps the 6 and always has room (it is pulled up under the numerals)', () => {
    [36, 38, 40, 56].forEach((D) => {
      const face = faceSize(D);
      const hours = D >= 56 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [0, 3, 6, 9];
      const { numerals } = dialMarks(face, { numeralHours: hours, well: true });
      const name = nameLayout(face, numerals, true);
      const six = numerals.find((n) => n.label === 6);
      expect(name.maxWidth).toBeGreaterThan(8);
      expect(name.y + (name.fontSize * 1.15) / 2).toBeLessThanOrEqual(six.y - six.h / 2);
    });
  });
});
