import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  Loader, useScreenInfo, useConfig, useTemplateVal, useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import Main from '../main';
import i18n from '../../i18n';
import useRemScale from '../../hooks/use-rem-scale';
import { getLayout, getDesignScreen } from '../../utils/layout';
import { DEFAULT_PLATE, inkFor, normalizeColor } from '../../utils/color';
import './style.sass';

// fonts to preload; the @font-face is in fonts.sass
const fonts = [{ family: 'Oswald', weight: 700 }];

function App() {
  const { w, h, screenFormat } = useScreenInfo();
  const { locale } = useConfig();

  const layout = getLayout(screenFormat, w, h);
  const remPx = useRemScale(getDesignScreen(layout));

  // The background is the flat plate. background_image / background_color / overlay variables are NOT read here (spec section 6).
  const plate = normalizeColor(useTemplateVal('color_primary', DEFAULT_PLATE));
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const ink = inkFor(plate);

  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader reveal fonts={fonts} images={[]}>
        <div className={`app ${layout}${animationEnabled ? '' : ' no-animation'}`}>
          <Main layout={layout} plate={plate} ink={ink} remPx={remPx} />
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
