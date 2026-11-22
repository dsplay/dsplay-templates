import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Constellation from '../../components/constellation';
import Meter from '../../components/meter';
import FittedText from '../../components/fitted-text';
import { fitLine, isBanner, rem } from '../../lib/layout';
import { DISCLAIMER } from '../../lib/labels';
import signView from '../../lib/sign-view';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const PER_SCREEN = 1;
export const FONTS = [{ family: 'Cinzel', weight: 500 }, { family: 'Cinzel', weight: 700 }, { family: 'Cormorant Garamond', weight: 500 }, { family: 'Inter', weight: 500 }];

const GOLD = '#c9a24c';
const LIGHT_GOLD = '#e7c673';

const BOX = {
  landscape: { text: { w: 660, h: 215 }, name: 660, nameMax: 92, max: 34, min: 16 },
  portrait: { text: { w: 600, h: 290 }, name: 600, nameMax: 78, max: 42, min: 16 },
  square: { text: { w: 700, h: 170 }, name: 700, nameMax: 70, max: 30, min: 15 },
};

/** The double gold frame with corner brackets and a diamond top and bottom, as static SVG sized to the plate. */
function Frame({ w, h }) {
  const cx = w / 2;
  return (
    <svg className="golden__frame" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <rect x="26" y="26" width={w - 52} height={h - 52} rx="6" fill="none" stroke={GOLD} strokeWidth="2" />
      <rect x="38" y="38" width={w - 76} height={h - 76} rx="3" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.7" />
      <g stroke={GOLD} strokeWidth="2" fill="none">
        <path d={`M26 86 V26 H86`} />
        <path d={`M${w - 26} 86 V26 H${w - 86}`} />
        <path d={`M26 ${h - 86} V${h - 26} H86`} />
        <path d={`M${w - 26} ${h - 86} V${h - 26} H${w - 86}`} />
      </g>
      <g fill={GOLD}>
        <path d={`M${cx} 30 l8 8 -8 8 -8 -8z`} />
        <path d={`M${cx} ${h - 46} l8 8 -8 8 -8 -8z`} />
      </g>
    </svg>
  );
}

/** One sign inside a gold art deco frame: its constellation in a gold ring, the name in capitals, the text in italics and the scores as stars. */
function GoldenAge({ signs: [sign] }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  if (isBanner(kind)) return <Banner sign={sign} />;
  const view = signView(sign, t);
  const box = BOX[kind];

  return (
    <Stage className="golden">
      <Frame w={plate.w} h={plate.h} />
      <div className="golden__kicker">{t('Daily horoscope')}</div>
      <div className="golden__ring">
        <span className="golden__circles idle-ring"><svg viewBox="0 0 360 360" aria-hidden="true">
          <circle cx="180" cy="180" r="170" fill="none" stroke={GOLD} strokeWidth="2" />
          <circle cx="180" cy="180" r="158" fill="none" stroke={GOLD} strokeWidth="0.8" strokeDasharray="2 7" opacity="0.8" />
        </svg></span>
        <Constellation
          id={sign.id}
          width={220}
          height={220}
          pad={70}
          accent={LIGHT_GOLD}
          label={view.name}
          className="golden__stars" idle
          lineWidth={1.8}
          lineOpacity={0.8}
          starFill="#fff3cf"
          starScale={1.7}
          haloScale={4.5}
          haloOpacity={0.25}
        />
      </div>
      <div className="golden__info">
        <div className="golden__head">
          <Glyph id={sign.id} className="golden__glyph" idle stroke={LIGHT_GOLD} strokeWidth={1.5} />
          <span className="golden__range">{view.range}</span>
        </div>
        <h1 className="golden__name" style={{ fontSize: rem(fitLine({ text: view.name.toUpperCase(), width: box.name, max: box.nameMax, min: 36, charWidth: 0.78 })) }}>{view.name}</h1>
        {view.keyword && <div className="golden__keyword">{view.keyword}</div>}
        <div className="golden__rule" />
        <div className="golden__body">
          <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.44} lineHeight={1.34} className="golden__text" />
        </div>
      </div>
      <div className="golden__scores">
        <Meter label={t('Love')} value={sign.love} variant="stars" />
        <Meter label={t('Work')} value={sign.work} variant="stars" />
        <Meter label={t('Health')} value={sign.health} variant="stars" />
        {sign.luckyNumber !== null && <div className="golden__lucky">{t('Lucky no.')} <b>{sign.luckyNumber}</b></div>}
      </div>
      <p className="golden__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

export default GoldenAge;
