import { rem } from '../../lib/layout';
import './style.sass';

/** The seconds a loop of `length` design px takes at `speed` design px a second. */
export const loopSeconds = (length, speed) => Math.max(8, Math.round(length / speed));

/** How many times the items are repeated in a group so that one group is longer than the line they run on (no gap when the loop closes). */
export const repeatsFor = (count, chip, line) => Math.max(1, Math.ceil((line + chip) / (Math.max(1, count) * chip)));

/** True when the items fit the line side by side: then they stand still. */
export const fitsLine = (count, chip, line) => count * chip <= line;

/**
 * The quotes of a banner: a row (or a column, `vertical`) that stands still while the quotes fit, and runs in a loop when they do not. `chip` is the length of
 * one quote along the movement and `line` the length of the banner, both in design px; `render(item)` draws one quote. The track is two equal groups, so
 * moving it by half its length (CSS) closes the loop. Only an HTML track moves (never SVG).
 */
function Marquee({
  items, render, chip, line, vertical = false, speed = 60,
}) {
  const wrap = (item, key) => (
    <div key={key} className="marquee__item" style={vertical ? { height: rem(chip) } : { width: rem(chip) }}>
      {render(item)}
    </div>
  );
  const direction = vertical ? 'marquee--vertical' : 'marquee--horizontal';
  if (fitsLine(items.length, chip, line)) {
    return <div className={`marquee marquee--static ${direction}`}>{items.map((item) => wrap(item, item.code))}</div>;
  }
  const reps = repeatsFor(items.length, chip, line);
  const group = [];
  for (let r = 0; r < reps; r += 1) items.forEach((item) => group.push(item));
  const seconds = loopSeconds(group.length * chip, speed);
  const style = { WebkitAnimationDuration: `${seconds}s`, animationDuration: `${seconds}s` };
  return (
    <div className={`marquee ${direction}`}>
      <div className="marquee__track" style={style}>
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee__group">
            {group.map((item, i) => wrap(item, `${copy}:${item.code}:${i}`))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
