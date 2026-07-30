import { createRoot } from 'react-dom/client';
import App from './app';

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

const container = document.getElementById('root');
createRoot(container).render(<App />);
