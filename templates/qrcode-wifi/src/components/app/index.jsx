import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useConfig } from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import '../../entrance.css';
import background from '../../images/default-bg-01.jpg';

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Light',
];

// other tasks (Promises) to run during template intro
const tasks = [];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();

  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
        tasks={tasks}
      >
        <div className={`app fade-in ${screenFormat}`} style={{ backgroundImage: `url("${background}")` }}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
