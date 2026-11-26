import { useEffect, useMemo, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Clock from '../clock';
import Weather from '../weather';
import News from '../news';
import Company from '../company';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useLogo from '../../hooks/use-logo';
import { droppedAt } from '../../util/layout';
import { reliefShadow } from '../../util/theme';
import defaultLogo from '../../assets/image/dsplay-logo-header.svg';
import './style.sass';
import '../../entrance.css';

// @font-face's are in fonts.sass
// every face the template draws, with its weight (both are regular, 400)
const fonts = [
  { family: 'Oswald', weight: 400 },
  { family: 'Roboto Condensed', weight: 400 },
];

// the bundled company logo is on the first frame whenever the operator has none (the company tile reserves its size)
const images = [defaultLogo];

const WIDGETS = {
  clock: Clock, weather: Weather, ticker: News, company: Company,
};

// Set c (portrait, square): clock and weather on the first row; the rolling box and the company logo on the second (as the info bar)
const FIRST_ROW = ['clock', 'weather'];

function Widgets({ names }) {
  return names.map((name) => {
    const Widget = WIDGETS[name];
    return <Widget key={name} />;
  });
}

function Screen() {
  const config = useConfig();
  const { i18n: i18nInstance } = useTranslation();
  const locale = String((config && config.locale) || 'en');
  const settings = useSettings(locale);
  const stage = useStage();
  // how many blocks the rolling box has pushed out: weather, hour, feed circle, company logo (spec M-013 section 3)
  const [dropped, setDropped] = useState(0);
  const [lng] = locale.split('_');

  // In an effect, not while rendering: changing the language re-renders every component that uses useTranslation.
  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  // the logos load on their own (8 s at most) and never hold the Loader
  const company = useLogo(settings.companyLogo, settings.companyLogoUrl);
  const feed = useLogo(settings.rssLogo, settings.rssLogoUrl);
  const view = useMemo(() => ({
    theme: settings.theme, stage, settings, locale, dropped, setDropped, logos: { company, feed },
  }), [settings, stage, locale, dropped, company, feed]);

  const { theme } = settings;
  const surface = { backgroundColor: theme.base };
  const out = stage.set === 'v' ? droppedAt(0, 'v') : droppedAt(dropped, stage.set);
  const order = settings.order
    .filter((name) => !(name === 'company' && (out.company || !settings.showLogo)))
    .filter((name) => !(name === 'weather' && out.weather))
    .filter((name) => !(name === 'clock' && out.clock));

  let content;
  if (stage.set === 'c') {
    content = (
      <>
        <div className="row"><Widgets names={order.filter((n) => FIRST_ROW.indexOf(n) >= 0)} /></div>
        <div className="row"><Widgets names={order.filter((n) => FIRST_ROW.indexOf(n) < 0)} /></div>
      </>
    );
  } else {
    content = <div className="row"><Widgets names={order} /></div>;
  }

  let frame = <div className={`bar ${settings.animationEnabled ? 'fade-in' : ''}`}>{content}</div>;
  if (stage.set === 'p' || stage.set === 'c') {
    const panel = {
      backgroundColor: theme.base,
      boxShadow: reliefShadow(theme, 'elevated2'),
      borderRadius: settings.rounded ? '3rem' : '0.4rem',
      color: theme.text,
    };
    frame = <div className={`panel ${settings.animationEnabled ? 'fade-in' : ''}`} style={panel}>{content}</div>;
  }

  return (
    <ViewContext.Provider value={view}>
      <Loader
        reveal
        fonts={fonts}
        images={images}
      >
        <div className={`app set-${stage.set} pos-${settings.position}`} style={{ ...surface, color: theme.text }}>
          {frame}
          {settings.debug && (
            <div className="debug">{`${stage.set} ${stage.remPx.toFixed(2)}px/rem ${Math.round(stage.w)}x${Math.round(stage.h)}rem`}</div>
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
