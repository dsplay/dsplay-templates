const round = (n) => Math.round(n * 100) / 100;
const rad = (degrees) => (degrees * Math.PI) / 180;

// the design size (rem) at which the marks have their spec size; smaller faces scale them down
const REFERENCE_D = 38;

/**
 * Size of a round face (rem), M-011 §0.1: the circle of diameter D, radius R = D / 2.
 * @param {number} D diameter
 */
export function faceSize(D) {
  return { D, R: D / 2 };
}

// world-clocks-analog-neo: with a carved well (D >= 36) the dial sits WELL_INSET rem inside the disc and the marks are
// measured from the well's outline (rho' = R - 2), one rem further in than without (tick at rho' - 3u, numeral at
// rho' - 5.8u - ext): the well's shadow reaches ~1.3 rem, so nothing stands in it.
export const WELL_INSET = 2;
export const WELL_MIN_DIAMETER = 36;

/** Radius (rem) the marks are measured from: the disc, or the well inside it. */
export function contourRadius(face, well) {
  return well ? face.R - WELL_INSET : face.R;
}

/**
 * Static part of the dial (M-011 §0.1): minute ticks, hour dots and numeral positions, in rem, centred on (0, 0)
 * with y pointing down (SVG). Polar geometry: a mark at dial angle phi (clockwise from 12) sits at (R - 2u) from
 * the centre along phi; a numeral is centred at R - 4.8u - ext along phi, ext = (|sin phi| w + |cos phi| h) / 2.
 * @param {{D: number, R: number}} face
 * @param {{ticks?: boolean, dotHours?: number[], numeralHours?: number[]}} options
 *   ticks: draw the 60 minute ticks (hour positions that are not dots keep a tick);
 *   dotHours: hours (0-11) drawn as a dot; numeralHours: hours (0-11, 0 = 12) that get a numeral.
 */
export function dialMarks(face, {
  ticks = true, dotHours = [], numeralHours = [], well = false,
} = {}) {
  const { D } = face;
  const R = contourRadius(face, well);
  const unit = Math.min(1, D / REFERENCE_D);
  const inset = (well ? 3 : 2) * unit;
  const numeralInset = (well ? 5.8 : 4.8) * unit;
  const tickLen = 2 * unit;
  const dotR = 0.8 * unit;
  const tickParts = [];
  const dotParts = [];

  for (let k = 0; k < 60; k += 1) {
    const hour = k % 5 === 0 ? k / 5 : -1;
    const asDot = hour >= 0 && dotHours.includes(hour);
    if (asDot || ticks) {
      const sin = Math.sin(rad(6 * k));
      const cos = Math.cos(rad(6 * k));
      const rho = R - inset;
      const cx = rho * sin;
      const cy = -rho * cos;
      if (asDot) {
        dotParts.push(`M${round(cx - dotR)} ${round(cy)}a${round(dotR)} ${round(dotR)} 0 1 0 ${round(2 * dotR)} 0a${round(dotR)} ${round(dotR)} 0 1 0 ${round(-2 * dotR)} 0`);
      } else {
        const hx = (sin * tickLen) / 2;
        const hy = (cos * tickLen) / 2;
        tickParts.push(`M${round(cx - hx)} ${round(cy + hy)}L${round(cx + hx)} ${round(cy - hy)}`);
      }
    }
  }

  const F = 0.125 * D;
  const numerals = numeralHours.map((hour) => {
    const label = hour === 0 ? 12 : hour;
    const sin = Math.sin(rad(30 * hour));
    const cos = Math.cos(rad(30 * hour));
    const w = String(label).length * 0.56 * F;
    const h = 0.71 * F;
    const ext = (Math.abs(sin) * w + Math.abs(cos) * h) / 2;
    const dist = R - numeralInset - ext;
    return {
      label, x: round(dist * sin), y: round(-dist * cos), w, h,
    };
  });

  return {
    tickPath: tickParts.join(''),
    dotPath: dotParts.join(''),
    tickWidth: round(0.3 * unit),
    numerals,
    fontSize: F,
    unit,
  };
}

// The city name lives inside the face, below the centre (M-011 §0.4): centre 0.34 R below, size 0.10 D (at least
// 2.6 rem), at most 1.3 R wide and never wider than the gap the numerals leave (4 and 8 o'clock with 12 numerals).
export const NAME_MIN_SIZE = 2.6;
export const NAME_LINE_HEIGHT = 1.15;
// below this diameter the name does not fit inside; the bar slices put it beside the face instead
export const NAME_MIN_DIAMETER = 19;
const NAME_GAP = 0.8; // rem between the name and the numeral 6

/**
 * Where the name goes inside a face, rem relative to the centre of the face (y down).
 * @param {{D: number, R: number}} face
 * @param {{x: number, y: number, w: number, h: number}[]} numerals the numerals shown (from `dialMarks`)
 * @returns {{fontSize: number, y: number, maxWidth: number}}
 */
export function nameLayout(face, numerals = [], well = false) {
  const { D } = face;
    // the shadow of the well reaches ~1.5 rem inside its edge, so the name stays inside the circle that far in
  const limit = well ? face.R - WELL_INSET - 1.5 : face.R;
  const fontSize = Math.max(0.1 * D, NAME_MIN_SIZE);
  const half = (fontSize * NAME_LINE_HEIGHT) / 2;
  let y = 0.34 * face.R;
  // a numeral straight below the centre (the 6) pulls the name up so the two never overlap: with a well the numerals sit
  // 1 rem further in, and at 0.34 R the name would run into the 6
  numerals.forEach((n) => {
    if (n.y > 0 && Math.abs(n.x) < 0.5) y = Math.min(y, n.y - n.h / 2 - NAME_GAP - half);
  });
  let maxWidth = 1.3 * face.R;
  // the chord of the circle at the bottom edge of the name
  const bottom = y + half;
  if (bottom < limit) maxWidth = Math.min(maxWidth, 2 * Math.sqrt(limit * limit - bottom * bottom));
  numerals.forEach((n) => {
    const overlaps = Math.abs(n.y - y) < half + n.h / 2;
    if (overlaps) maxWidth = Math.min(maxWidth, 2 * Math.max(0, Math.abs(n.x) - n.w / 2));
  });
  return { fontSize, y, maxWidth };
}

// Hands have a FIXED length, the same at every angle and time. The seconds hand is 70% of R, or less when numerals
// are shown and their nearest edge is closer: it then stops 0.8 u short of the closest numeral, so no hand ever
// covers a numeral. Hour and minute keep the proportion 0.61 : 0.97 : 1.
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
 * Lengths (rem) of the three hands of a face.
 * @param {{D: number, R: number}} face
 * @param {{x: number, y: number, w: number, h: number}[]} [numerals] the numerals shown (from `dialMarks`)
 */
export function handLengths(face, numerals = [], well = false) {
  const unit = Math.min(1, face.D / REFERENCE_D);
  const second = Math.max(0, Math.min(
    HAND_FRACTION * contourRadius(face, well),
    nearestNumeral(numerals) - NUMERAL_GAP * unit,
  ));
  return {
    hour: HAND_RATIO.hour * second,
    minute: HAND_RATIO.minute * second,
    second,
  };
}

/**
 * Rotation (degrees clockwise from 12) and length of the three hands for a time: the real angle, 6 degrees per
 * minute and 30 per hour, the hand turns instead of jumping to a mark.
 * @param {{D: number, R: number}} face
 * @param {{hour: number, minute: number, second: number}} time hour 0-11
 * @param {object[]} [numerals] the numerals shown (they shorten the hands)
 */
export function handPoses(face, { hour, minute, second }, numerals = [], well = false) {
  const len = handLengths(face, numerals, well);
  return {
    hour: { theta: 30 * (hour + minute / 60), length: len.hour },
    minute: { theta: 6 * (minute + second / 60), length: len.minute },
    second: { theta: 6 * second, length: len.second },
  };
}
