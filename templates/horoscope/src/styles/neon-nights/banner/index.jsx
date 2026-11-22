import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Constellation from '../../../components/constellation';
import Meter from '../../../components/meter';
import FittedText from '../../../components/fitted-text';
import { bannerText, fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import signView from '../../../lib/sign-view';
import Grid from '../grid';
import './style.sass';

const NEON = {
  fire: '#ff9a3c', earth: '#4dffa0', air: '#3dd9ff', water: '#9d8bff',
};

/** The strip of the Neon Nights style: the grid floor under a glowing name, the constellation in a pink ring, the text, and the scores as light bars with the lucky number. */
function NeonBanner({ sign }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const withSide = vertical || plate.w >= 1500;
  const withArt = vertical || plate.w >= 1100;
  const text = bannerText(plate, {
    left: (withArt ? 190 + 28 : 0) + 300 + 28, right: withSide ? 200 + 28 : 0, top: 800, height: 170,
  });

  return (
    <Stage className={`neon neon--${sign.element}`}>
      <Grid w={plate.w} h={plate.h} />
      <div className={`neonb neonb--${vertical ? 'v' : 'h'}`}>
        {withArt && (
          <div className="neonb__art">
            <svg className="neonb__ring" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="190" fill="none" stroke="#ff2fb3" strokeWidth="4" opacity="0.55" />
              <circle cx="200" cy="200" r="150" fill="#ff2fb3" opacity="0.1" />
            </svg>
            <Constellation id={sign.id} width={280} height={280} pad={30} accent={NEON[sign.element]} label={view.name} className="neonb__stars" idle lineWidth={5} lineOpacity={1} haloOpacity={0.35} starScale={3} haloScale={6} />
          </div>
        )}
        <div className="neonb__who">
          <h1 className="neon__name neonb__name" style={{ fontSize: rem(fitLine({ text: view.name, width: vertical ? 208 : 300, max: vertical ? 40 : 48, min: 24, charWidth: 0.8 })) }}>{view.name}</h1>
          <div className="neonb__range">{view.range}</div>
          {view.keyword && <span className="neon__chip neonb__chip">{view.keyword}</span>}
        </div>
        <div className="neonb__body">
          <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.66 : 0.6} lineHeight={1.34} wholeWords className="neon__text" />
          <p className="neonb__notice">{t(DISCLAIMER)}</p>
        </div>
        {withSide && (
          <div className="neonb__side">
            <Meter label={t('Love')} value={sign.love} variant="cells" />
            <Meter label={t('Work')} value={sign.work} variant="cells" />
            <Meter label={t('Health')} value={sign.health} variant="cells" />
            {sign.luckyNumber !== null && <div className="neonb__lucky">{t('Lucky no.')} <b className="neon__number">{sign.luckyNumber}</b></div>}
          </div>
        )}
      </div>
    </Stage>
  );
}

export default NeonBanner;
