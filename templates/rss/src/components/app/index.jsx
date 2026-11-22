import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  useTemplateVal,
  useTemplateBoolVal,
  useScreenInfo,
  useConfig,
  Loader,
} from '@dsplay/react-template-utils';

import NewsItem from '../news-item';
import { DEFAULT_BG_COLOR } from '../../util/defaults';
import i18n from '../../i18n';
import Debugger from '../debugger';
import './style.sass';
import '../../entrance.css';

const fonts = [
  'Roboto Condensed',
  'Oswald',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  // template properties
  const backgroundColor = useTemplateVal('bg_color', DEFAULT_BG_COLOR);
  const debug = useTemplateBoolVal('debug');

  // component properties
  const style = {
    backgroundColor,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
      >
        <div className={`app ${screenFormat}`} style={style}>
          <NewsItem />
          {debug && <Debugger />}
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
