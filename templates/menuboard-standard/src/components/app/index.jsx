import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';

import backgroundImageFixed from '../../assets/image/raw-meat-with-herbs-and-spices-space.png';

// console.log(U, Loader)

const MIN_LOADING_DURATION = 2000;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Thin',
  'Roboto Light',
  'Roboto Regular',
  'Roboto Medium',
  'Roboto Bold',
  'Roboto Condensed',
  'Oswald',
  'ChalkBoard',
  'VtksChalk',
];

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();
  const logo = useTemplateVal('logo');
  const backgroundImageVal = useTemplateVal('background_image');

  // images to preload
  const images = useMemo(() => [logo], [backgroundImageVal], [backgroundImageFixed]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        fonts={fonts}
        images={images}
        minDuration={MIN_LOADING_DURATION}
        tasks={tasks}
      >
        <div
          className={`app fade-in ${screenFormat}`}
          style={{
            backgroundImage: !backgroundImageVal ? `url(${backgroundImageFixed})` : `url(${backgroundImageVal})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
