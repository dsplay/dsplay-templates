import React, { useState, useEffect, useMemo } from 'react';
import Loader from './components/loader/loader';
import Main from './components/main/main';
import { waitForFonts } from './util/fonts';
import { useScreenInfo } from './util/screen';
import defaultBg from './images/bg.jpg';
import './app.sass';

function App() {
  const [loading, setLoading] = useState(true);
  const { screenFormat } = useScreenInfo();

  const backgroundImage = useMemo(() => {
    let bgImagePath = defaultBg;
    switch(screenFormat) {
      default:
        bgImagePath = defaultBg;
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
