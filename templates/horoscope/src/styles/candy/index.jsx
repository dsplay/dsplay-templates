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
export const FONTS = [{ family: 'Nunito', weight: 700 }, { family: 'Nunito', weight: 800 }, { family: 'Fredoka', weight: 700 }];

const BOX = {
  landscape: { text: { w: 676, h: 215 }, name: 676, nameMax: 100, max: 33, min: 16 },
  portrait: { text: { w: 616, h: 250 }, name: 616, nameMax: 100, max: 40, min: 16 },
  square: { text: { w: 760, h: 150 }, name: 760, nameMax: 84, max: 30, min: 15 },
};

/** One sign in soft pastels (the colour follows its element): a rounded blob with a big glyph, the text and the scores as pills. */
function Candy({ signs: [sign] }) {
  const { t } = useTranslation();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner sign={sign} />;
  const view = signView(sign, t);
  const box = BOX[kind];

  return (
    <Stage className={`candy candy--${sign.element}`}>
      <svg className="candy__bubbles" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="1180" cy="90" r="150" fill="#fff" opacity="0.35" />
        <circle cx="90" cy="650" r="110" fill="#fff" opacity="0.3" />
        <circle cx="1010" cy="640" r="46" fill="#fff" opacity="0.4" />
      </svg>
      <div className="candy__art">
        <svg className="candy__blob" viewBox="0 0 420 420" aria-hidden="true">
          <path className="candy__blob-back" d="M210 12c88 0 188 62 192 168 4 112-86 232-196 228C108 404 14 320 18 206 22 104 118 12 210 12z" />
          <path d="M210 40c70 0 150 50 154 134 3 90-70 188-156 185C130 356 52 288 56 204 60 122 138 40 210 40z" fill="#fff" opacity="0.45" />
        </svg>
        <Glyph id={sign.id} className="candy__glyph" idle stroke="#fff" strokeWidth={1.4} label={view.name} />
      </div>
      <div className="candy__info">
        <div className="candy__tag">{t('Daily horoscope')}</div>
        <h1 className="candy__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 40, charWidth: 0.52 })) }}>{view.name}</h1>
        <div className="candy__meta">
          <span>{view.range}</span>
          {view.keyword && <span className="candy__chip">{view.keyword}</span>}
        </div>
        <div className="candy__body">
          <FittedText text={view.text} width={box.text.w} height={box.text.h} max={box.max} min={box.min} charWidth={0.52} lineHeight={1.38} className="candy__text" />
        </div>
        <div className="candy__pills">
          <Meter label={t('Love')} value={sign.love} className="candy__pill" />
          <Meter label={t('Work')} value={sign.work} className="candy__pill" />
          <Meter label={t('Health')} value={sign.health} className="candy__pill" />
          {sign.luckyNumber !== null && <span className="candy__pill candy__pill--fact">{t('Lucky no.')} <b>{sign.luckyNumber}</b></span>}
          {view.colorName && <span className="candy__pill candy__pill--fact"><i className="candy__swatch" style={{ backgroundColor: view.colorHex }} />{view.colorName}</span>}
        </div>
      </div>
      <p className="candy__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

export default Candy;
