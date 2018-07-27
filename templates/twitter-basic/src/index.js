import 'core-js/fn/set';
import 'core-js/fn/map';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './font/flaticon.css';
import './font/google/fonts.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
