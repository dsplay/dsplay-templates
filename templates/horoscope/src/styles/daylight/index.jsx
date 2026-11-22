import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Meter from '../../components/meter';
import FittedText from '../../components/fitted-text';
import { fitLine, isBanner, rem } from '../../lib/layout';
import { DISCLAIMER } from '../../lib/labels';
import { shortDate } from '../../lib/model';
import signView from '../../lib/sign-view';
import { SIGN_DEFAULTS, SIGN_IDS } from '../../lib/zodiac';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const PER_SCREEN = 1;
export const FONTS = [{ family: 'Fraunces', weight: 700 }, { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }];

// the gradient of a tile by element (from, to); `to` is also the accent
const GRADIENT = {
  fire: ['#ffb347', '#ff6a3d'], earth: ['#9bd67f', '#4aa56a'], air: ['#8ad4ff', '#4a8dff'], water: ['#9aa9ff', '#6a5cf0'],
};
const tileStyle = (element) => ({ background: `linear-gradient(145deg, ${GRADIENT[element][0]}, ${GRADIENT[element][1]})` });

const BOX = {
  landscape: { text: { w: 639, h: 280 }, name: 460, nameMax: 78, max: 30, min: 15 },
  portrait: { text: { w: 616, h: 300 }, name: 440, nameMax: 72, max: 38, min: 16 },
  square: { text: { w: 449, h: 280 }, name: 300, nameMax: 58, max: 30, min: 14 },
};

/** One sign on a warm light screen: a gradient tile for its glyph, the scores in a card and the twelve signs as tiles with the current one ringed. */
function Daylight({ signs: [sign], today }) {
  const { t } = useTranslation();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner sign={sign} />;
  const view = signView(sign, t);
  const accent = GRADIENT[sign.element][1];
  const box = BOX[kind];

  return (
    <Stage className="daylight">
      <div className="daylight__main">
        <div className="daylight__kicker">{`${t('Daily horoscope')} · ${shortDate(today, t)}`}</div>
        <div className="daylight__hero">
          <span className="daylight__tile" style={tileStyle(sign.element)}><Glyph id={sign.id} className="daylight__glyph" idle stroke="#fff" strokeWidth={1.6} /></span>
          <div className="daylight__who">
            <h1 className="daylight__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 36, charWidth: 0.55 })) }}>{view.name}</h1>
            <div className="daylight__range">{`${view.range} · ${view.elementName}`}</div>
          </div>
        </div>
        {view.keyword && <div className="daylight__chip" style={{ backgroundColor: accent }}>{view.keyword}</div>}
        <div className="daylight__body">
          <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.54} className="daylight__text" />
        </div>
        <div className="daylight__facts">
          {sign.luckyNumber !== null && <span>{t('Lucky number')} <b className="daylight__number">{sign.luckyNumber}</b></span>}
          {view.colorName && <span>{t('Colour')} <i className="daylight__swatch" style={{ backgroundColor: view.colorHex }} /><b>{view.colorName}</b></span>}
        </div>
      </div>
      <div className="daylight__side">
        <div className="daylight__card">
          <Meter label={t('Love')} value={sign.love} />
          <Meter label={t('Work')} value={sign.work} />
          <Meter label={t('Health')} value={sign.health} />
        </div>
        <div className="daylight__caption">{t('The twelve signs')}</div>
        <div className="daylight__tiles">
          {SIGN_IDS.map((id) => (
            <span key={id} className="daylight__cell">
              <span className={`daylight__mini${id === sign.id ? ' is-current' : ''}`} style={tileStyle(SIGN_DEFAULTS[id].element)}>
                <Glyph id={id} className="daylight__mini-glyph" stroke="#fff" />
              </span>
            </span>
          ))}
        </div>
      </div>
      <p className="daylight__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

export default Daylight;
