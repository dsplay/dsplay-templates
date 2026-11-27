import { useMemo } from 'react';
import {
  faceSize, dialMarks, handPoses, nameLayout, contourRadius, NAME_LINE_HEIGHT, WELL_INSET,
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

// A hand sweeps to its next position, except on the tick it wraps around to zero (it would spin back).
const transitionClass = (enabled, wraps) => (enabled && !wraps ? ' transition-effect' : '');

/**
 * One hand: a wrapper of fixed length that rotates about the centre of the disc (its bottom edge), with the body on top and
 * a counterweight tail below the centre. Only `transform` moves.
 */
function Hand({
  name, theta, length, width, tail, color, R, effect,
}) {
  return (
    <div
      className={`hand hand-${name}${transitionClass(effect.on, effect.wraps)}`}
      style={{
        left: `${num(R - width / 2)}rem`,
        top: `${num(R - length)}rem`,
        width: `${num(width)}rem`,
        height: `${num(length)}rem`,
        ...rotate(theta),
      }}
    >
      <div className="hand-body" style={{ width: `${num(width)}rem`, height: `${num(length)}rem`, backgroundColor: color }} />
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
 * The neumorphic round face (M-011 + spec world-clocks-analog-neo): a disc of `diameter` rem in the base color. Layers, bottom
 * to top: disc (static, elevated shadow), well (static, carved shadow, only when `well`), dial (marks and numerals, plain),
 * the city name, the three hands (the only moving parts) and the pin (flat: the spec's shadow budget has none for it). No `overflow: hidden` anywhere.
 * @param {object} props
 * @param {import('moment').Moment} props.date
 * @param {number} props.diameter disc diameter (rem)
 * @param {number} props.pxRem size of 1 rem in px (minimum 1 px lines on tiny faces)
 * @param {object} props.look the theme from `buildClockTheme`
 * @param {'all'|'dots'|'icon'} props.marks `all`: 60 ticks + 12 hour dots; `dots`: only the 12 dots; `icon`: only 12/3/6/9
 * @param {number[]} props.numeralHours hours (0-11) with a numeral
 * @param {'elevated2'|'elevated1'|'flat'} props.relief disc relief (`elevated2` is the local city; `flat`: no shadow at all)
 * @param {boolean} props.well carved well under the dial (D >= 36)
 * @param {boolean} props.bare draw no shadows (the page that is leaving, during the cross-fade)
 * @param {string} props.name city name, drawn inside the face (empty: none)
 */
function Clock({
  date,
  diameter,
  pxRem = 10,
  look,
  marks = 'all',
  numeralHours = ALL_HOURS,
  relief = 'elevated1',
  well = false,
  bare = false,
  name = '',
  showSeconds = true,
  animated = true,
}) {
  const geometry = useMemo(() => faceSize(diameter), [diameter]);
  const icon = marks === 'icon';

  const dial = useMemo(() => dialMarks(geometry, {
    ticks: marks === 'all',
    dotHours: icon ? QUARTERS : ALL_HOURS,
    numeralHours,
    well,
  }), [geometry, marks, icon, numeralHours, well]);

  const { R, D } = geometry;
  const hour = date.hour() % 12;
  const minute = date.minute();
  const second = date.second();
  const poses = handPoses(geometry, { hour, minute, second }, dial.numerals, well);
  const label = useMemo(() => (name ? nameLayout(geometry, dial.numerals, well) : null), [name, geometry, dial, well]);
  const minLine = 1 / pxRem;
  const pin = Math.max(0.035 * D, 2 / pxRem);
  const shadows = !bare && relief !== 'flat';
  const hole = contourRadius(geometry, well);
  const bold = 0.03;

  return (
    <div className="clock" style={{ width: `${num(D)}rem`, height: `${num(D)}rem` }}>
      <div
        className="disc"
        style={{
          backgroundColor: relief === 'flat' ? look.flat : look.base,
          boxShadow: shadows ? reliefShadow(look, relief) : 'none',
        }}
      />
      {well && (
        <div
          className="well"
          style={{
            left: `${WELL_INSET}rem`,
            top: `${WELL_INSET}rem`,
            width: `${num(2 * hole)}rem`,
            height: `${num(2 * hole)}rem`,
            backgroundColor: look.base,
            boxShadow: bare ? 'none' : reliefShadow(look, 'inset'),
          }}
        />
      )}
      <div className="dial-wrap">
        <svg
          className="dial"
          viewBox={`${num(-R)} ${num(-R)} ${num(D)} ${num(D)}`}
          style={{ width: `${num(D)}rem`, height: `${num(D)}rem` }}
        >
          {dial.tickPath && <path d={dial.tickPath} fill="none" stroke={look.muted} strokeWidth={dial.tickWidth} />}
          {dial.dotPath && <path d={dial.dotPath} fill={look.muted} />}
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
      {label && (
        <div
          className="face-text face-name"
          style={{
            left: `${num(R)}rem`,
            top: `${num(R + label.y)}rem`,
            maxWidth: `${num(label.maxWidth)}rem`,
            fontSize: `${num(label.fontSize)}rem`,
            lineHeight: NAME_LINE_HEIGHT,
            color: look.label,
          }}
        >
          {name}
        </div>
      )}
      <Hand
        name="hour"
        theta={poses.hour.theta}
        length={poses.hour.length}
        width={Math.max(0.022 * D, minLine)}
        tail={0.05 * D}
        color={look.ink}
        R={R}
        effect={{ on: true, wraps: hour === 0 && minute === 0 }}
      />
      <Hand
        name="minute"
        theta={poses.minute.theta}
        length={poses.minute.length}
        width={Math.max(0.016 * D, minLine)}
        tail={0.06 * D}
        color={look.ink}
        R={R}
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
          R={R}
          effect={{ on: animated, wraps: second === 0 }}
        />
      )}
      <div
        className="pin"
        style={{
          left: `${num(R - pin / 2)}rem`,
          top: `${num(R - pin / 2)}rem`,
          width: `${num(pin)}rem`,
          height: `${num(pin)}rem`,
          backgroundColor: look.second,
        }}
      />
    </div>
  );
}

export default Clock;
