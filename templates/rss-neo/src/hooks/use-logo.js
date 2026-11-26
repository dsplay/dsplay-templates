import { useEffect, useState } from 'react';
import { LOAD_TIMEOUT_MS } from '../util/logo-url';

/**
 * Resolves the company logo from the candidates in order (upload, then link): each is preloaded with a timeout of 8 s.
 * Never blocks the screen. `pending` while the first attempt runs (the tile keeps its room), then either the first source
 * that loaded or none (the tile collapses once). A logo that arrives after its timeout is ignored for this showing.
 * @param {string[]} sources
 * @returns {{ src: string, pending: boolean }}
 */
export default function useLogo(sources) {
  const key = sources.join('\n');
  const [state, setState] = useState({ key: '', src: '' });

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    let timer;
    const list = key ? key.split('\n') : [];

    const finish = (src) => {
      if (!cancelled) {
        setState({ key, src });
      }
    };
    const attempt = () => {
      if (cancelled) {
        return;
      }
      if (index >= list.length) {
        finish('');
        return;
      }
      const src = list[index];
      index += 1;
      const image = new Image();
      const settle = (ok) => {
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        if (ok) {
          finish(src);
        } else {
          attempt();
        }
      };
      timer = setTimeout(() => settle(false), LOAD_TIMEOUT_MS);
      image.onload = () => settle(true);
      image.onerror = () => settle(false);
      image.src = src;
    };
    attempt();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key]);

  if (!key) {
    return { src: '', pending: false };
  }
  return state.key === key ? { src: state.src, pending: false } : { src: '', pending: true };
}
