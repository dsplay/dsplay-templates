import { useEffect, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  Loader, useScreenInfo, useTemplateVal, useConfig,
} from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import woodBackground from '../../assets/image/josephine-bredehoft-unsplash.gif';

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Chalkboard',
  'Vtkschalk',
];

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();
  const { locale } = useConfig();
  const logo = useTemplateVal('logo');
  const logoBanner = useTemplateVal('logo_banner');
  const promoImage01 = useTemplateVal('promo_img_01');
  const promoImage02 = useTemplateVal('promo_img_02');
  const promoImage03 = useTemplateVal('promo_img_03');

  // images to preload
  const images = useMemo(
    () => [woodBackground, logo, logoBanner, promoImage01, promoImage02, promoImage03],
    [logo, logoBanner, promoImage01, promoImage02, promoImage03],
  );

  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
        fonts={fonts}
        images={images}
        tasks={tasks}
      >
        <div className={`app fade-in ${screenFormat}`} style={{ backgroundImage: `url(${woodBackground})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
          <Main />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
