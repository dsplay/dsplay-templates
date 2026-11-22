import { useEffect, useState } from 'react';

/** False while the question is alone on screen, true from `ms` on (the answer is revealed and stays until the media ends). Starts again for another joke. */
export default function useReveal(ms, key) {
  const [revealedKey, setRevealedKey] = useState(null);
  useEffect(() => {
    const timer = setTimeout(() => setRevealedKey(key), ms);
    return () => clearTimeout(timer);
  }, [ms, key]);
  return revealedKey === key;
}
