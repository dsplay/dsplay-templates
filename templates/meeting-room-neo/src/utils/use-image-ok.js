import { useEffect, useState } from 'react';

/**
 * Whether the image at `src` loads: false without a src, undefined while loading, then true/false.
 * Lets the layout drop a logo card (instead of showing a broken image) when the file fails.
 */
export default function useImageOk(src) {
  const [result, setResult] = useState({ src: undefined, ok: undefined });

  useEffect(() => {
    if (!src) return undefined;
    let active = true;
    const img = new Image();
    img.onload = () => active && setResult({ src, ok: true });
    img.onerror = () => active && setResult({ src, ok: false });
    img.src = src;
    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (!src) return false;
  return result.src === src ? result.ok : undefined;
}
