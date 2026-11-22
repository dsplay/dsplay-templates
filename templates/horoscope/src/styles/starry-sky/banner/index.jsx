import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import Glyph from '../../../components/glyph';
import Constellation from '../../../components/constellation';
import Meter from '../../../components/meter';
import FittedText from '../../../components/fitted-text';
import { fitLine, rem } from '../../../lib/layout';
import { DISCLAIMER } from '../../../lib/labels';
import { shortDate } from '../../../lib/model';
import signView from '../../../lib/sign-view';
import './style.sass';

const ELEMENT_COLOR = {
  fire: '#ff8a4c', earth: '#86c76b', air: '#6ec3ff', water: '#7a9cff',
};

/**
 * The strip of the Starry Sky style (a 240 design px thick plate, see lib/layout.js): the constellation, the name and the dates, then the text, and on a long
 * strip the scores as dots and the lucky number. Horizontal: one row; vertical: one narrow column, the notice at the bottom.
 */
function StarryBanner({ sign, today }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const view = signView(sign, t);
  const accent = ELEMENT_COLOR[sign.element];
  const withArt = vertical || plate.w >= 1100;
  const withMeters = vertical || plate.w >= 1500;

  const field = useMemo(() => Array.from({ length: vertical ? 40 : 60 }, (_, i) => ({
    x: Math.round(((i * 0.618034 + 0.17) % 1) * plate.w),
    y: Math.round(((i * 0.754878 + 0.31) % 1) * plate.h),
    r: 0.6 + (i % 4) * 0.35,
    o: 0.2 + (i % 5) * 0.12,
  })), [plate.w, plate.h, vertical]);

  const nameBox = vertical ? 208 : 300;
  const text = vertical
    ? { w: 208, h: plate.h - 470, max: 34, min: 12 }
    : { w: plate.w - (withArt ? 560 : 330) - (withMeters ? 200 : 0) - 56, h: 176, max: 44, min: 12 };

  return (
    <Stage className="starry">
      <svg className="starry__field" viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
        {field.map((star) => <circle key={`${star.x}-${star.y}`} cx={star.x} cy={star.y} r={star.r} fill="#ffffff" opacity={star.o} />)}
      </svg>
      <div className={`starry-b starry-b--${vertical ? 'v' : 'h'}`}>
        <div className="starry-b__kicker"><span className="starry__rule" style={{ backgroundColor: accent }} />{`${t('Daily horoscope')} · ${shortDate(today, t)}`}</div>
        {withArt && (
          <Constellation
            id={sign.id}
            width={vertical ? 190 : 170}
            height={vertical ? 120 : 130}
            pad={18}
            accent={accent}
            label={view.name}
            className="starry-b__stars" idle
            lineWidth={2}
            starScale={2}
            haloScale={5}
          />
        )}
        <div className="starry-b__who">
          {!withArt && <Glyph id={sign.id} className="starry-b__glyph" idle stroke={accent} strokeWidth={1.6} label={view.name} />}
          <h1 className="starry__name starry-b__name" style={{ fontSize: rem(fitLine({ text: view.name, width: nameBox, max: vertical ? 56 : 64, min: 30, charWidth: 0.5 })) }}>{view.name}</h1>
          <div className="starry-b__range">{view.range}</div>
          {view.keyword && <span className="starry__chip starry-b__chip" style={{ color: accent, borderColor: accent }}>{view.keyword}</span>}
        </div>
        <div className="starry-b__body">
          <FittedText text={view.text} width={text.w} height={text.h} max={text.max} min={text.min} charWidth={vertical ? 0.64 : 0.58} lineHeight={1.38} wholeWords className="starry__text" />
          {!vertical && <p className="starry__disclaimer starry-b__notice">{t(DISCLAIMER)}</p>}
        </div>
        {withMeters && (
          <div className="starry-b__side">
            <div className="starry-b__meters">
              <Meter label={t('Love')} value={sign.love} />
              <Meter label={t('Work')} value={sign.work} />
              <Meter label={t('Health')} value={sign.health} />
            </div>
            {sign.luckyNumber !== null && <div className="starry-b__lucky">{t('Lucky no.')} <b>{sign.luckyNumber}</b></div>}
          </div>
        )}
        {vertical && <p className="starry__disclaimer starry-b__notice">{t(DISCLAIMER)}</p>}
      </div>
    </Stage>
  );
}

export default StarryBanner;
