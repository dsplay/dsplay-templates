import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import { isBanner } from '../../lib/layout';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Poppins', weight: 600 }, { family: 'Poppins', weight: 700 }, { family: 'Poppins', weight: 800 }];

const BOX = {
  landscape: {
    question: { w: 792, h: 360, max: 72, min: 24 }, answer: { w: 780, h: 310, max: 105, min: 28 }, small: { w: 415, h: 100, max: 29, min: 13 },
  },
  portrait: {
    question: { w: 540, h: 400, max: 64, min: 24 }, answer: { w: 540, h: 400, max: 90, min: 28 }, small: { w: 520, h: 100, max: 30, min: 13 },
  },
  square: {
    question: { w: 700, h: 400, max: 66, min: 24 }, answer: { w: 700, h: 360, max: 92, min: 28 }, small: { w: 520, h: 100, max: 30, min: 13 },
  },
};

const BITS = ['#ff7ab8', '#2dd4bf', '#ffd84d', '#ffffff', '#ff9f43'];

/** A quiz stage: the question on a white card, then the answer on a yellow card with confetti while the question shrinks to a corner. */
function ShowPlate({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  const box = BOX[kind];
  const k = plate.w / 660;

  const decor = useMemo(() => ({
    rays: Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 12;
      const b = a + 0.14;
      const cx = plate.w / 2;
      const cy = plate.h * 0.4;
      const far = Math.max(plate.w, plate.h) * 1.1;
      return `${cx},${cy} ${Math.round(cx + Math.cos(a) * far)},${Math.round(cy + Math.sin(a) * far)} ${Math.round(cx + Math.cos(b) * far)},${Math.round(cy + Math.sin(b) * far)}`;
    }),
    bits: Array.from({ length: 20 }, (_, i) => ({
      x: Math.round(((i * 0.618034 + 0.09) % 1) * plate.w),
      y: Math.round(((i * 0.754878 + 0.2) % 1) * plate.h),
      fill: BITS[i % 5],
      rot: (i * 47) % 180,
    })),
  }), [plate.w, plate.h]);

  return (
    <Stage className={`show show--${kind}${revealed ? ' is-revealed' : ''}`}>
      <span className="show__spot idle-glow" />
      <span className="show__rays idle-spin"><svg viewBox={`${-plate.w} ${-plate.h * 1.1} ${plate.w * 3} ${plate.h * 3}`} aria-hidden="true">
        {decor.rays.map((points) => <polygon key={points} points={points} fill="#ffffff" opacity="0.05" />)}
      </svg></span>
      <span className="show__decor idle-plate idle-drift"><svg viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
        {revealed && decor.bits.map((b) => (
          <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={12 * k} height={7 * k} rx={2 * k} fill={b.fill} transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
        ))}
      </svg></span>

      <div className={`show__back${revealed ? ' is-gone' : ''}`}><span className="idle-lean">?</span></div>
      <div className={`show__card show__card--question${revealed ? ' is-gone' : ''}`}>
        <span className="show__badge show__badge--question">{t('Question')}</span>
        <FittedText text={joke.setup} width={box.question.w} height={box.question.h} max={box.question.max} min={box.question.min} lineHeight={1.2} charWidth={0.58} className="show__text" />
      </div>

      {revealed && (
        <>
          <div className="show__small">
            <FittedText text={joke.setup} width={box.small.w} height={box.small.h} max={box.small.max} min={box.small.min} lineHeight={1.25} charWidth={0.58} className="show__small-text" />
          </div>
          <div className="show__card show__card--answer">
            <span className="show__badge show__badge--answer">{t('Answer')}</span>
            <FittedText text={joke.punchline} width={box.answer.w} height={box.answer.h} max={box.answer.max} min={box.answer.min} lineHeight={1.08} charWidth={0.62} className="show__text show__text--answer" />
          </div>
        </>
      )}
    </Stage>
  );
}

/** The strip formats get their own design (`./banner`); the others one plate. */
function GameShow(props) {
  const { kind } = usePlate();
  return isBanner(kind) ? <Banner {...props} /> : <ShowPlate {...props} />;
}

export default GameShow;
