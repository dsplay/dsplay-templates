import React, { useMemo } from 'react';
import './loader.sass';
import spinner from '../../images/loader.gif';
import {
  LANDSCAPE,
  PORTRAIT,
  SQUARED,
  BANNER_H,
  BANNER_V,
} from '../../util/screen';
import { useScreenInfo } from '../../hooks/use-screen-info';

// component

const Loader = (props) => {
  const { w, h, screenFormat } = useScreenInfo();

  const spinnerDimension = useMemo(() => {
    console.log('[re]calculating spinner dimension...');
    let dimension = Math.min(w, h) / 2;

    switch (screenFormat) {
      case LANDSCAPE:
        break;
      case PORTRAIT:
        break;
      case SQUARED:
        break;
      case BANNER_H:
      case BANNER_V:
        dimension = Math.min(w, h) / 2;
        break;
      default:
        break;
    }

    return dimension;
  }, [w, h, screenFormat]);

  const imageStyle = {
    width: `${spinnerDimension}px`,
    height: `${spinnerDimension}px`,
  };

  return (
    <div {...props} className={`loader ${props.className || ''}`}>
      <div>
        <img src={spinner} alt="" style={imageStyle} />
      </div>
      <div className="hidden">
        {/* put your fonts here */}
        <div style={{ fontFamily: 'Oswald' }}>-</div>
        <div style={{ fontFamily: 'Roboto Condensed' }}>-</div>
        <div style={{ fontFamily: 'Roboto Regular' }}>-</div>
        <div style={{ fontFamily: 'Roboto 300' }}>-</div>
        <div style={{ fontFamily: 'Roboto 400' }}>-</div>
        <div style={{ fontFamily: 'Roboto 500' }}>-</div>
        <div style={{ fontFamily: 'Roboto 700' }}>-</div>
      </div>
    </div>
  );
};

export default Loader;
