import { useEffect, useMemo, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Now from '../now';
import Forecast from '../forecast';
import Details from '../details';
import Bar from '../bar';
import VBar from '../vbar';
import Unavailable from '../unavailable';
import Badge from '../badge';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useClock from '../../hooks/use-clock';
import useLogo from '../../hooks/use-logo';
import useWeather from '../../hooks/use-weather';
import { tintOf } from '../../util/surface';
import { withBase } from '../../util/theme';
import './style.sass';
import '../../entrance.css';

// @font-face's are in fonts.sass
const fonts = [{ family: 'Oswald', weight: 400 }, { family: 'Roboto Condensed', weight: 400 }];

function Screen() {
  const config = useConfig();
  const { i18n: i18nInstance } = useTranslation();
  const locale = String((config && config.locale) || 'en');
  const settings = useSettings();
  const stage = useStage();
  const now = useClock(true);
  const weather = useWeather(now);
  const company = useLogo(settings.companyLogo, settings.companyLogoUrl);
  const [lng] = locale.split('_');

  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  // The surface: the tint of the weather family (auto), or the plain base color (solid / custom / unavailable)
  const preset = settings.theme;
  const theme = useMemo(() => {
    if (settings.solid || !weather.ok) {
      return preset;
    }
    const mode = settings.mode === 'dark' ? 'dark' : 'light';
    return withBase(preset, tintOf(weather.condition.family, mode, weather.day));
  }, [settings.solid, settings.mode, preset, weather]);

  // crossfade of the base color when the family changes (opacity only; the relief is recalculated at once)
  const [seen, setSeen] = useState({ base: theme.base, from: '' });
  if (seen.base !== theme.base) {
    setSeen({ base: theme.base, from: seen.base });
  }
  const fadeFrom = seen.from;

  const view = useMemo(() => ({
    theme, stage, settings, locale, weather, logos: { company },
  }), [theme, stage, settings, locale, weather, company]);

  const { set } = stage;
  let content;
  if (!weather.ok) {
    content = <Unavailable />;
  } else if (set === 'a' || set === 'b') {
    content = <Bar />;
  } else if (set === 'v') {
    content = <VBar />;
  } else {
    content = (
      <>
        <Now />
        {set === 'port' && settings.showDetails && <div className="details-row"><Details variant="wells" /></div>}
        <Forecast />
        <Badge />
      </>
    );
  }

  return (
    <ViewContext.Provider value={view}>
      <Loader
        reveal
        fonts={fonts}
      >
        <div className={`app set-${set}${settings.animationEnabled ? ' animated' : ''}`} style={{ backgroundColor: theme.base, color: theme.text }}>
          {fadeFrom && settings.animationEnabled && (
            <div className="veil" key={fadeFrom + theme.base} style={{ backgroundColor: fadeFrom }} />
          )}
          <div
            className="stage"
            style={{ width: `${stage.w}rem`, height: `${stage.h}rem` }}
          >
            {content}
          </div>
          {settings.debug && (
            <div className="debug">{`${set} ${stage.remPx.toFixed(2)}px/rem ${weather.ok ? weather.condition.family : 'n/a'}`}</div>
          )}
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
