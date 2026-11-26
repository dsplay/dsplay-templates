import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useView } from '../../hooks/view-context';
import {
  needsBlur, blurCanvasSize, coverSource, FINAL_SIZE,
} from '../../util/photo-fit';
import './style.sass';

// is a 2D canvas available? (old WebViews, jsdom)
const canvasSupported = () => {
  try {
    return Boolean(document.createElement('canvas').getContext('2d'));
  } catch {
    return false;
  }
};

/**
 * A photo frame in rem (any window proportion: no side band). `cover` (object-position 50% 30%) when the photo looks like the frame,
 * otherwise the WHOLE photo (`contain`) over a blurred copy of itself (contract of the blurred photo, same as the RSS v2): the `<img>`
 * is drawn on a canvas of 64 px (cropped cover style), shrunk to 16 px, which CSS stretches over the frame (no `filter`, no
 * second download, no pixel reading, no `crossOrigin`). `auto` decides by the crop `cover` would need: tall frames up to 35%, wide
 * frames (>= 1.2) for horizontal photos up to 55%. If the canvas fails: the whole photo over a flat color (the frame is small).
 * `photo` comes from `useFirstImage`: while it loads the box stays reserved; with none, nothing is drawn.
 */
function Photo({ photo, style, radius }) {
  const { theme, settings } = useView();
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [natural, setNatural] = useState(null);
  const [failed, setFailed] = useState(false);
  const supported = useMemo(() => canvasSupported(), []);
  const frameRatio = parseFloat(style.width) / parseFloat(style.height);

  const wantsBlur = needsBlur(settings.photoFit, natural, frameRatio, false);
  const blur = supported && !failed && wantsBlur;

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
      // the drawing failed: the whole photo over a flat color
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
    }
  }, [blur, natural, frameRatio]);

  if (photo.status === 'none') {
    return null;
  }
  const corner = `${radius !== undefined ? radius : (settings.rounded ? 2 : 0.4)}rem`;
  const round = { borderRadius: corner };
  // the flat color behind a whole photo when the blur is not available (spec: rgba(21,22,24,.18) light, rgba(255,255,255,.10) dark)
  const flat = theme.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(21,22,24,0.18)';
  const ready = photo.status === 'ok' && Boolean(natural);
  const fade = settings.animationEnabled ? ' crossfade' : '';
  const whole = wantsBlur;

  return (
    <div className="photo" style={{ ...style, ...round, backgroundColor: whole && !blur ? flat : theme.base }}>
      {photo.status === 'ok' && (
        <div className={`photo-layers${ready ? ` ready${fade}` : ''}`} style={round}>
          {blur && <canvas ref={canvasRef} className="blurred" style={round} />}
          <img
            key={photo.src}
            ref={imgRef}
            className={`picture ${whole ? 'contain' : 'cover'}`}
            src={photo.src}
            alt=""
            style={round}
            onLoad={(event) => setNatural({ w: event.target.naturalWidth, h: event.target.naturalHeight })}
          />
        </div>
      )}
    </div>
  );
}

export default Photo;
