import { useEffect, useMemo, useState } from 'react';
import { buildItems } from '../util/ticker';
import {
  cachedTitles, fetchTitles, REFRESH_MS, RETRY_MS, STALE_MS,
} from '../util/feed';

/**
 * The plain-text items of the ticker. The feed is read again every 10 min; with no answer the last one (under 6 h old) keeps rolling,
 * and with nothing at all it tries again in 1 min. Unmounting cancels the timer.
 */
export default function useTickerItems(settings) {
  const {
    source, text, rssUrl, limit,
  } = settings;
  const useFeed = source !== 'text' && Boolean(rssUrl);
  const [feed, setFeed] = useState(() => (useFeed ? cachedTitles(rssUrl, STALE_MS) || [] : []));

  useEffect(() => {
    if (!useFeed) {
      return undefined;
    }
    let timer;
    let alive = true;
    const load = () => {
      const fresh = cachedTitles(rssUrl, REFRESH_MS);
      if (fresh) {
        setFeed(fresh);
        timer = setTimeout(load, REFRESH_MS);
        return;
      }
      fetchTitles(rssUrl).then((titles) => {
        if (alive) {
          setFeed(titles);
          timer = setTimeout(load, titles.length ? REFRESH_MS : RETRY_MS);
        }
      }, () => {
        if (alive) {
          const old = cachedTitles(rssUrl, STALE_MS);
          setFeed(old || []);
          timer = setTimeout(load, old ? REFRESH_MS : RETRY_MS);
        }
      });
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [useFeed, rssUrl]);

  return useMemo(
    () => buildItems({
      source, text, feed: useFeed ? feed : [], limit,
    }),
    [source, text, feed, useFeed, limit],
  );
}
