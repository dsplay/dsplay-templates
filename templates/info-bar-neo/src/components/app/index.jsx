import { useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Loader, useConfig } from '@dsplay/react-template-utils';
import Clock from '../clock';
import Weather from '../weather';
import Quotes from '../quotes';
import News from '../news';
import Company from '../company';
import Row from '../row';
import useLogo from '../../hooks/use-logo';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import { reliefShadow } from '../../util/theme';
import './style.sass';
import '../../entrance.css';

// @font-face's are in fonts.sass
const fonts = [{ family: 'Oswald', weight: 400 }, { family: 'Roboto Condensed', weight: 400 }];

const WIDGETS = {
  clock: Clock, weather: Weather, quotes: Quotes, news: News, company: Company,
};

// Set c: clock, weather and quotes on the first row; news and sponsor on the second (spec 2.3)
const FIRST_ROW = ['clock', 'weather', 'quotes'];

const row = (names) => (
  <Row names={names} widgets={(drop) => names.map((name) => {
    const Widget = WIDGETS[name];
    return <Widget key={name} drop={drop} />;
  })}
  />
);

function Screen() {
  const config = useConfig();
  const { i18n: i18nInstance } = useTranslation();
  const locale = String((config && config.locale) || 'en');
  const settings = useSettings(locale);
  const stage = useStage();
  const [lng] = locale.split('_');

  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  // the logos load on their own (8 s at most) and never hold the Loader
  const company = useLogo(settings.companyLogo, settings.companyLogoUrl);
  const feed = useLogo(settings.rssLogo, settings.rssLogoUrl);
  const view = useMemo(() => ({
    theme: settings.theme, stage, settings, locale, logos: { company, feed },
  }), [settings, stage, locale, company, feed]);

  const { theme } = settings;
  const surface = { backgroundColor: theme.base };
  const order = settings.order
    .filter((name) => (stage.set === 'v' ? name !== 'news' : true))
    .filter((name) => (name !== 'company' || settings.showLogo));

  let content;
  if (stage.set === 'c') {
    content = (
      <>
        {row(order.filter((n) => FIRST_ROW.indexOf(n) >= 0))}
        {row(order.filter((n) => FIRST_ROW.indexOf(n) < 0))}
      </>
    );
  } else {
    content = row(order);
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
