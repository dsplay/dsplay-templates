import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useConfig, useScreenInfo } from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Light',
  'Roboto Regular',
  'Roboto Medium',
  'Oswald',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();

  const [lng] = (locale || 'en').split('_');

  // In an effect, not in the render body: changing the language updates every component that uses
  // useTranslation, and doing that while rendering loops ("Maximum update depth exceeded"). Here, not in
  // Main, so the loader is in the right language too.
  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
        images={[]}
      >
        <div className={`app fade-in ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
