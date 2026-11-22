import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Glyph from '../../../components/glyph';
import Meter from '../../../components/meter';
import FittedText from '../../../components/fitted-text';
import { bannerText, fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import signView from '../../../lib/sign-view';
import './style.sass';

const GRADIENT = {
  fire: ['#ffb347', '#ff6a3d'], earth: ['#9bd67f', '#4aa56a'], air: ['#8ad4ff', '#4a8dff'], water: ['#9aa9ff', '#6a5cf0'],
};

/** The strip of the Daylight style: the gradient tile of the sign, its name in the serif, the text, and in a card the scores and the lucky number. */
function DaylightBanner({ sign }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const [from, accent] = GRADIENT[sign.element];
  const withSide = vertical || plate.w >= 1400;
  const text = bannerText(plate, { left: 160 + 300 + 28, right: withSide ? 230 : 0, top: 600 });

  return (
    <Stage className="daylight">
      <div className={`dayb dayb--${vertical ? 'v' : 'h'}`}>
        <div className="dayb__art">
          <span className="dayb__tile" style={{ background: `linear-gradient(145deg, ${from}, ${accent})` }}><Glyph id={sign.id} className="dayb__glyph" idle stroke="#fff" strokeWidth={1.6} label={view.name} /></span>
        </div>
        <div className="dayb__who">
          <h1 className="daylight__name dayb__name" style={{ fontSize: rem(fitLine({ text: view.name, width: vertical ? 208 : 290, max: vertical ? 56 : 62, min: 30, charWidth: 0.55 })) }}>{view.name}</h1>
          <div className="dayb__range">{`${view.range} · ${view.elementName}`}</div>
          {view.keyword && <span className="dayb__chip" style={{ backgroundColor: accent }}>{view.keyword}</span>}
        </div>
        <div className="dayb__body">
          <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.64 : 0.58} lineHeight={1.36} wholeWords className="daylight__text" />
          <p className="dayb__notice">{t(DISCLAIMER)}</p>
        </div>
        {withSide && (
          <div className="dayb__side">
            <div className="dayb__card">
              <Meter label={t('Love')} value={sign.love} />
              <Meter label={t('Work')} value={sign.work} />
              <Meter label={t('Health')} value={sign.health} />
              {sign.luckyNumber !== null && <div className="dayb__lucky">{t('Lucky no.')} <b style={{ color: accent }}>{sign.luckyNumber}</b></div>}
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
}

export default DaylightBanner;
