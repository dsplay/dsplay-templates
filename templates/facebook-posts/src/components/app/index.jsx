import { useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  Loader, useConfig, useMedia, useScreenInfo, useTemplateVal, screen,
} from '@dsplay/react-template-utils';
import Main from '../main';
import defaultBg from '../../images/bg.png';
import i18n from '../../i18n';
import './style.sass';

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Regular',
  'Oswald',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

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
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
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
    </I18nextProvider>
  );
}

export default App;
