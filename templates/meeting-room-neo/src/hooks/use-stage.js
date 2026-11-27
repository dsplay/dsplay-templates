import { useEffect, useState } from 'react';
import stageOf from '../util/stage';

const read = () => stageOf(window.innerWidth, window.innerHeight);

/** The design screen of the current window; 1 rem = `remPx` px on `<html>` (spec F-001). Updates on resize only. */
export default function useStage() {
  const [stage, setStage] = useState(read);

  useEffect(() => {
    const apply = () => {
      const next = read();
      setStage(next);
      document.documentElement.style.fontSize = `${next.remPx}px`;
    };
    apply();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply);
    }
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
    };
  }, []);

  return stage;
}
