import React, { useState } from 'react';
import useFitText from 'use-fit-text';

const FitText = ({
  children,
  style = {},
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
    ...style,
    fontSize,
  };

  return (
    <div
      ref={ref}
      style={finalStyle}
      className={ready ? 'fade-in' : ''}
    >
      {/* <p> */}
      {children}
      {/* </p> */}
    </div>
  );
};

export default FitText;
