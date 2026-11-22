import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Meter from '../../components/meter';
import FittedText from '../../components/fitted-text';
import { fitLine, isBanner, rem } from '../../lib/layout';
import { DISCLAIMER } from '../../lib/labels';
import signView from '../../lib/sign-view';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const PER_SCREEN = 1;
export const FONTS = [{ family: 'Poppins', weight: 600 }, { family: 'Poppins', weight: 700 }, { family: 'Poppins', weight: 800 }];

const BOX = {
  landscape: { text: { w: 900, h: 215 }, name: 1136, nameMax: 150, max: 35, min: 16 },
  portrait: { text: { w: 616, h: 340 }, name: 616, nameMax: 112, max: 36, min: 17 },
  square: { text: { w: 756, h: 190 }, name: 756, nameMax: 110, max: 32, min: 15 },
};

/** One sign, big and bold, on a full colour screen that follows its element: a huge name, the text and the scores as bars. */
function Spectrum({ signs: [sign] }) {
  const { t } = useTranslation();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner sign={sign} />;
  const view = signView(sign, t);
  const box = BOX[kind];

  return (
    <Stage className={`spectrum spectrum--${sign.element}`}>
      <Glyph id={sign.id} className="spectrum__watermark" idle stroke="#fff" strokeWidth={0.5} />
      <div className="spectrum__content">
        <div className="spectrum__kicker"><Glyph id={sign.id} className="spectrum__icon" stroke="#fff" strokeWidth={2} />{t('Daily horoscope')}</div>
        <h1 className="spectrum__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 44, charWidth: 0.62 })) }}>{view.name}</h1>
        <div className="spectrum__meta">
          <span>{view.range}</span>
          {view.keyword && <span className="spectrum__chip">{view.keyword}</span>}
        </div>
        <div className="spectrum__body">
          <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.56} lineHeight={1.36} className="spectrum__text" />
        </div>
        <div className="spectrum__bars">
          <Meter label={t('Love')} value={sign.love} variant="bar" />
          <Meter label={t('Work')} value={sign.work} variant="bar" />
          <Meter label={t('Health')} value={sign.health} variant="bar" />
          {sign.luckyNumber !== null && <div className="spectrum__lucky"><div className="spectrum__lucky-label">{t('Lucky no.')}</div><div className="spectrum__number">{sign.luckyNumber}</div></div>}
        </div>
      </div>
      <p className="spectrum__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

export default Spectrum;
