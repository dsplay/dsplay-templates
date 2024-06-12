import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useScreenInfo, useTemplateVal } from '@dsplay/react-template-utils';
import Intro from '../intro';
import Main from '../main';
import i18n from '../../i18n';
import './style.sass';
import woodBackground from '../../assets/image/josephine-bredehoft-unsplash.gif';

// console.log(U, Loader)

const MIN_LOADING_DURATION = 3000;

// fonts to preload
// @font-face's must be defined in fonts.sass or another in-use style file
const fonts = [
  'Roboto Thin',
  'Roboto Light',
  'Roboto Regular',
  'Roboto Medium',
  'Roboto Bold',
  'Roboto Condensed',
  'Oswald',
  'Chalkboard',
  'Vtkschalk',
];

// other tasks (Promises) to run during template intro
const tasks = [
  Promise.resolve('my promise result'),
];

function App() {
  const { screenFormat } = useScreenInfo();
  const logo = useTemplateVal('logo');
  const logoBanner = useTemplateVal('logo_banner');
  const backgroundBlackboard = useTemplateVal('background_blackboard');
  const promoImage01 = useTemplateVal('promo_img_01');
  const promoImage02 = useTemplateVal('promo_img_02');
  const promoImage03 = useTemplateVal('promo_img_03');

  // images to preload
  const images = useMemo(() => [logo],
    [woodBackground], [backgroundBlackboard], [logoBanner], [promoImage01],
    [promoImage02], [promoImage03]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        placeholder={<Intro />}
        fonts={fonts}
        images={images}
        minDuration={MIN_LOADING_DURATION}
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
