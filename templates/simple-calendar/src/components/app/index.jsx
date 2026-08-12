import { I18nextProvider } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Main from '../main';
import LoaderCalendar from '../loader-calendar';
import i18n from '../../i18n';
import './style.sass';

const MIN_LOADING_DURATION = 2000;

const fonts = [
  'Roboto Condensed',
];

function App() {
  const { locale } = useConfig();

  const [lng] = (locale || 'en').split('_');
  i18n.changeLanguage(lng);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="container-home">
        <Loader
          placeholder={<LoaderCalendar />}
          minDuration={MIN_LOADING_DURATION}
          fonts={fonts}
        >
          <Main />
        </Loader>
      </div>
    </I18nextProvider>
  );
}

export default App;
