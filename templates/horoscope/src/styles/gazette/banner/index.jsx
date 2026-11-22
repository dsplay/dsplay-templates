import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Glyph from '../../../components/glyph';
import Constellation from '../../../components/constellation';
import Meter from '../../../components/meter';
import FittedText from '../../../components/fitted-text';
import { bannerText, fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import { longDate } from '../../../lib/model';
import signView from '../../../lib/sign-view';
import { SIGN_IDS } from '../../../lib/zodiac';
import './style.sass';

const INK = '#1c1a17';
const RED = '#c8442b';

/** The strip of the Gazette style: a newspaper band, with the header line and its double rule, the ink glyph and red stamp, the name, the text in the serif and the footer line. */
function GazetteBanner({ sign, today }) {
  const { t, i18n } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const number = String(SIGN_IDS.indexOf(sign.id) + 1).padStart(2, '0');
  const withSide = vertical || plate.w >= 1500;
  const text = bannerText(plate, {
    left: 130 + 28 + 300 + 56, right: withSide ? 200 + 28 : 0, top: 760, height: 134,
  });

  return (
    <Stage className="gazette">
      <div className={`gazb gazb--${vertical ? 'v' : 'h'}`}>
        <div className="gazb__header">
          <span>{t('Daily horoscope')}</span>
          <span className="gazette__date gazb__date">{longDate(today, i18n.language)}</span>
          <span>{`${number} / 12`}</span>
        </div>
        <div className="gazb__row">
          <div className="gazb__art">
            <Glyph id={sign.id} className="gazb__glyph" idle stroke={INK} strokeWidth={0.7} label={view.name} />
            <Constellation id={sign.id} width={100} height={100} pad={15} accent={RED} className="gazb__stamp" lineWidth={2} lineOpacity={1} starFill={RED} starScale={1.6} haloOpacity={0} />
          </div>
          <div className="gazb__who">
            <h1 className="gazette__name gazb__name" style={{ fontSize: rem(fitLine({ text: view.name, width: vertical ? 208 : 300, max: vertical ? 56 : 62, min: 30, charWidth: 0.55 })) }}>{view.name}</h1>
            <div className="gazb__range">{view.range}</div>
            {view.keyword && <div className="gazette__keyword gazb__keyword">{view.keyword}</div>}
          </div>
          <div className="gazb__body">
            <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.58 : 0.52} lineHeight={1.3} wholeWords className="gazette__text" />
          </div>
          {withSide && (
            <div className="gazb__side">
              <Meter label={t('Love')} value={sign.love} variant="ticks" />
              <Meter label={t('Work')} value={sign.work} variant="ticks" />
              <Meter label={t('Health')} value={sign.health} variant="ticks" />
            </div>
          )}
        </div>
        <div className="gazb__footer">
          <span>
            {sign.luckyNumber !== null && <>{t('Lucky number')} <b>{sign.luckyNumber}</b></>}
            {sign.luckyNumber !== null && view.colorName && ' · '}
            {view.colorName && <>{t('Colour')} <b>{view.colorName}</b></>}
          </span>
          <span className="gazette__disclaimer gazb__notice">{t(DISCLAIMER)}</span>
        </div>
      </div>
    </Stage>
  );
}

export default GazetteBanner;
