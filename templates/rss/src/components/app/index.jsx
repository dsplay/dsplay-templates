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
import useLogo from '../../util/use-logo';
import useRssItem from '../../util/use-rss-item';
import { DEFAULT_BG_COLOR } from '../../util/defaults';
import i18n from '../../i18n';
import Debugger from '../debugger';
import './style.sass';
import '../../styles/motion.sass';

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

  // the pictures the first frame needs: the Loader waits for them before it reveals the template
  const { src: logo } = useLogo();
  const { hasImage, imageUrl } = useRssItem();
  const images = [logo, hasImage && imageUrl].filter(Boolean);

  // component properties
  const style = {
    backgroundColor,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
        images={images}
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
