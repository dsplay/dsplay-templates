import { useLayoutEffect, useState } from 'react';

// Design screen (px) per format: 1 rem = 10 px on it. See spec-design-diretrizes.md §1-§2.
const DESIGN_SCREENS = {
  landscape: [1920, 1080],
  wide: [1920, 480],
  portrait: [1080, 1920],
  square: [1080, 1080],
  'strip-h': [1920, 52],
  'strip-v': [200, 1920],
};

/**
 * Classifies the window by its aspect ratio (r = width / height).
 * @param {number} w
 * @param {number} h
 * @returns {'landscape'|'wide'|'portrait'|'square'|'strip-h'|'strip-v'}
 */
export function classify(w, h) {
  const r = w / h;
  if (r >= 6) return 'strip-h';
  if (r >= 2.4) return 'wide';
  if (r > 1.2) return 'landscape';
  if (r >= 0.83) return 'square';
  if (r > 1 / 6) return 'portrait';
  return 'strip-v';
}

/**
 * The rem size (px) that makes the design screen of the format fit the window ("contain").
 * @param {string} format
 * @param {number} w
 * @param {number} h
 * @returns {number}
 */
export function remSize(format, w, h) {
  const [refW, refH] = DESIGN_SCREENS[format];
  return Math.min(w / refW, h / refH) * 10;
}

const read = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return { w, h, format: classify(w, h) };
};

/**
 * Tracks the screen format and keeps `<html>`'s font-size at the format's rem scale, so every size in the
 * template can be written in rem. Local to the template until the shared library provides it.
 */
export default function useFormat() {
  const [screen, setScreen] = useState(read);

  useLayoutEffect(() => {
    const update = () => setScreen(read());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  useLayoutEffect(() => {
    document.documentElement.style.fontSize = `${remSize(screen.format, screen.w, screen.h)}px`;
  }, [screen]);

  return screen.format;
}
