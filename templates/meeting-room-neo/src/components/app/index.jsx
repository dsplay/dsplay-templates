import { useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  Loader, useConfig, useMedia,
} from '@dsplay/react-template-utils';
import Screen from '../screen';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useNow from '../../utils/use-now';
import './style.sass';

// @font-face's are in fonts.sass
const fonts = [{ family: 'Roboto', weight: 500 }, { family: 'Roboto', weight: 700 }];

function Root() {
  const config = useConfig();
  const media = useMedia();
  const { i18n: i18nInstance } = useTranslation();
  const locale = String((config && config.locale) || 'en_us');
  const settings = useSettings(locale);
  const stage = useStage();
  const now = useNow();
  const [lng] = locale.toLowerCase().split(/[_-]/);
  const { theme } = settings;

  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  // both logos are the pictures the first frame needs (4 s cap: a broken one never blocks)
  const images = useMemo(() => [settings.eventLogo, settings.hostLogo].filter(Boolean), [settings.eventLogo, settings.hostLogo]);
  const view = useMemo(() => ({
    theme, stage, settings, media, locale, now,
  }), [theme, stage, settings, media, locale, now]);

  return (
    <ViewContext.Provider value={view}>
      <Loader reveal fonts={fonts} images={images}>
        <div className={`app set-${stage.set}`} style={{ backgroundColor: theme.base, color: theme.text }}>
          <div className="stage" style={{ width: `${stage.w}rem`, height: `${stage.h}rem` }}>
            <Screen />
          </div>
        </div>
      </Loader>
    </ViewContext.Provider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Root />
    </I18nextProvider>
  );
}

export default App;
