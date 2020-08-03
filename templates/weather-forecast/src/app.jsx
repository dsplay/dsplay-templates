import React from 'react';
import { Loader, useScreenInfo } from '@dsplay/react-template-utils';
import Intro from './components/intro/intro';
import Main from './components/main/main';
import { iconImages } from './components/icon/icon';
import './app.sass';

const MIN_LOADING_DURATION = 2500;

// images to preload
const images = iconImages;

// fonts to preload
// @font-face's must be defined in fonts.sass or other in-use style file
const fonts = [
  'Roboto Condensed',
  'Roboto Regular',
  'Roboto 300',
  'Roboto 400',
  'Roboto 500',
  'Roboto 700',
  'Oswald',
];

// other tasks (Promises) to run during template intro
const tasks = [];

function App() {
  const { screenFormat } = useScreenInfo();

  return (
    <Loader
      placeholder={<Intro />}
      minLoadingTime={MIN_LOADING_DURATION}
      fontFamilies={fonts}
      tasks={tasks}
      images={images}
    >
      <div className={`app fade-in ${screenFormat}`}>
        <Main />
      </div>
    </Loader>
  );
}

export default App;
