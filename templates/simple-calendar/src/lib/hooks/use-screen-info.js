import { useEffect, useState } from 'react';
import { calculateScreenInfo, DEFAULT_SQUARE_FACTOR, DEFAULT_BANNER_FACTOR } from '../utils/screen';

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
