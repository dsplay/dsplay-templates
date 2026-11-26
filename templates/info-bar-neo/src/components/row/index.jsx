import { useCallback, useEffect, useRef, useState } from 'react';
import { useView } from '../../hooks/view-context';
import { droppedAt, limitsOf, nextLevel } from '../../util/fit';

// rem: side margin of the row and minimum space between widgets, per set (spec 2.1)
const LATERAL = { a: 10, b: 5, p: 5, c: 5 };
const GAP = { a: 12, b: 6, p: 6, c: 5 };
const MEASURE_EVERY = 2000;
const MARKER = 2.6; // 0.6 bar + 2 rem
const FEED_GAP = 3;
const FEED_SIZE = { a: 5.6, b: 5, p: 5, c: 4.4 };

/**
 * One row of widgets. When it has the news and the news headline would get too little room, things fall in the
 * order of the spec (2nd quote, 1st quote, date, weather, news text, clock) and come back with hysteresis.
 */
function Row({ names, widgets }) {
  const { stage, logos } = useView();
  const [level, setLevel] = useState(0);
  const root = useRef(null);
  const sizes = useRef({});
  const watched = names.indexOf('news') >= 0;

  const measure = useCallback(() => {
    const row = root.current;
    if (!watched || !row || !stage.remPx) {
      return;
    }
    const rem = (el) => el.getBoundingClientRect().width / stage.remPx;
    const gap = GAP[stage.set];
    let others = 0;
    let count = 0;
    for (let i = 0; i < row.children.length; i += 1) {
      const child = row.children[i];
      const name = child.getAttribute('data-w');
      if (name !== 'news') {
        others += rem(child);
        count += 1;
      }
      if (name === 'quotes') {
        const quotes = child.children;
        if (quotes[0]) sizes.current.quote1 = rem(quotes[0]);
        if (quotes[1]) sizes.current.quote2 = rem(quotes[1]) + 2;
        // the first quote, when alone, carries the widget's margin
        if (quotes[0] && !quotes[1]) sizes.current.quote1 = rem(quotes[0]) + gap;
      }
      if (name === 'weather' || name === 'clock') {
        sizes.current[name] = rem(child) + gap;
      }
    }
    const feed = logos.feed.status === 'none' ? 0 : FEED_SIZE[stage.set] + FEED_GAP;
    const marker = stage.set === 'a' ? 0 : MARKER;
    const inner = rem(row) - 2 * LATERAL[stage.set];
    const available = inner - others - count * gap - feed - marker;
    setLevel((current) => nextLevel(current, available, sizes.current, limitsOf(stage.set)));
  }, [watched, stage.remPx, stage.set, logos.feed.status]);

  useEffect(() => {
    measure();
    const timer = setInterval(measure, MEASURE_EVERY);
    return () => clearInterval(timer);
  }, [measure, level]);

  const drop = watched ? droppedAt(level) : [];

  return <div className="row" ref={root}>{widgets(drop)}</div>;
}

export default Row;
