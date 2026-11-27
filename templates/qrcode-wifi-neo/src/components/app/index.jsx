import { useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Card from '../card';
import BarH from '../bar-h';
import BarV from '../bar-v';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useLogo from '../../hooks/use-logo';
import useWifiNetwork from '../../utils/use-wifi-network';
import './style.sass';

// @font-face's are in fonts.sass
const fonts = [{ family: 'Roboto', weight: 400 }, { family: 'Roboto', weight: 700 }];

function Screen() {
  const config = useConfig();
  const { i18n: i18nInstance } = useTranslation();
  const locale = String((config && config.locale) || 'en');
  const settings = useSettings();
  const stage = useStage();
  const wifi = useWifiNetwork();
  const company = useLogo(settings.companyLogo, settings.companyLogoUrl);
  const [lng] = locale.split('_');
  const { theme } = settings;
  // the company logo is resolved by useLogo (8 s timeout, never blocks); no picture is needed for the first frame
  const images = useMemo(() => [], []);

  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  const view = useMemo(() => ({
    theme, stage, settings, wifi, logos: { company },
  }), [theme, stage, settings, wifi, company]);

  let content;
  if (stage.set === 'h') {
    content = <BarH />;
  } else if (stage.set === 'v') {
    content = <BarV />;
  } else {
    content = <Card />;
  }

  return (
    <ViewContext.Provider value={view}>
      <Loader reveal fonts={fonts} images={images}>
        <div className={`app set-${stage.set}`} style={{ backgroundColor: theme.base, color: theme.text }}>
          <div className="stage" style={{ width: `${stage.w}rem`, height: `${stage.h}rem` }}>
            {content}
          </div>
          {settings.debug && <div className="debug">{`${stage.set} ${stage.remPx.toFixed(2)}px/rem`}</div>}
        </div>
      </Loader>
    </ViewContext.Provider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Screen />
    </I18nextProvider>
  );
}

export default App;
