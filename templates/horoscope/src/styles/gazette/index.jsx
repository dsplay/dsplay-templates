import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Constellation from '../../components/constellation';
import Meter from '../../components/meter';
import FittedText from '../../components/fitted-text';
import { fitLine, isBanner, rem } from '../../lib/layout';
import { DISCLAIMER } from '../../lib/labels';
import { longDate } from '../../lib/model';
import signView from '../../lib/sign-view';
import { SIGN_IDS } from '../../lib/zodiac';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const PER_SCREEN = 1;
export const FONTS = [{ family: 'Playfair Display', weight: 500 }, { family: 'Playfair Display', weight: 700 }, { family: 'Inter', weight: 600 }];

const INK = '#1c1a17';
const RED = '#c8442b';

const BOX = {
  landscape: { text: { w: 676, h: 240 }, name: 676, nameMax: 112, max: 35, min: 16 },
  portrait: { text: { w: 616, h: 280 }, name: 616, nameMax: 104, max: 36, min: 17 },
  square: { text: { w: 740, h: 150 }, name: 740, nameMax: 84, max: 30, min: 15 },
};

/** The rules of a newspaper page, as static SVG: a thick and a thin line under the header, one above the footer and, in landscape, the column rule. */
function Rules({ w, h, landscape }) {
  return (
    <svg className="gazette__rules" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <line x1="56" y1="92" x2={w - 56} y2="92" stroke={INK} strokeWidth="2" />
      <line x1="56" y1="98" x2={w - 56} y2="98" stroke={INK} strokeWidth="0.8" />
      <line x1="56" y1={h - 70} x2={w - 56} y2={h - 70} stroke={INK} strokeWidth="0.8" />
      {landscape && <line x1="500" y1="130" x2="500" y2="620" stroke={INK} strokeWidth="0.8" />}
    </svg>
  );
}

/** One sign as a newspaper page: serif type on paper, a big ink glyph with a red constellation stamp and the scores as rules. */
function Gazette({ signs: [sign], today }) {
  const { t, i18n } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  if (isBanner(kind)) return <Banner sign={sign} today={today} />;
  const view = signView(sign, t);
  const box = BOX[kind];
  const number = String(SIGN_IDS.indexOf(sign.id) + 1).padStart(2, '0');

  return (
    <Stage className="gazette">
      <Rules w={plate.w} h={plate.h} landscape={kind === 'landscape'} />
      <div className="gazette__header">
        <span className="gazette__section">{t('Daily horoscope')}</span>
        <span className="gazette__date">{longDate(today, i18n.language)}</span>
        <span className="gazette__section">{`${number} / 12`}</span>
      </div>
      <div className="gazette__art">
        <Glyph id={sign.id} className="gazette__glyph" idle stroke={INK} strokeWidth={0.55} label={view.name} />
        <Constellation
          id={sign.id}
          width={100}
          height={100}
          pad={15}
          accent={RED}
          className="gazette__stamp"
          lineWidth={1.4}
          lineOpacity={1}
          starFill={RED}
          starScale={1.3}
          haloOpacity={0}
        />
      </div>
      <div className="gazette__info">
        <h1 className="gazette__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 40, charWidth: 0.55 })) }}>{view.name}</h1>
        <div className="gazette__meta">
          <span className="gazette__range">{view.range}</span>
          {view.keyword && <span className="gazette__keyword">{view.keyword}</span>}
        </div>
        <div className="gazette__body">
          <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.5} lineHeight={1.36} className="gazette__text" />
        </div>
        <div className="gazette__rulers">
          <Meter label={t('Love')} value={sign.love} variant="ticks" />
          <Meter label={t('Work')} value={sign.work} variant="ticks" />
          <Meter label={t('Health')} value={sign.health} variant="ticks" />
        </div>
      </div>
      <div className="gazette__footer">
        <span>
          {sign.luckyNumber !== null && <>{t('Lucky number')} <b>{sign.luckyNumber}</b></>}
          {sign.luckyNumber !== null && view.colorName && ' · '}
          {view.colorName && <>{t('Colour')} <b>{view.colorName}</b></>}
        </span>
        <span className="gazette__disclaimer">{t(DISCLAIMER)}</span>
      </div>
    </Stage>
  );
}

export default Gazette;
