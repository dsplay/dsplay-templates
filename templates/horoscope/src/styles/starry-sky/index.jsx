import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Glyph from '../../components/glyph';
import Constellation from '../../components/constellation';
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
export const FONTS = [{ family: 'Cormorant Garamond', weight: 700 }, { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }];

const ELEMENT_COLOR = {
  fire: '#ff8a4c', earth: '#86c76b', air: '#6ec3ff', water: '#7a9cff',
};

// The box each part of a layout gets, in design px: the width of the name and the box of the text (see lib/layout.js)
const BOX = {
  landscape: { name: 580, text: { w: 580, h: 252 }, max: 29, min: 15, nameMax: 96 },
  portrait: { name: 616, text: { w: 616, h: 300 }, max: 32, min: 16, nameMax: 104 },
  square: { name: 800, text: { w: 800, h: 150 }, max: 28, min: 14, nameMax: 84 },
};

const ART = { landscape: [400, 400], portrait: [440, 340], square: [300, 220] };

/** One sign on a night sky: its constellation, the name big, the text, the scores and the lucky facts; the portrait layout adds the strip of the twelve signs. */
function StarryPlate({ signs: [sign], today }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  const view = signView(sign, t);
  const accent = ELEMENT_COLOR[sign.element];
  const box = BOX[kind];
  const [artW, artH] = ART[kind];

  // the field of faint stars behind everything, fixed for a given plate
  const field = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    x: Math.round(((i * 0.618034 + 0.17) % 1) * plate.w),
    y: Math.round(((i * 0.754878 + 0.31) % 1) * plate.h),
    r: 0.6 + (i % 4) * 0.35,
    o: 0.2 + (i % 5) * 0.12,
  })), [plate.w, plate.h]);

  const kicker = <div className="starry__kicker"><span className="starry__rule" style={{ backgroundColor: accent }} />{`${t('Daily horoscope')} · ${shortDate(today, t)}`}</div>;

  return (
    <Stage className="starry">
      <svg className="starry__field" viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
        {field.map((star) => <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="#ffffff" opacity={star.o} />)}
      </svg>

      {kind !== 'landscape' && kicker}
      <div className="starry__art">
        {kind === 'landscape' && <Glyph id={sign.id} className="starry__watermark" idle stroke={accent} strokeWidth={0.35} />}
        <Constellation
          id={sign.id}
          width={artW}
          height={artH}
          accent={accent}
          label={view.name}
          className="starry__stars" idle
          lineWidth={kind === 'landscape' ? 2.2 : 2.4}
          starScale={kind === 'landscape' ? 2.4 : 2.2}
          haloScale={kind === 'landscape' ? 6 : 5.6}
        />
      </div>

      <div className="starry__info">
        {kind === 'landscape' && kicker}
        <h1 className="starry__name" style={{ fontSize: rem(fitLine({ text: view.name, width: box.name, max: box.nameMax, min: 40, charWidth: 0.5 })) }}>{view.name}</h1>
        <div className="starry__meta">
          <span>{view.range}</span>
          {view.keyword && <span className="starry__chip" style={{ color: accent, borderColor: accent }}>{view.keyword}</span>}
        </div>
        <div className="starry__body">
          <FittedText
            text={view.text}
            width={box.text.w}
            height={box.text.h}
            max={box.max}
            min={box.min}
            lineHeight={1.4}
            charWidth={0.5}
            className="starry__text"
          />
        </div>
        <div className="starry__meters">
          <Meter label={t('Love')} value={sign.love} />
          <Meter label={t('Work')} value={sign.work} />
          <Meter label={t('Health')} value={sign.health} />
        </div>
        <div className="starry__facts">
          {sign.luckyNumber !== null && <span>{t('Lucky number')} <b>{sign.luckyNumber}</b></span>}
          {view.colorName && <span>{t('Colour')} <i className="starry__swatch" style={{ backgroundColor: view.colorHex }} /><b>{view.colorName}</b></span>}
          {view.matchName && (
            <span>
              {t('Matches with')}
              <Glyph id={sign.compatible} className="starry__match" stroke={ELEMENT_COLOR[SIGN_DEFAULTS[sign.compatible].element]} strokeWidth={2} />
              <b>{view.matchName}</b>
            </span>
          )}
        </div>
        {kind === 'portrait' && (
          <div className="starry__strip">
            {SIGN_IDS.map((id) => <Glyph key={id} id={id} className="starry__strip-glyph" stroke={id === sign.id ? accent : 'rgba(255,255,255,0.28)'} />)}
          </div>
        )}
      </div>
      <p className="starry__disclaimer">{t(DISCLAIMER)}</p>
    </Stage>
  );
}

/** The strip formats get their own design (`./banner`); the others one plate. */
function StarrySky(props) {
  const { kind } = usePlate();
  const { signs: [sign], today } = props;
  return isBanner(kind) ? <Banner sign={sign} today={today} /> : <StarryPlate {...props} />;
}

export default StarrySky;
