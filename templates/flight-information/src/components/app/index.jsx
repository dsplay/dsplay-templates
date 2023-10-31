import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo } from '@dsplay/react-template-utils';
import Main from '../main';
import Intro from '../intro';
import i18n from '../../i18n';
import './style.sass';
import ThemeContextParent from '../../contexts/themeContext';
import { useFlightsInfoPromise } from '../../hooks/use-flights-info';

const MIN_LOADING_DURATION = 2800;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Condensed',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const now = new Date();
  const firstLoad = useFlightsInfoPromise(now);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContextParent>
        <Loader
          placeholder={<Intro />}
          fonts={fonts}
          minDuration={MIN_LOADING_DURATION}
          tasks={[firstLoad]}
        >
          <div className={`app fade-in ${screenFormat}`}>
            <Main startTime={now} />
          </div>
        </Loader>
      </ThemeContextParent>
    </I18nextProvider>
  );
}

export default App;
