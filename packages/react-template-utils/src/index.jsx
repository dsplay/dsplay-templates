import React from 'react';
import { render } from "react-dom";
import Main from './sample-app/components/Main';
import {
  Loader, // boolean flag to indicate screen orientation

} from './lib';
import './index.sass';
import './fonts.sass';

const minLoadingTime = 2000;
const fontsToLoad = ['Oswald', 'Roboto Condensed'];
const imagesToLoad = ['../test-assets/dsplay-logo.png'];
const promisesToResolve = [];

const App = () => (
  <Loader
    fontFamilies={fontsToLoad}
    images={imagesToLoad}
    minLoadingTime={minLoadingTime}
    tasks={promisesToResolve}
  >
    <div>
      <h1>DSPLAY Template</h1>
      <Main />
    </div>
  </Loader>
);

render(<App />, document.getElementById("root"));
