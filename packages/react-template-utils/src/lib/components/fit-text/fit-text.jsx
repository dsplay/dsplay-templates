import React, { useState } from 'react';
import useFitText from 'use-fit-text';

const DEFAULT_READY_CLASS = 'dsplay-fit-text-ready';

const FitText = ({
  children,
  style = {},
  className = '',
  readyClassName = DEFAULT_READY_CLASS,
}) => {
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
};

export default FitText;
