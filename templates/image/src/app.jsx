import React from 'react';
import { Loader, useScreenInfo, useMedia } from '@dsplay/react-template-utils';
import Intro from './components/intro/intro';
import Main from './components/main/main';
import './app.sass';

// console.log(U, Loader)

const MIN_LOADING_DURATION = 0;
const showLoader = false;

// other tasks (Promises) to run during template intro
const tasks = [];

function App() {
  const { screenFormat } = useScreenInfo();
  const media = useMedia();

  // images to preload
  const images = [media.imagePath];

  return (
    <Loader
      placeholder={showLoader ? <Intro /> : null}
      images={images}
      minDuration={MIN_LOADING_DURATION}
      tasks={tasks}
    >
      <div className={`app fade-in ${screenFormat}`}>
        <Main />
      </div>
    </Loader>
  );
}

export default App;
