import { useEffect, useState } from 'react';
import { readCache, writeCache } from '../util/cache';

/**
 * A value from the network that survives failures: the last good one is served for up to 6 h, then the widget hides (null).
 * @param {string} key cache key; falsy disables the source
 * @param {() => Promise<*>} fetcher
 * @param {number} refreshMs
 */
export default function useRemote(key, fetcher, refreshMs) {
  const [state, setState] = useState(() => ({ key, value: key ? readCache(key, Date.now()) : null }));

  useEffect(() => {
    if (!key) {
      return undefined;
    }
    let alive = true;
    let timer;
    const fallback = () => {
      if (alive) {
        setState({ key, value: readCache(key, Date.now()) });
      }
    };
    const load = () => {
      Promise.resolve()
        .then(fetcher)
        .then((fresh) => {
          if (!alive) {
            return;
          }
          if (fresh === null || fresh === undefined) {
            fallback();
            return;
          }
          writeCache(key, fresh, Date.now());
          setState({ key, value: fresh });
        })
        .catch(fallback);
      timer = setTimeout(load, refreshMs);
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // the callers rebuild `fetcher` on every render; the key identifies the source
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, refreshMs]);

  if (!key) {
    return null;
  }
  return state.key === key ? state.value : null;
}
