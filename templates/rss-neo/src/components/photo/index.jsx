import { useEffect, useMemo, useRef, useState } from 'react';
import { useView } from '../../hooks/view-context';
import {
  needsBlur, blurCanvasSize, coverSource, FINAL_SIZE,
} from '../../util/photo-fit';
import './style.sass';

// the container color, visible only if the canvas fails
const BASE = '#15181D';

// is a 2D canvas available? (old WebViews, jsdom)
const canvasSupported = () => {
  try {
    return Boolean(document.createElement('canvas').getContext('2d'));
  } catch {
    return false;
  }
};

/**
 * A photo that fills its frame: `cover` when it looks like the frame, otherwise the WHOLE photo (`contain`) over a blurred copy
 * of itself (contract "foto desfocada"): the same `<img>` is drawn once on a canvas of 64 px (cropped cover style), that one is
 * shrunk to a final canvas of 16 px, which CSS stretches over the frame (no `filter`, no second download, no pixel reading,
 * no `crossOrigin`). If the drawing fails, the photo falls back to `cover` over the base color. The wrapper crossfades in (opacity
 * only) once the photo is known; the veil goes above it, in the caller.
 * @param {string} src
 * @param {number} frameRatio width / height of the frame
 * @param {boolean} [small] thumbnails: always blurred + whole
 * @param {string} [radius] border-radius of the layers (thumbnails)
 */
function Photo({
  src, frameRatio, small, radius, onError,
}) {
  const { settings } = useView();
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [natural, setNatural] = useState(null);
  const [failed, setFailed] = useState(false);
  const supported = useMemo(() => canvasSupported(), []);

  const blur = supported && !failed && needsBlur(settings.photoFit, natural, frameRatio, small);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!blur || !canvas || !img || !natural) {
      return;
    }
    try {
      // step 1: the photo cropped like cover into 64 px (in memory); step 2: that one into 16 px, the canvas that is shown
      const big = blurCanvasSize(frameRatio);
      const final = blurCanvasSize(frameRatio, FINAL_SIZE);
      const step = document.createElement('canvas');
      step.width = big.w;
      step.height = big.h;
      const from = coverSource(natural.w, natural.h, big.w, big.h);
      step.getContext('2d').drawImage(img, from.x, from.y, from.w, from.h, 0, 0, big.w, big.h);
      canvas.width = final.w;
      canvas.height = final.h;
      canvas.getContext('2d').drawImage(step, 0, 0, big.w, big.h, 0, 0, final.w, final.h);
    } catch {
      // the drawing failed: back to cover over the base color (a rare, one-time render)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
    }
  }, [blur, natural, frameRatio]);

  const ready = Boolean(natural);
  const fade = settings.animationEnabled ? ' crossfade' : '';
  const style = radius ? { borderRadius: radius } : undefined;

  return (
    <div className={`photo-layers${ready ? ` ready${fade}` : ''}`} style={{ backgroundColor: BASE, ...style }}>
      {blur && <canvas ref={canvasRef} className="blurred" style={style} />}
      <img
        ref={imgRef}
        className={`picture ${blur ? 'contain' : 'cover'}`}
        src={src}
        alt=""
        style={style}
        onLoad={(event) => setNatural({ w: event.target.naturalWidth, h: event.target.naturalHeight })}
        onError={onError}
      />
    </div>
  );
}

export default Photo;
