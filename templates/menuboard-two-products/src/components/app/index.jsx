import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import '../../entrance.css';

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Oswald',
  'Roboto Condensed',
];

function App() {
  const { screenFormat } = useScreenInfo();
  const theme = useTemplateVal('theme');
  const promoImage1 = useTemplateVal('promo_img_01');
  const promoImage2 = useTemplateVal('promo_img_02');

  // images to preload: the two promotional pictures the first frame draws
  const images = useMemo(() => [promoImage1, promoImage2].filter(Boolean), [promoImage1, promoImage2]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader reveal fonts={fonts} images={images}>
        <div className={`app ${theme === 'light' ? 'light' : 'dark'} ${screenFormat}`}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
