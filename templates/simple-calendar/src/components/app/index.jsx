import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import '../../entrance.css';

const fonts = [
  'Roboto Condensed',
];

function App() {
  const { locale } = useConfig();

  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="container-home">
        <Loader
          reveal
          fonts={fonts}
        >
          <Main />
        </Loader>
      </div>
    </I18nextProvider>
  );
}

export default App;
