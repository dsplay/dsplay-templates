import React, { useMemo } from 'react';
import { Loader, useMedia, useScreenInfo, useTemplateVal, screen } from '@dsplay/react-template-utils';
import Intro from './components/intro/intro';
import Main from './components/main/main';
import defaultBg from './images/bg.png';
import './app.sass';

const MIN_LOADING_DURATION = 2500;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  // 'Roboto Thin',
  // 'Roboto Light',
  // 'Roboto Regular',
  // 'Roboto Medium',
  // 'Roboto Bold',
  'Roboto Condensed',
  'Oswald',
];

function App() {
  const { screenFormat } = useScreenInfo();

  const horizontalBackground = useTemplateVal('bg_horizontal', defaultBg);
  const verticalBackground = useTemplateVal('bg_vertical', horizontalBackground);

  const backgroundImage = useMemo(() => {
    let bgImagePath;
    switch (screenFormat) {
      case screen.PORTRAIT:
      case screen.V_BANNER:
        bgImagePath = verticalBackground;
        break;
      default:
        bgImagePath = horizontalBackground;
        break;
    }

    return bgImagePath;
  }, [screenFormat, horizontalBackground, verticalBackground]);

  const {
    result: {
      data: {
        user: {
          pic: profilePicture,
        } = {},
        posts = [],
      } = {},
    } = {},
  } = useMedia();

  const result = posts.map(({
    media = [],
  }) => media.map(({ urls: { lg } }) => lg));

  let allMediaImages = [];
  result.forEach((mediaImages) => {
    allMediaImages = allMediaImages.concat(mediaImages);
  });
  allMediaImages = [...new Set(allMediaImages)];
  console.log(result);
  console.log(allMediaImages);

  // images to preload
  const images = [
    backgroundImage,
    profilePicture,
    ...allMediaImages,
  ];

  const appStyle = {
    backgroundImage: `url('${backgroundImage}')`,
  };

  return (
    <Loader
      placeholder={<Intro />}
      minDuration={MIN_LOADING_DURATION}
      fonts={fonts}
      images={images}
    >
      <div
        className={`app fade-in ${screenFormat}`}
        style={appStyle}
      >
        <Main />
      </div>
    </Loader>
  )
}

export default App;
