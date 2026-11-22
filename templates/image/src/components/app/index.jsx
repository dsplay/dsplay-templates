import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  Loader, useScreenInfo, useMedia, useConfig,
} from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';

// other tasks (Promises) to run during template intro
const tasks = [];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();
  const media = useMedia();

  const [lng] = (locale || 'en').split('_');

  // In an effect, not in the render body: changing the language updates every component that uses
  // useTranslation, and doing that while rendering loops ("Maximum update depth exceeded").
  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  // images to preload
  const images = [media.imagePath];

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        images={images}
        tasks={tasks}
      >
        <div className={`app fade-in ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
