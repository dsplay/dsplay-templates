import { I18nextProvider } from 'react-i18next';
import { Loader, useTemplateVal, useScreenInfo, useConfig } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';

const MIN_LOADING_DURATION = 2000;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Condensed',
  'Oswald',
];

function App() {
  const bg = useTemplateVal('background');
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();

  // images to preload
  const images = [bg];

  const [lng] = (locale || 'en').split('_');
  i18n.changeLanguage(lng);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        fonts={fonts}
        images={images}
        minDuration={MIN_LOADING_DURATION}
      >
        <div className={`app fade-in ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
