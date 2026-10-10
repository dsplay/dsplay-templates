import React, { useState } from 'react';
import useFitText from 'use-fit-text';

const DEFAULT_READY_CLASS = 'dsplay-fit-text-ready';

/**
 * Renders its children scaled to fill the available space with the largest possible font size.
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to fit
 * @param {React.CSSProperties} [props.style] - Extra styles merged into the wrapper
 * @param {string} [props.className] - Extra class applied to the wrapper
 * @param {string} [props.readyClassName] - Class added to the wrapper once the fitted font size has been calculated
 * @returns {React.ReactElement}
 */
function FitText({
  children,
  style = {},
  className = '',
  readyClassName = DEFAULT_READY_CLASS,
}) {
  const [ready, setReady] = useState(false);
  const { fontSize, ref } = useFitText({ maxFontSize: 10000, onFinish: () => setReady(true) });

  const finalStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    visibility: ready ? 'visible' : 'hidden',
    className,
    ...style,
    fontSize,
  };

  return (
    <div
      ref={ref}
      className={`${className} ${ready ? readyClassName : ''}`}
      style={finalStyle}
    >
      {children}
    </div>
  );
}

export default FitText;
