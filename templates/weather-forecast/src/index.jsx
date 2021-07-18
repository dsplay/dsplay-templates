import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
// import registerServiceWorker from './registerServiceWorker';
import 'moment-timezone';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/it';
import 'moment/locale/de';
import 'moment/locale/nl';
import 'moment/locale/pt';
import 'moment/locale/pt-br';
import './index.sass';
import './fonts.sass';

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
