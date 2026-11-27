import { useMemo } from 'react';
import {
  faceSize, dialMarks, handPoses, contour, WELL_INSET,
} from '../../utils/dial';
import { reliefShadow } from '../../utils/theme';
import './style.sass';

const num = (n) => Math.round(n * 1000) / 1000;

const rotate = (degrees) => ({
  WebkitTransform: `rotate(${num(degrees)}deg)`,
  transform: `rotate(${num(degrees)}deg)`,
});

const ALL_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const QUARTERS = [0, 3, 6, 9];

// the smallest face that still gets a carved well / an elevated pin (spec analog-clock-neo sections 2 and 5)
const WELL_MIN_D = 36;
const PIN_RELIEF_MIN_D = 30;

// A hand sweeps to its next position, except on the tick it wraps around to zero (it would spin back).
const transitionClass = (enabled, wraps) => (enabled && !wraps ? ' transition-effect' : '');

/**
 * One hand: a wrapper of fixed length that rotates about the centre of the face (its bottom edge), with the
 * body on top and a counterweight tail below the centre. Only `transform` is animated.
 */
function Hand({
  name, theta, length, width, tail, color, a, b, effect,
}) {
  return (
    <div
      className={`hand hand-${name}${transitionClass(effect.on, effect.wraps)}`}
      style={{
        left: `${num(a - width / 2)}rem`,
        top: `${num(b - length)}rem`,
        width: `${num(width)}rem`,
        height: `${num(length)}rem`,
        ...rotate(theta),
      }}
    >
      <div
        className="hand-body"
        style={{ width: `${num(width)}rem`, height: `${num(length)}rem`, backgroundColor: color }}
      />
      <div
        className="hand-tail"
        style={{
          top: `${num(length)}rem`, width: `${num(width)}rem`, height: `${num(tail)}rem`, backgroundColor: color,
        }}
      />
    </div>
  );
}

/**
 * The neumorphic analog face (spec analog-clock-neo): a rounded rectangle of `width` x `height` rem in the base color.
 * Layers, bottom to top: face (static, elevated shadow), well (static, carved shadow), dial (marks and numerals, plain),
 * `children` (label, date), the three hands (the only moving parts) and the pin. No `overflow: hidden` anywhere.
 * @param {object} props
 * @param {import('moment').Moment} props.date
 * @param {number} props.width face width (rem)
 * @param {number} props.height face height (rem)
 * @param {number} props.pxRem size of 1 rem in px (minimum 1 px lines on tiny faces)
 * @param {object} props.look the theme from `buildClockTheme`
 * @param {'all'|'icon'} props.marks `all`: 60 ticks + 12 hour dots; `icon`: only the 4 dots (12/3/6/9)
 * @param {number[]} props.numeralHours hours (0-11) with a numeral
 * @param {'elevated2'|'elevated1'|'flat'} props.relief face relief (`flat`: the thin bar H, no shadow at all)
 */
function Clock({
  date,
  width,
  height,
  pxRem = 10,
  look,
  marks = 'all',
  numeralHours = ALL_HOURS,
  showSeconds = true,
  animated = true,
  relief = 'elevated2',
  children = null,
}) {
  const geometry = useMemo(() => faceSize(width, height), [width, height]);
  const icon = marks === 'icon';
  const {
    a, b, D, r,
  } = geometry;
  const well = relief !== 'flat' && D >= WELL_MIN_D;
  const pinRelief = relief !== 'flat' && D >= PIN_RELIEF_MIN_D;

  const dial = useMemo(() => dialMarks(geometry, {
    ticks: !icon,
    dotHours: icon ? QUARTERS : ALL_HOURS,
    numeralHours,
    well,
  }), [geometry, icon, numeralHours, well]);

  const hour = date.hour() % 12;
  const minute = date.minute();
  const second = date.second();
  const poses = handPoses(geometry, { hour, minute, second }, dial.numerals, well);
  const minLine = 1 / pxRem;
  const pin = Math.max(0.035 * D, 2 / pxRem);
  const hole = contour(geometry, well);
  const bold = look.aluminum ? 0.04 : 0.03;

  return (
    <div className="clock" style={{ width: `${num(width)}rem`, height: `${num(height)}rem` }}>
      <div
        className="face"
        style={{
          borderRadius: `${num(r)}rem`,
          backgroundColor: relief === 'flat' ? look.flat : look.base,
          boxShadow: relief === 'flat' ? 'none' : reliefShadow(look, relief),
        }}
      />
      {well && (
        <div
          className="well"
          style={{
            left: `${WELL_INSET}rem`,
            top: `${WELL_INSET}rem`,
            width: `${num(2 * hole.a)}rem`,
            height: `${num(2 * hole.b)}rem`,
            borderRadius: `${num(hole.r)}rem`,
            backgroundColor: look.base,
            boxShadow: reliefShadow(look, 'inset'),
          }}
        />
      )}
      <div className="dial-wrap">
        <svg
        className="dial"
        viewBox={`${num(-a)} ${num(-b)} ${num(2 * a)} ${num(2 * b)}`}
        style={{ width: `${num(width)}rem`, height: `${num(height)}rem` }}
      >
        {dial.tickPath && (
          <path d={dial.tickPath} fill="none" stroke={look.muted} strokeWidth={dial.tickWidth} />
        )}
        {dial.dotPath && <path d={dial.dotPath} fill={look.ink} />}
        {dial.numerals.map((n) => (
          <text
            key={n.label}
            x={n.x}
            y={n.y}
            dy="0.355em"
            textAnchor="middle"
            fontFamily="Roboto, sans-serif"
            fontSize={dial.fontSize}
            fill={look.ink}
            stroke={look.ink}
            strokeWidth={bold * dial.fontSize}
            strokeLinejoin="round"
          >
            {n.label}
          </text>
        ))}
        </svg>
      </div>
      {children}
      <Hand
        name="hour"
        theta={poses.hour.theta}
        length={poses.hour.length}
        width={Math.max(0.022 * D, minLine)}
        tail={0.05 * D}
        color={look.ink}
        a={a}
        b={b}
        effect={{ on: true, wraps: hour === 0 && minute === 0 }}
      />
      <Hand
        name="minute"
        theta={poses.minute.theta}
        length={poses.minute.length}
        width={Math.max(0.016 * D, minLine)}
        tail={0.06 * D}
        color={look.ink}
        a={a}
        b={b}
        effect={{ on: true, wraps: minute === 0 && second === 0 }}
      />
      {showSeconds && (
        <Hand
          name="second"
          theta={poses.second.theta}
          length={poses.second.length}
          width={Math.max(0.008 * D, minLine)}
          tail={0.08 * D}
          color={look.second}
          a={a}
          b={b}
          effect={{ on: animated, wraps: second === 0 }}
        />
      )}
      <div
        className="pin"
        style={{
          left: `${num(a - pin / 2)}rem`,
          top: `${num(b - pin / 2)}rem`,
          width: `${num(pin)}rem`,
          height: `${num(pin)}rem`,
          backgroundColor: look.second,
          boxShadow: pinRelief ? reliefShadow(look, 'elevated1') : 'none',
        }}
      />
    </div>
  );
}

export default Clock;
