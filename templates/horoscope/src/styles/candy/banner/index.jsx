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

/** The strip of the Candy style: the rounded blob with the glyph, the name, the text on a soft white panel and the scores as pills. */
function CandyBanner({ sign }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const withSide = vertical || plate.w >= 1400;
  const text = bannerText(plate, {
    left: 150 + 28 + 290 + 28 + 40, right: withSide ? 210 + 28 : 0, top: 760, height: 150,
  });

  return (
    <Stage className={`candy candy--${sign.element}`}>
      <div className={`candyb candyb--${vertical ? 'v' : 'h'}`}>
        <div className="candyb__art">
          <svg className="candyb__blob" viewBox="0 0 420 420" aria-hidden="true">
            <path className="candy__blob-back" d="M210 12c88 0 188 62 192 168 4 112-86 232-196 228C108 404 14 320 18 206 22 104 118 12 210 12z" />
            <path d="M210 40c70 0 150 50 154 134 3 90-70 188-156 185C130 356 52 288 56 204 60 122 138 40 210 40z" fill="#fff" opacity="0.45" />
          </svg>
          <Glyph id={sign.id} className="candyb__glyph" idle stroke="#fff" strokeWidth={1.4} label={view.name} />
        </div>
        <div className="candyb__who">
          <h1 className="candy__name candyb__name" style={{ fontSize: rem(fitLine({ text: view.name, width: vertical ? 208 : 290, max: vertical ? 56 : 66, min: 30, charWidth: 0.52 })) }}>{view.name}</h1>
          <div className="candyb__range">{view.range}</div>
          {view.keyword && <span className="candy__chip candyb__chip">{view.keyword}</span>}
        </div>
        <div className="candyb__body">
          <div className="candyb__panel">
            <FittedText text={view.text} width={text.w - 36} height={text.h - 24} max={text.max} min={text.min} charWidth={vertical ? 0.64 : 0.58} lineHeight={1.34} wholeWords className="candy__text" />
          </div>
          <p className="candyb__notice">{t(DISCLAIMER)}</p>
        </div>
        {withSide && (
          <div className="candyb__side">
            <Meter label={t('Love')} value={sign.love} className="candy__pill" />
            <Meter label={t('Work')} value={sign.work} className="candy__pill" />
            <Meter label={t('Health')} value={sign.health} className="candy__pill" />
            {sign.luckyNumber !== null && <span className="candy__pill candy__pill--fact">{t('Lucky no.')} <b>{sign.luckyNumber}</b></span>}
          </div>
        )}
      </div>
    </Stage>
  );
}

export default CandyBanner;
