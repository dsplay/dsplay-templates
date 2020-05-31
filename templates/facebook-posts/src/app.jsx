import React, { useState, useEffect, useMemo } from 'react';
import {
  tval, // custom template boolean value
} from '@dsplay/template-utils';
import Loader from './components/loader/loader';
import Main from './components/main/main';
import { waitForFonts } from './util/fonts';
import { useScreenInfo, PORTRAIT, BANNER_V } from './util/screen';
import defaultBg from './images/bg.png';
import './app.sass';

// one time template config
const horizontalBackground = tval('bg_horizontal', defaultBg);
const verticalBackground = tval('bg_vertical', horizontalBackground);

function App() {
  const [loading, setLoading] = useState(true);
  const { screenFormat } = useScreenInfo();

  const backgroundImage = useMemo(() => {
    let bgImagePath;
    switch (screenFormat) {
      case PORTRAIT:
      case BANNER_V:
        bgImagePath = verticalBackground;
        break;
      default:
        bgImagePath = horizontalBackground;
        break;
    }

    return bgImagePath;
  }, [screenFormat]);

  useEffect(() => {
    if (loading) {
      (async () => {
        await waitForFonts();
        setLoading(false);
      })();
    }
  }, [loading]);

  if (loading) {
    return (<Loader />);
  }

  const appStyle = {
    backgroundImage: `url('${backgroundImage}')`,
  };

  return (
    <div
      className={`app fade-in ${screenFormat}`}
      style={appStyle}
    >
      <Main />
    </div>
  )
}

export default App;
