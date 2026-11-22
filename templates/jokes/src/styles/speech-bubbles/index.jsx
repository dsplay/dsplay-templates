import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import { isBanner } from '../../lib/layout';
import Banner from './banner';
import Face from './face';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Fredoka', weight: 500 }, { family: 'Fredoka', weight: 600 }, { family: 'Fredoka', weight: 700 }, { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }];

// Boxes in design px: the text of the question bubble, the text of the answer bubble and the small question above it
const BOX = {
  landscape: {
    question: { w: 780, h: 290, max: 74, min: 24 }, answer: { w: 722, h: 330, max: 109, min: 28 }, chip: { w: 1050, h: 90, max: 39, min: 16 },
  },
  portrait: {
    question: { w: 540, h: 480, max: 64, min: 24 }, answer: { w: 540, h: 520, max: 90, min: 28 }, chip: { w: 560, h: 100, max: 34, min: 16 },
  },
  square: {
    question: { w: 700, h: 330, max: 64, min: 24 }, answer: { w: 700, h: 340, max: 90, min: 28 }, chip: { w: 720, h: 90, max: 34, min: 16 },
  },
};

/** Where the burst behind the answer is centred, down the plate: the answer bubble sits lower on a landscape plate than on the tall ones. */
const BURST_Y = { landscape: 0.51, portrait: 0.34, square: 0.32 };
const AIR = [1, 2, 3, 4, 5, 6, 7, 8];
const CONFETTI = ['#ff7ab8', '#2dd4bf', '#ffffff', '#ff9f43'];

/** The question in a big white speech bubble on yellow; the answer pops into a second bubble on pink and orange while the question shrinks to a label. */
function BubblesPlate({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  const box = BOX[kind];
  const k = plate.w / 660;

  const decor = useMemo(() => ({
    confetti: Array.from({ length: 18 }, (_, i) => ({
      x: Math.round(((i * 0.618034 + 0.11) % 1) * plate.w),
      y: Math.round(((i * 0.754878 + 0.27) % 1) * plate.h),
      r: (4 + (i % 4) * 2) * k,
      fill: CONFETTI[i % 4],
    })),
    burst: Array.from({ length: 28 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 28;
      const r = (i % 2 ? 150 : 230) * k;
      return `${(plate.w / 2 + Math.cos(a) * r * 1.3).toFixed(1)},${(plate.h * BURST_Y[kind] + Math.sin(a) * r).toFixed(1)}`;
    }).join(' '),
  }), [plate.w, plate.h, k, kind]);

  return (
    <Stage className={`bubbles bubbles--${kind}${revealed ? ' is-revealed' : ''}`}>
      <div className="bubbles__bg bubbles__bg--answer" />
      <div className="bubbles__air" aria-hidden="true">
        {AIR.map((n) => <i key={n} className={`idle-rise bubbles__air-${n}`} />)}
      </div>
      <span className="bubbles__decor idle-plate idle-drift"><svg viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
        {decor.confetti.map((c) => <circle key={`${c.x}-${c.y}`} cx={c.x} cy={c.y} r={c.r} fill={revealed ? '#fff' : c.fill} opacity={revealed ? 0.55 : 0.7} />)}
        {revealed
          ? <polygon points={decor.burst} fill="#fff6c9" opacity="0.5" />
          : (
            <>
              <text x={plate.w * 0.83} y={plate.h * 0.26} fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize={96 * k} fill="#ff7ab8" transform={`rotate(14 ${plate.w * 0.83} ${plate.h * 0.26})`}>?</text>
              <text x={plate.w * 0.06} y={plate.h * 0.89} fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize={72 * k} fill="#2dd4bf" transform={`rotate(-12 ${plate.w * 0.06} ${plate.h * 0.89})`}>?</text>
            </>
          )}
      </svg></span>

      <div className={`bubbles__question${revealed ? ' is-gone' : ''}`}>
        <FittedText text={joke.setup} width={box.question.w} height={box.question.h} max={box.question.max} min={box.question.min} lineHeight={1.2} charWidth={0.5} className="bubbles__question-text" />
        <svg className="bubbles__tail" viewBox="0 0 46 40" aria-hidden="true"><path d="M2 0 L44 0 L26 38 Z" fill="#fff" /></svg>
      </div>

      {revealed && (
        <>
          <div className="bubbles__chip">
            <FittedText text={joke.setup} width={box.chip.w} height={box.chip.h} max={box.chip.max} min={box.chip.min} lineHeight={1.2} charWidth={0.5} className="bubbles__chip-text" />
          </div>
          <div className="bubbles__answer">
            <FittedText text={joke.punchline} width={box.answer.w} height={box.answer.h} max={box.answer.max} min={box.answer.min} lineHeight={1.1} charWidth={0.5} className="bubbles__answer-text" />
          </div>
        </>
      )}
      <Face happy={revealed} label={t(revealed ? 'Answer' : 'Question')} />
    </Stage>
  );
}

/** The strip formats get their own design (`./banner`); the others one plate. */
function SpeechBubbles(props) {
  const { kind } = usePlate();
  return isBanner(kind) ? <Banner {...props} /> : <BubblesPlate {...props} />;
}

export default SpeechBubbles;
