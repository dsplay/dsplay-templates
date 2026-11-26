import { useEffect, useState } from 'react';
import { candidatesOf, LOAD_TIMEOUT } from '../util/logo';

/**
 * Resolves a logo from upload + link. Tries each source with `new Image()` (error or 8 s: next one).
 * @returns {{ status: 'none' | 'loading' | 'ok', src: string }}
 * 'none' = nothing was given or everything failed; while 'loading' the space stays reserved.
 */
export default function useLogo(upload, url) {
  const key = candidatesOf(upload, url).join('\n');
  const [state, setState] = useState({ key: '', status: 'loading', src: '' });

  useEffect(() => {
    if (!key) {
      return undefined;
    }
    const sources = key.split('\n');
    let alive = true;
    let timer;
    let image;
    const attempt = (i) => {
      if (!alive) {
        return;
      }
      if (i >= sources.length) {
        setState({ key, status: 'none', src: '' });
        return;
      }
      const current = new Image();
      image = current;
      timer = setTimeout(() => {
        current.onload = null;
        current.onerror = null;
        attempt(i + 1);
      }, LOAD_TIMEOUT);
      current.onload = () => {
        clearTimeout(timer);
        if (alive) {
          setState({ key, status: 'ok', src: sources[i] });
        }
      };
      current.onerror = () => {
        clearTimeout(timer);
        attempt(i + 1);
      };
      current.src = sources[i];
    };
    attempt(0);
    return () => {
      alive = false;
      clearTimeout(timer);
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [key]);

  if (!key) {
    return { status: 'none', src: '' };
  }
  return state.key === key ? state : { status: 'loading', src: '' };
}
