import React from 'react';
import { render } from 'react-dom';
import './index.sass';
import './fonts.sass';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { CountDownContextProvider } from './lib/contexts/countDownContext';

const App = () => (
  <BrowserRouter>
    <CountDownContextProvider>
      <Router />
    </CountDownContextProvider>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));
