// What the rolling box needs to decide which fixed blocks stay (spec M-013 v2, section 3). Estimates in rem of the design screen.
// There is no label chip: the box takes all the room.

// hysteresis: a block goes when the window is under LOW and comes back when it would be at HIGH or more
export const LIMITS = { default: { low: 56, high: 60 }, c: { low: 50, high: 54 } };

// widths (rem) of the blocks that can be pushed out; GAP = the space that goes with them (hour to weather, per set; 2 rem next to the box)
const WEATHER = { a: 17.5, b: 16.6, p: 16.6 };
const CLOCK = { a: 14.5, b: 12.5, p: 12.5 };
const COMPANY = { a: 20, b: 18, p: 18, c: 16 };
const CIRCLE = { a: 5.6, b: 5, p: 5, c: 4.4 };
const HOUR_WEATHER_GAP = { a: 12, b: 6, p: 6 };
const NEXT_TO_BOX = 2;
const CIRCLE_GAP = 3;

/**
 * Order in which blocks go (decision of the Alê: the logos are the last): weather, hour, the feed circle, the company logo.
 * In C the hour and the weather are on the other row and free no room, so only the circle and the company logo can go.
 */
export const dropOrder = (set) => (set === 'c' ? ['circle', 'company'] : ['weather', 'clock', 'circle', 'company']);

export const maxLevel = (set) => dropOrder(set).length;

/** Which blocks are out at `level`: { weather, clock, circle, company } (booleans). */
export function droppedAt(level, set) {
  const out = {
    weather: false, clock: false, circle: false, company: false,
  };
  dropOrder(set).slice(0, level).forEach((name) => {
    out[name] = true;
  });
  return out;
}

/** Room (rem) a block takes in the row and gives back when it goes. */
function roomOf(name, set) {
  switch (name) {
    case 'weather': return WEATHER[set] + HOUR_WEATHER_GAP[set];
    case 'clock': return CLOCK[set] + NEXT_TO_BOX;
    case 'circle': return CIRCLE[set] + CIRCLE_GAP;
    default: return COMPANY[set] + NEXT_TO_BOX;
  }
}

/**
 * The window (rem) the text would have at `level`, given the width `box` of the rolling widget now (at `current` level).
 * The circle is inside the widget (it eats from the window); the other blocks are its neighbors (they give their room to the widget).
 * @param {{ box: number, current: number, level: number, set: string, has: object }} p `has`: { weather, clock, circle, company }
 */
export function windowAt({
  box, current, level, set, has,
}) {
  const names = dropOrder(set);
  const out = (l) => names.slice(0, l);
  const present = (name) => Boolean(has[name]);
  let width = box;
  names.forEach((name) => {
    if (!present(name)) {
      return;
    }
    const wasOut = out(current).indexOf(name) >= 0;
    const isOut = out(level).indexOf(name) >= 0;
    if (name === 'circle') {
      width -= isOut ? 0 : CIRCLE[set] + CIRCLE_GAP;
    } else if (isOut && !wasOut) {
      width += roomOf(name, set);
    } else if (!isOut && wasOut) {
      width -= roomOf(name, set);
    }
  });
  return width;
}

/** The next level: one step up while the window is under `low`, one step down when the lighter level fits `high`. */
export function nextLevel(args) {
  const { current, set } = args;
  const { low, high } = LIMITS[set === 'c' ? 'c' : 'default'];
  if (current < maxLevel(set) && windowAt({ ...args, level: current }) < low) {
    return current + 1;
  }
  if (current > 0 && windowAt({ ...args, level: current - 1 }) >= high) {
    return current - 1;
  }
  return current;
}
