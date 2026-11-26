import { useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import WeatherView from '../weather-view';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useLogo from '../../hooks/use-logo';
import useWeather from '../../hooks/use-weather';
import './style.sass';
import '../../entrance.css';

// @font-face's are in fonts.sass
// both faces are drawn at weight 400 only; no pictures to wait for (the icons are inline SVG, the logo never blocks)
const fonts = [
  { family: 'Oswald', weight: 400 },
  { family: 'Roboto Condensed', weight: 400 },
];

function Screen() {
  const config = useConfig();
  const { i18n: i18nInstance } = useTranslation();
  const settings = useSettings();
  const stage = useStage();
  const weather = useWeather();
  // the logo is resolved by useLogo (8 s timeout, never blocks the screen), so the Loader does not wait for it
  const logo = useLogo(settings.logoSources);
  const [lng] = String((config && config.locale) || 'en').split('_');

  // In an effect, not while rendering: changing the language re-renders every component that uses useTranslation.
  useEffect(() => {
    i18nInstance.changeLanguage(lng.toLowerCase());
  }, [i18nInstance, lng]);

  const view = useMemo(
    () => ({
      theme: settings.theme, stage, settings, remPx: stage.remPx, logo, weather,
    }),
    [settings, stage, logo, weather],
  );
  const surface = { backgroundColor: settings.theme.base };

  return (
    <ViewContext.Provider value={view}>
      <Loader
        reveal
        fonts={fonts}
        images={[]}
      >
        <div className={`app format-${stage.format}`} style={{ ...surface, color: settings.theme.text }}>
          <WeatherView />
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
