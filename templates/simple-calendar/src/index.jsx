import React from 'react';
import { render } from 'react-dom';
import './index.sass';
import './fonts.sass';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';

const App = () => (
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);

render(<App />, document.getElementById('root'));
