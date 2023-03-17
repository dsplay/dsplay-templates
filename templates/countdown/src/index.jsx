import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CountDownContextProvider } from './lib/contexts/countDownContext';
import Router from './Router';
import './style.sass';
import './fonts.sass';

const App = () => (
  <BrowserRouter>
    <CountDownContextProvider>
      <Router />
    </CountDownContextProvider>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));
