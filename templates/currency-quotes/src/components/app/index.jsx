import { useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useConfig, useMedia } from '@dsplay/react-template-utils';
import { FONTS } from '@style';
import Main from '../main';
import i18n from '../../i18n';
import { flagUrlsOf } from '../../lib/flags';
import { lngOf, readQuotes } from '../../lib/model';
import './style.sass';

function App() {
  const { locale } = useConfig();
  const lng = lngOf(locale);
  const { result } = useMedia();
  const images = useMemo(() => flagUrlsOf(readQuotes(result)), [result]);

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
        // the style's own fonts; their @font-face's are in the style's fonts.sass
        fonts={FONTS}
        images={images}
      >
        <div className="app fade-in">
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
