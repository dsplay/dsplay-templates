import { useEffect, useState } from 'react';
import { getColorSync } from 'colorthief';

/**
 * Dominant color (hex string, e.g. '#0c54fc') of the image at `src`. `undefined` while it loads, and
 * when it can't be read: no `src`, the image failed to load, or it is served without CORS headers
 * (which taints the canvas, so its pixels are unreadable).
 */
export default function useDominantColor(src) {
  // Keyed by `src`, so a color extracted from the previous image is never returned for the new one.
  const [result, setResult] = useState({});

  useEffect(() => {
    if (!src) return undefined;

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.addEventListener('load', () => {
      if (cancelled) return;
      try {
        // RGB quantization, as the colorthief 2.x behind the former color-thief-react did. The 3.x default
        // (OKLCH) lands noticeably off the logo's own background color, leaving a visible seam around it.
        const color = getColorSync(img, { colorSpace: 'rgb' });
        setResult({ src, color: color ? color.hex() : undefined });
      } catch {
        setResult({ src });
      }
    });
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return result.src === src ? result.color : undefined;
}
