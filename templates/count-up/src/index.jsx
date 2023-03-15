import React from 'react';
import { render } from 'react-dom';
import './index.sass';
import './fonts.sass';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import { CountUpContextProvider } from './lib/contexts/countUpContext';

const App = () => (
  <BrowserRouter>
    <CountUpContextProvider>
      <Router />
    </CountUpContextProvider>
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));
