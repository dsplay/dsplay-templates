import { edgePoint } from './edge-point';

const round = (n) => Math.round(n * 100) / 100;

// the design size (rem) at which the marks have their spec size; smaller faces scale them down
const REFERENCE_D = 38;

/**
 * Size of a face (rem): half axes, shorter side and corner radius (0.14 x D).
 * @param {number} width
 * @param {number} height
 */
export function faceSize(width, height) {
  const D = Math.min(width, height);
  return {
    a: width / 2, b: height / 2, D, r: 0.14 * D,
  };
}

// analog-clock-neo: the dial sits in a carved well WELL_INSET rem inside the face, and its shadow reaches ~1.3 rem, so
// the marks are measured from the WELL outline and move 1 rem further in (tick at rho' - 3u, numeral at rho' - 5.8u).
export const WELL_INSET = 2;

/**
 * The outline the marks and hands are measured from: the face itself, or the well inside it.
 * @param {{a: number, b: number, D: number, r: number}} face
 * @param {boolean} well
 */
export function contour(face, well) {
  if (!well) return face;
  return {
    a: face.a - WELL_INSET, b: face.b - WELL_INSET, D: face.D, r: Math.max(0, face.r - WELL_INSET),
  };
}

/**
 * Static part of the dial (M-007 §2.3): minute ticks, hour dots and numeral positions, in rem, centred on (0, 0)
 * with y pointing down (SVG).
 * @param {{a: number, b: number, D: number, r: number}} face
 * @param {{ticks?: boolean, dotHours?: number[], numeralHours?: number[]}} options
 *   ticks: draw the 60 minute ticks (hour positions that are not dots keep a tick);
 *   dotHours: hours (0-11) drawn as a dot; numeralHours: hours (1-12 as 0-11) that get a numeral.
 */
export function dialMarks(face, {
  ticks = true, dotHours = [], numeralHours = [], well = false,
} = {}) {
  const {
    a, b, r, D,
  } = contour(face, well);
  const unit = Math.min(1, D / REFERENCE_D);
  const inset = (well ? 3 : 2) * unit;
  const numeralInset = (well ? 5.8 : 4.8) * unit;
  const tickLen = 2 * unit;
  const dotR = 1.2 * unit;
  const tickParts = [];
  const dotParts = [];

  for (let k = 0; k < 60; k += 1) {
    const hour = k % 5 === 0 ? k / 5 : -1;
    const asDot = hour >= 0 && dotHours.includes(hour);
    if (asDot || ticks) {
      const e = edgePoint(6 * k, a, b, r);
      // centre of the mark: `inset` inside the outline, measured along the normal
      const cx = e.rho * e.dx - inset * e.nx;
      const cy = -(e.rho * e.dy - inset * e.ny);
      if (asDot) {
        dotParts.push(`M${round(cx - dotR)} ${round(cy)}a${round(dotR)} ${round(dotR)} 0 1 0 ${round(2 * dotR)} 0a${round(dotR)} ${round(dotR)} 0 1 0 ${round(-2 * dotR)} 0`);
      } else {
        const hx = (e.nx * tickLen) / 2;
        const hy = (e.ny * tickLen) / 2;
        tickParts.push(`M${round(cx - hx)} ${round(cy + hy)}L${round(cx + hx)} ${round(cy - hy)}`);
      }
    }
  }

  const F = 0.125 * D;
  const numerals = numeralHours.map((hour) => {
    const label = hour === 0 ? 12 : hour;
    const e = edgePoint(30 * hour, a, b, r);
    const w = String(label).length * 0.56 * F;
    const h = 0.71 * F;
    const ext = (Math.abs(e.dx) * w + Math.abs(e.dy) * h) / 2;
    const dist = e.rho - numeralInset - ext;
    return {
      label, x: round(dist * e.dx), y: round(-dist * e.dy), w, h,
    };
  });

  return {
    tickPath: tickParts.join(''),
    dotPath: dotParts.join(''),
    tickWidth: round(0.4 * unit),
    numerals,
    fontSize: F,
    unit,
  };
}

// Hands have a FIXED length, the same at every angle (decided 10/nov). R = min(a, b); the seconds hand is 70% of R,
// or less when numerals are shown and their nearest edge is closer: it then stops 0.8 u short of the closest numeral,
// so no hand ever covers a numeral. Hour and minute keep the proportion 0.61 : 0.97 : 1. Only the direction (theta)
// comes from the outline rule, so the hand still points at its mark.
export const HAND_FRACTION = 0.7;
export const HAND_RATIO = { hour: 0.61, minute: 0.97, second: 1 };
const NUMERAL_GAP = 0.8;

/** Distance (rem) from the centre to the nearest point of the numeral boxes (Infinity without numerals). */
export function nearestNumeral(numerals) {
  return numerals.reduce((min, n) => {
    const dx = Math.max(0, Math.abs(n.x) - n.w / 2);
    const dy = Math.max(0, Math.abs(n.y) - n.h / 2);
    return Math.min(min, Math.hypot(dx, dy));
  }, Infinity);
}

/**
 * Lengths (rem) of the three hands of a face: constant, they do not depend on the angle or the time.
 * @param {{a: number, b: number, D: number}} face
 * @param {{x: number, y: number, w: number, h: number}[]} [numerals] the numerals shown (from `dialMarks`)
 */
export function handLengths(outline, numerals = [], well = false) {
  const face = contour(outline, well);
  const unit = Math.min(1, face.D / REFERENCE_D);
  const second = Math.max(0, Math.min(
    HAND_FRACTION * Math.min(face.a, face.b),
    nearestNumeral(numerals) - NUMERAL_GAP * unit,
  ));
  return {
    hour: HAND_RATIO.hour * second,
    minute: HAND_RATIO.minute * second,
    second,
  };
}

/**
 * Direction (degrees clockwise from 12) and length of the three hands for a time (M-007 §2.4).
 * @param {{a: number, b: number, r: number}} face
 * @param {{hour: number, minute: number, second: number}} time hour 0-11
 * @param {object[]} [numerals] the numerals shown (they shorten the hands)
 */
export function handPoses(outline, { hour, minute, second }, numerals = [], well = false) {
  const face = contour(outline, well);
  const { a, b, r } = face;
  const len = handLengths(outline, numerals, well);
  const h = edgePoint(30 * (hour + minute / 60), a, b, r);
  const m = edgePoint(6 * (minute + second / 60), a, b, r);
  const s = edgePoint(6 * second, a, b, r);
  return {
    hour: { theta: h.theta, length: len.hour },
    minute: { theta: m.theta, length: len.minute },
    second: { theta: s.theta, length: len.second },
  };
}
