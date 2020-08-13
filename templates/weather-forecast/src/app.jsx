import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo } from '@dsplay/react-template-utils';
import Intro from './components/intro/intro';
import Main from './components/main/main';
import i18n from './i18n';
import { iconImages } from './components/icon/icon';
import './app.sass';

const MIN_LOADING_DURATION = 2500;

// images to preload
const images = iconImages;

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
];

function App() {
  const { screenFormat } = useScreenInfo();

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        minDuration={MIN_LOADING_DURATION}
        fonts={fonts}
        images={images}
      >
        <div className={`app fade-in ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
