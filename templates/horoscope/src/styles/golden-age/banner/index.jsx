import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Glyph from '../../../components/glyph';
import Constellation from '../../../components/constellation';
import Meter from '../../../components/meter';
import FittedText from '../../../components/fitted-text';
import { bannerText, fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import signView from '../../../lib/sign-view';
import './style.sass';

const GOLD = '#c9a24c';
const LIGHT_GOLD = '#e7c673';

/** A thin double gold frame with a diamond in each corner, as static SVG sized to the plate. */
function Frame({ w, h }) {
  const diamond = (x, y) => `M${x} ${y - 6} l6 6 -6 6 -6 -6z`;
  return (
    <svg className="goldb__frame" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <rect x="8" y="8" width={w - 16} height={h - 16} rx="4" fill="none" stroke={GOLD} strokeWidth="1.6" />
      <rect x="15" y="15" width={w - 30} height={h - 30} rx="2" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.7" />
      <g fill={GOLD}>
        <path d={diamond(15, 15)} />
        <path d={diamond(w - 15, 15)} />
        <path d={diamond(15, h - 15)} />
        <path d={diamond(w - 15, h - 15)} />
      </g>
    </svg>
  );
}

/** The strip of the Golden Age style: the constellation in a gold ring, the name in capitals and the text in italics inside the gold frame; the scores as stars on a long strip. */
function GoldenBanner({ sign }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const withSide = vertical || plate.w >= 1500;
  const withRing = vertical || plate.w >= 1100;
  const text = bannerText(plate, {
    left: (withRing ? 190 + 28 : 0) + 300 + 56, right: withSide ? 200 + 28 : 0, top: 780, pad: 40, height: 168,
  });

  return (
    <Stage className="golden">
      <Frame w={plate.w} h={plate.h} />
      <div className={`goldb goldb--${vertical ? 'v' : 'h'}`}>
        {withRing && (
          <div className="goldb__art">
            <svg className="goldb__circles" viewBox="0 0 360 360" aria-hidden="true">
              <circle cx="180" cy="180" r="170" fill="none" stroke={GOLD} strokeWidth="3" />
              <circle cx="180" cy="180" r="156" fill="none" stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 9" opacity="0.8" />
            </svg>
            <Constellation id={sign.id} width={220} height={220} pad={70} accent={LIGHT_GOLD} label={view.name} className="goldb__stars" idle lineWidth={2.6} lineOpacity={0.8} starFill="#fff3cf" starScale={2.2} haloScale={5} haloOpacity={0.25} />
          </div>
        )}
        <div className="goldb__who">
          <div className="goldb__head">
            <Glyph id={sign.id} className="goldb__glyph" idle stroke={LIGHT_GOLD} strokeWidth={1.5} />
            <span className="golden__range goldb__range">{view.range}</span>
          </div>
          <h1 className="golden__name goldb__name" style={{ fontSize: rem(fitLine({ text: view.name.toUpperCase(), width: vertical ? 208 : 300, max: vertical ? 40 : 46, min: 24, charWidth: 0.78 })) }}>{view.name}</h1>
          {view.keyword && <div className="golden__keyword goldb__keyword">{view.keyword}</div>}
        </div>
        <div className="goldb__body">
          <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.52 : 0.46} lineHeight={1.3} wholeWords className="golden__text" />
          <p className="goldb__notice">{t(DISCLAIMER)}</p>
        </div>
        {withSide && (
          <div className="goldb__side">
            <Meter label={t('Love')} value={sign.love} variant="stars" />
            <Meter label={t('Work')} value={sign.work} variant="stars" />
            <Meter label={t('Health')} value={sign.health} variant="stars" />
            {sign.luckyNumber !== null && <div className="goldb__lucky">{t('Lucky no.')} <b>{sign.luckyNumber}</b></div>}
          </div>
        )}
      </div>
    </Stage>
  );
}

export default GoldenBanner;
