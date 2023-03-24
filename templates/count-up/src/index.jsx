import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CountUpContextProvider } from './lib/contexts/countUpContext';
import Router from './Router';
import './style.sass';
import './fonts.sass';

const App = () => (
  <BrowserRouter>
    <CountUpContextProvider>
      <Router />
    </CountUpContextProvider>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));
