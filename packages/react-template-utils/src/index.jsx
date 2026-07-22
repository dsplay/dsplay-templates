import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './sample-app/components/Main';
import { Loader } from './lib';
import './index.sass';
import './fonts.sass';

const minLoadingTime = 2000;
const fontsToLoad = ['Oswald', 'Roboto Condensed'];
const imagesToLoad = ['../test-assets/dsplay-logo.png'];
const promisesToResolve = [Promise.resolve(1)];

function App() {
  return (
    <Loader
      fonts={fontsToLoad}
      images={imagesToLoad}
      minDuration={minLoadingTime}
      tasks={promisesToResolve}
    >
      <div>
        <h1>DSPLAY Template</h1>
        <Main />
      </div>
    </Loader>
  );
}

createRoot(document.getElementById('root')).render(<App />);
