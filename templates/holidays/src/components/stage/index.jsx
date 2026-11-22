import { useLayoutEffect } from 'react';
import { useScreenInfo } from '@dsplay/react-template-utils';
import { rem, scaleOf } from '../../lib/layout';
import usePlate from './use-plate';
import './style.sass';

/**
 * Sets the root font size to `scale * 10` px. It is a component of its own, placed before the plate, because React runs the layout effects in tree order: this one
 * runs before the ones of the texts inside the plate, which measure themselves (see FittedText) in this very font size. Before the first paint, so that the plate
 * never shows at the wrong size; restored if the stage goes away.
 */
function RootScale({ scale }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.style.fontSize;
    root.style.fontSize = `${scale * 10}px`;
    return () => { root.style.fontSize = previous; };
  }, [scale]);
  return null;
}


/**
 * The full screen of a style: it fills the screen with the style's background (the `className` paints it) and centers the plate, a box of fixed design size
 * (see lib/layout.js). The root font size is 10 real pixels per unit of scale, so that a style writes its sizes in design pixels (`u(96)` in sass, 9.6rem).
 */
function Stage({ className = '', children }) {
  const { w, h } = useScreenInfo();
  const plate = usePlate();
  const scale = scaleOf(plate, w, h);

  return (
    <div className={`stage stage--${plate.kind} ${className}`}>
      <RootScale scale={scale} />
      <div className="stage__plate" style={{ width: rem(plate.w), height: rem(plate.h) }}>
        {children}
      </div>
    </div>
  );
}

export default Stage;
