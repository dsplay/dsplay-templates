import { useLayoutEffect, useState } from 'react';

// 1 rem = 10 px on the design screen; the page scales with the smaller of the two ratios (same rule as the lib's useRootScale,
// which the 5.2.3 release does not have yet). Written to <html> so every size in the stylesheets (rem) follows.
export function remPxOf(width, height, [refWidth, refHeight]) {
  return Math.min(width / refWidth, height / refHeight) * 10;
}

const read = (design) => remPxOf(window.innerWidth, window.innerHeight, design);

/** @param {number[]} design [refWidth, refHeight] of the layout. @returns {number} px of 1 rem */
export default function useRemScale(design) {
  const [refWidth, refHeight] = design;
  const [remPx, setRemPx] = useState(() => read(design));

  useLayoutEffect(() => {
    const apply = () => {
      const next = read([refWidth, refHeight]);
      document.documentElement.style.fontSize = `${next}px`;
      setRemPx(next);
    };
    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, [refWidth, refHeight]);

  return remPx;
}
