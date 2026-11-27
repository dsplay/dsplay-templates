import { useEffect, useState } from 'react';

const read = () => ({ w: window.innerWidth, h: window.innerHeight });

/** The window size (px), updated on resize and rotation. */
export default function useWindowSize() {
  const [size, setSize] = useState(read);

  useEffect(() => {
    const update = () => setSize(read());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    update();
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return size;
}
