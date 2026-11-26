import { useEffect, useState } from 'react';

const TIMEOUT_MS = 8000;

/**
 * The first of `sources` that loads (error or 8 s: the next one). Status `loading` while it tries (the layout keeps the room of the
 * photo), `ok` with `src`, or `none` (no source, or all failed: the layout drops the photo, spec M-001b section 3).
 * @param {Array<string|undefined>} sources
 * @returns {{ status: 'loading' | 'ok' | 'none', src: string }}
 */
export default function useFirstImage(sources) {
  const key = sources.filter(Boolean).join('\n');
  const [state, setState] = useState({ key: '', status: 'loading', src: '' });

  useEffect(() => {
    if (!key) {
      return undefined;
    }
    const list = key.split('\n');
    let alive = true;
    let timer;
    let image;
    const attempt = (i) => {
      if (!alive) {
        return;
      }
      if (i >= list.length) {
        setState({ key, status: 'none', src: '' });
        return;
      }
      const current = new Image();
      image = current;
      timer = setTimeout(() => {
        current.onload = null;
        current.onerror = null;
        attempt(i + 1);
      }, TIMEOUT_MS);
      current.onload = () => {
        clearTimeout(timer);
        if (alive) {
          setState({ key, status: 'ok', src: list[i] });
        }
      };
      current.onerror = () => {
        clearTimeout(timer);
        attempt(i + 1);
      };
      current.src = list[i];
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
