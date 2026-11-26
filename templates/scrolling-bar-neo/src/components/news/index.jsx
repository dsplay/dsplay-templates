import { useLayoutEffect, useMemo, useRef } from 'react';
import { useView } from '../../hooks/view-context';
import useTickerItems from '../../hooks/use-ticker-items';
import { droppedAt, nextLevel } from '../../util/layout';
import { supportsAnimation } from '../../util/ticker';
import { barShadow } from '../../util/theme';
import Ticker from '../ticker';
import Rotator from '../rotator';
import Empty from '../empty';
import './style.sass';

/**
 * The middle of the bar: the only part that differs from the info bar. Where the info bar has the quote capsules and the headline,
 * here is ONE inset capsule, the same box as a quote (height, padding, radius, relief per set), with the text rolling inside.
 * It is `flex: 1`: it takes all the room the other blocks leave, and it decides which of them go (sponsor, then weather).
 */
function News() {
  const {
    theme, stage, settings, dropped, setDropped, logos,
  } = useView();
  const items = useTickerItems(settings);
  const root = useRef(null);

  // the width of the box changes when a block goes or comes back; the hysteresis (56 / 60 rem) keeps it from flip-flopping
  useLayoutEffect(() => {
    const el = root.current;
    if (el && stage.remPx && stage.set !== 'v') {
      const next = nextLevel({
        box: el.getBoundingClientRect().width / stage.remPx,
        current: dropped,
        set: stage.set,
        has: {
          weather: Boolean(settings.latitude && settings.longitude),
          clock: settings.showClock,
          circle: logos.feed.status !== 'none',
          company: settings.showLogo,
        },
      });
      if (next !== dropped) {
        setDropped(next);
      }
    }
  }, [stage.remPx, stage.w, stage.h, stage.set, dropped, setDropped, settings.latitude, settings.longitude, settings.showClock, settings.showLogo, logos.feed.status]);

  const animate = useMemo(
    () => settings.animationEnabled && supportsAnimation(document.documentElement.style),
    [settings.animationEnabled],
  );
  const vertical = stage.set === 'v';
  const feedLogo = logos.feed;
  const circleOut = stage.set !== 'v' && droppedAt(dropped, stage.set).circle;

  let content;
  if (items.length === 0) {
    content = <Empty vertical={vertical} />;
  } else if (animate && !vertical) {
    content = <Ticker items={items} />;
  } else {
    content = <Rotator items={items} lines={vertical ? 12 : 1} />;
  }

  const well = {
    backgroundColor: theme.base,
    boxShadow: barShadow(theme, 'inset', stage.set),
    borderRadius: settings.rounded ? `${vertical ? 4.2 : 4}rem` : '0.4rem',
  };

  return (
    <div className="widget news" ref={root}>
      {feedLogo.status !== 'none' && !circleOut && (
        <div className="feed-logo" style={{ visibility: feedLogo.status === 'ok' ? 'visible' : 'hidden', borderColor: theme.dark }}>
          {feedLogo.status === 'ok' && <img alt="" src={feedLogo.src} />}
        </div>
      )}
      <div className="well" style={well}>
        <div className="window">{content}</div>
      </div>
    </div>
  );
}

export default News;
