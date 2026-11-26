import { useEffect, useMemo } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  Loader, useConfig, useMedia,
} from '@dsplay/react-template-utils';
import Background from '../background';
import Unavailable from '../unavailable';
import Landscape from '../screen-landscape';
import Portrait from '../screen-portrait';
import Square from '../screen-square';
import Wide from '../screen-wide';
import BarH from '../bar-h';
import BarV from '../bar-v';
import i18n from '../../i18n';
import ViewContext from '../../hooks/view-context';
import useSettings from '../../hooks/use-settings';
import useStage from '../../hooks/use-stage';
import useLogo from '../../hooks/use-logo';
import { parseMedia, conditionOf } from '../../util/weather';
import { backgroundOf } from '../../util/backgrounds';
import './style.sass';
import '../../entrance.css';

// @font-face's are in fonts.sass
const fonts = [{ family: 'Oswald', weight: 400 }, { family: 'Roboto Condensed', weight: 400 }];

const LAYOUTS = {
  landscape: Landscape, portrait: Portrait, square: Square, wide: Wide, 'bar-h': BarH, 'bar-v': BarV,
};

function Screen() {
  const config = useConfig();
  const media = useMedia();
  const { i18n: i18nInstance } = useTranslation();
  const settings = useSettings();
  const stage = useStage();
  const locale = String((config && config.locale) || 'en');
  const [lng] = locale.split('_');

  // In an effect, not while rendering: changing the language re-renders every component that uses useTranslation.
  useEffect(() => {
    i18nInstance.changeLanguage(lng);
  }, [i18nInstance, lng]);

  const logo = useLogo(settings.logoSources);
  const data = useMemo(() => parseMedia(media, new Date()), [media]);
  const view = useMemo(
    () => ({
      theme: settings.theme, stage, settings, remPx: stage.remPx, logo, data, locale,
    }),
    [settings, stage, logo, data, locale],
  );

  const bar = stage.format === 'bar-h' || stage.format === 'bar-v';
  const cond = data ? conditionOf(data.current.code, data.day) : { family: 'clouds' };
  const night = data ? !data.day : true;
  const photo = !bar && settings.backgroundImage
    ? ((stage.format === 'portrait' || stage.format === 'square') && settings.backgroundImagePortrait
      ? settings.backgroundImagePortrait : settings.backgroundImage)
    : '';
  const look = backgroundOf({
    family: data ? cond.family : 'clouds',
    night: data ? night : true,
    mode: settings.theme.mode,
    solid: settings.solidColor,
    base: settings.theme.custom,
  });
  const Layout = LAYOUTS[stage.format] || Landscape;
  const glass = settings.glassEffect === 'auto' && !bar;

  return (
    <ViewContext.Provider value={view}>
      <Loader
        reveal
        fonts={fonts}
        images={photo ? [photo] : []}
      >
        <div
          className={`app format-${stage.format}${glass ? ' glass-on' : ''}${settings.animationEnabled ? ' anim' : ''}`}
          style={{ backgroundColor: look.backgroundColor, color: settings.theme.text }}
        >
          <Background look={look} photo={photo} family={cond.family} night={night} lights={glass && settings.weatherBackground === 'auto'} />
          <div className="stage" style={{ width: `${stage.w}rem`, height: `${stage.h}rem` }}>
            {data ? <Layout /> : <Unavailable />}
          </div>
          {settings.debug && (
            <div className="debug">{`${stage.format} ${stage.remPx.toFixed(2)}px/rem ${Math.round(stage.w)}x${Math.round(stage.h)}rem`}</div>
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
