import { describe, it, expect } from 'vitest';
import { edgePoint } from './edge-point';
import {
  faceSize, dialMarks, handPoses, handLengths, HAND_FRACTION,
} from './dial';

const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

describe('edgePoint', () => {
  it('puts 12/3/6/9 at the middle of the four sides, for any proportion', () => {
    [[50, 50, 7], [92, 50, 14], [50, 92, 14]].forEach(([w, h, r]) => {
      const a = w / 2;
      const b = h / 2;
      const top = edgePoint(0, a, b, r);
      const right = edgePoint(90, a, b, r);
      const bottom = edgePoint(180, a, b, r);
      const left = edgePoint(270, a, b, r);
      expect([top.theta, right.theta, bottom.theta, left.theta].map(Math.round)).toEqual([0, 90, 180, 270]);
      expect(top.rho).toBeCloseTo(b);
      expect(bottom.rho).toBeCloseTo(b);
      expect(right.rho).toBeCloseTo(a);
      expect(left.rho).toBeCloseTo(a);
    });
  });

  it('is the identity on a square at the diagonal (corner circle)', () => {
    const e = edgePoint(45, 25, 25, 7);
    expect(e.theta).toBeCloseTo(45);
    // distance to the arc: centre of the corner circle at (18, 18), radius 7
    expect(e.rho).toBeCloseTo(18 * Math.SQRT2 + 7);
    expect(Math.hypot(e.rho * e.dx - 18, e.rho * e.dy - 18)).toBeCloseTo(7);
  });

  it('points the hour hand at 1:00 on 16:9 at about 46.7 degrees (to the "1"), and 3:00 at 90', () => {
    expect(edgePoint(30, 92, 50, 14).theta).toBeCloseTo(46.7, 1);
    expect(edgePoint(90, 92, 50, 14).theta).toBeCloseTo(90, 5);
  });

  it('never leaves the rounded rectangle, at any angle', () => {
    [[92, 50, 14], [50, 92, 14], [50, 50, 7], [92, 50, 0]].forEach(([w, h, r]) => {
      const a = w / 2;
      const b = h / 2;
      for (let phi = 0; phi < 360; phi += 0.5) {
        const e = edgePoint(phi, a, b, r);
        const x = Math.abs(e.rho * e.dx);
        const y = Math.abs(e.rho * e.dy);
        expect(x).toBeLessThanOrEqual(a + 1e-6);
        expect(y).toBeLessThanOrEqual(b + 1e-6);
        if (x > a - r && y > b - r) {
          expect(Math.hypot(x - (a - r), y - (b - r))).toBeLessThanOrEqual(r + 1e-6);
        }
        expect(Math.hypot(e.nx, e.ny)).toBeCloseTo(1, 5);
      }
    });
  });
});

describe('dialMarks', () => {
  const sizes = [[184, 100], [100, 184], [100, 100], [102.4, 76.8 - 0], [76.8, 102.4]];

  it('keeps the numerals clear of each other and of the face edge in the reference formats and 4:3', () => {
    sizes.forEach(([w, h]) => {
      const face = faceSize(w, h);
      const { numerals } = dialMarks(face, { numeralHours: ALL });
      expect(numerals).toHaveLength(12);
      numerals.forEach((n, i) => {
        expect(Math.abs(n.x) + n.w / 2).toBeLessThan(face.a);
        expect(Math.abs(n.y) + n.h / 2).toBeLessThan(face.b);
        numerals.slice(i + 1).forEach((m) => {
          const apartX = Math.abs(n.x - m.x) >= (n.w + m.w) / 2;
          const apartY = Math.abs(n.y - m.y) >= (n.h + m.h) / 2;
          expect(apartX || apartY).toBe(true);
        });
      });
    });
  });

  it('puts the 12 numeral at the middle of the top and the 3 at the middle of the right side', () => {
    const { numerals } = dialMarks(faceSize(184, 100), { numeralHours: ALL });
    const twelve = numerals.find((n) => n.label === 12);
    const three = numerals.find((n) => n.label === 3);
    expect(twelve.x).toBeCloseTo(0);
    expect(twelve.y).toBeLessThan(0);
    expect(three.y).toBeCloseTo(0);
    expect(three.x).toBeGreaterThan(0);
  });

  it('spaces the ticks at least 4 rem apart on 16:9, 9:16 and 1:1', () => {
    [[184, 100], [100, 184], [100, 100]].forEach(([w, h]) => {
      const face = faceSize(w, h);
      const pts = [];
      for (let k = 0; k < 60; k += 1) {
        const e = edgePoint(6 * k, face.a, face.b, face.r);
        pts.push([e.rho * e.dx, e.rho * e.dy]);
      }
      let min = Infinity;
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % 60];
        min = Math.min(min, Math.hypot(p[0] - q[0], p[1] - q[1]));
      });
      expect(min).toBeGreaterThan(4);
    });
  });

  it('draws 48 ticks and 12 dots, or only the dots, and scales marks down on tiny faces', () => {
    const full = dialMarks(faceSize(100, 100), { dotHours: ALL });
    expect(full.tickPath.split('M').length - 1).toBe(48);
    expect(full.dotPath.split('M').length - 1).toBe(12);
    const icon = dialMarks(faceSize(4.4, 4.4), { ticks: false, dotHours: [0, 3, 6, 9] });
    expect(icon.tickPath).toBe('');
    expect(icon.dotPath.split('M').length - 1).toBe(4);
    expect(icon.unit).toBeLessThan(0.2);
  });
});

describe('handPoses', () => {
  const face = faceSize(184, 100);
  const formats = [[184, 100], [100, 184], [100, 100], [102.4, 76.8], [76.8, 102.4], [38, 38], [4.4, 4.4], [16, 16], [56, 56]];

  it('has fixed lengths: seconds 70% of the smaller radius, hour and minute at 0.61 : 0.97 : 1 of it', () => {
    const len = handLengths(face);
    expect(len.second).toBeCloseTo(0.7 * 50);
    expect(handLengths(faceSize(100, 184)).second).toBeCloseTo(0.7 * 50);
    expect(len.minute / len.second).toBeCloseTo(0.97);
    expect(len.hour / len.second).toBeCloseTo(0.61);
  });

  it('matches the spec values: 35.0 / 33.9 / 21.35 on the big faces, 10.0 on the compact D 38 with 12/3/6/9, 5.6 and 1.5 on the strips', () => {
    [[184, 100], [100, 184], [100, 100]].forEach(([w, h]) => {
      const f = faceSize(w, h);
      const l = handLengths(f, dialMarks(f, { numeralHours: ALL }).numerals);
      expect(l.second).toBeCloseTo(35, 1);
      expect(l.minute).toBeCloseTo(33.95, 1);
      expect(l.hour).toBeCloseTo(21.35, 1);
    });
    const c = faceSize(38, 38);
    expect(handLengths(c, dialMarks(c, { numeralHours: [0, 3, 6, 9] }).numerals).second).toBeCloseTo(10, 1);
    expect(handLengths(faceSize(16, 16)).second).toBeCloseTo(5.6, 1);
    expect(handLengths(faceSize(4.4, 4.4)).second).toBeCloseTo(1.5, 1);
  });

  it('keeps each hand at the same length at every angle and time, in every format, never above 70% of the smaller radius', () => {
    formats.forEach(([w, h]) => {
      const f = faceSize(w, h);
      const len = handLengths(f);
      expect(len.second).toBeLessThanOrEqual(HAND_FRACTION * Math.min(f.a, f.b) + 1e-9);
      expect(len.second).toBeGreaterThan(len.minute);
      expect(len.minute).toBeGreaterThan(len.hour);
      for (let m = 0; m < 60; m += 1) {
        for (let s = 0; s < 60; s += 7) {
          const p = handPoses(f, { hour: m % 12, minute: m, second: s });
          expect(p.hour.length).toBe(len.hour);
          expect(p.minute.length).toBe(len.minute);
          expect(p.second.length).toBe(len.second);
        }
      }
      for (let phi = 0; phi < 360; phi += 0.5) {
        expect(handPoses(f, { hour: 0, minute: 0, second: phi / 6 }).second.length).toBe(len.second);
      }
    });
  });

  it('points at the 1 on 1:05:00 on 16:9 and at 90 degrees on 3:00:00 (the direction still follows the outline rule)', () => {
    expect(handPoses(face, { hour: 1, minute: 0, second: 0 }).hour.theta).toBeCloseTo(46.7, 1);
    expect(handPoses(face, { hour: 3, minute: 0, second: 0 }).hour.theta).toBeCloseTo(90, 5);
    expect(handPoses(face, { hour: 1, minute: 5, second: 0 }).minute.theta)
      .toBeCloseTo(edgePoint(30, 92, 50, 14).theta, 5);
  });

  it('keeps every hand inside the face at every minute, in every format (corner zones included)', () => {
    formats.forEach(([w, h]) => {
      const f = faceSize(w, h);
      const len = handLengths(f);
      for (let m = 0; m < 60; m += 1) {
        expect(len.second).toBeLessThan(edgePoint(6 * m, f.a, f.b, f.r).rho);
      }
    });
  });

  it('never touches a numeral: no hand, at any of the 360 directions, reaches a numeral box (12 numerals, or 12/3/6/9 when D < 28)', () => {
    formats.filter(([w, h]) => Math.min(w, h) >= 21).forEach(([w, h]) => {
      const f = faceSize(w, h);
      const { numerals } = dialMarks(f, { numeralHours: Math.min(w, h) >= 28 ? ALL : [0, 3, 6, 9] });
      const len = handLengths(f, numerals);
      for (let phi = 0; phi < 360; phi += 1) {
        const rad = (phi * Math.PI) / 180;
        for (let d = 0; d <= len.second; d += len.second / 20) {
          const x = d * Math.sin(rad);
          const y = -d * Math.cos(rad);
          numerals.forEach((n) => {
            const inside = Math.abs(x - n.x) < n.w / 2 && Math.abs(y - n.y) < n.h / 2;
            expect(inside).toBe(false);
          });
        }
      }
    });
  }, 30000);
});
