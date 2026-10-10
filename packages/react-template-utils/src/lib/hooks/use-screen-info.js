import { useEffect, useState } from 'react';
import { calculateScreenInfo, DEFAULT_SQUARE_FACTOR, DEFAULT_BANNER_FACTOR } from '../utils/screen';

/**
 * Tracks the current screen format (landscape, portrait, square, h-banner, v-banner), recalculating
 * on window resize.
 * @param {object} [options]
 * @param {number} [options.squareFactor] - Max relative width/height deviation to be considered square
 * @param {number} [options.bannerFactor] - Min aspect ratio to be considered a banner
 * @returns {import('../utils/screen').ScreenInfo | undefined} `undefined` when `window` is not available
 */
export default ({
  squareFactor = DEFAULT_SQUARE_FACTOR,
  bannerFactor = DEFAULT_BANNER_FACTOR,
} = {}) => {
  const [state, setState] = useState(calculateScreenInfo({ squareFactor, bannerFactor }));

  useEffect(() => {
    let timeout = null;

    const resizeListener = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // console.log('setting state..');
        setState(calculateScreenInfo());
      }, 500);
    };

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return state;
};
