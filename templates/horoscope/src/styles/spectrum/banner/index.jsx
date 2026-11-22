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

/** The strip of the Spectrum style: a full-colour band by element with the name as big as the strip allows, the text in white and the scores as bars with the lucky number. */
function SpectrumBanner({ sign }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const withSide = vertical || plate.w >= 1400;
  const nameBox = vertical ? 208 : Math.min(520, Math.round(plate.w * 0.3));
  const text = bannerText(plate, {
    left: nameBox + 28 + 28, right: withSide ? 220 + 28 : 0, top: 810, height: 170,
  });

  return (
    <Stage className={`spectrum spectrum--${sign.element}`}>
      <Glyph id={sign.id} className="specb__watermark" idle stroke="#fff" strokeWidth={0.5} />
      <div className={`specb specb--${vertical ? 'v' : 'h'}`}>
        <div className="specb__who" style={vertical ? undefined : { width: rem(nameBox) }}>
          <div className="specb__kicker"><Glyph id={sign.id} className="spectrum__icon specb__icon" stroke="#fff" strokeWidth={2} />{t('Daily horoscope')}</div>
          <h1 className="spectrum__name specb__name" style={{ fontSize: rem(fitLine({ text: view.name, width: nameBox, max: vertical ? 64 : 110, min: 32, charWidth: 0.62 })) }}>{view.name}</h1>
          <div className="specb__range">{view.range}{view.keyword && <span className="spectrum__chip specb__chip">{view.keyword}</span>}</div>
        </div>
        <div className="specb__body">
          <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.64 : 0.58} lineHeight={1.3} wholeWords className="spectrum__text" />
          <p className="specb__notice">{t(DISCLAIMER)}</p>
        </div>
        {withSide && (
          <div className="specb__side">
            <Meter label={t('Love')} value={sign.love} variant="bar" />
            <Meter label={t('Work')} value={sign.work} variant="bar" />
            <Meter label={t('Health')} value={sign.health} variant="bar" />
            {sign.luckyNumber !== null && <div className="specb__lucky">{t('Lucky no.')} <b>{sign.luckyNumber}</b></div>}
          </div>
        )}
      </div>
    </Stage>
  );
}

export default SpectrumBanner;
