import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import { isBanner } from '../../lib/layout';
import Banner from './banner';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Bangers', weight: 400 }, { family: 'Fredoka', weight: 600 }, { family: 'Fredoka', weight: 700 }];

const BOX = {
  landscape: {
    question: { w: 869, h: 400, max: 74, min: 24 }, answer: { w: 800, h: 330, max: 163, min: 30 }, label: { w: 1000, h: 90, max: 31, min: 14 },
  },
  portrait: {
    question: { w: 520, h: 520, max: 62, min: 24 }, answer: { w: 520, h: 420, max: 130, min: 30 }, label: { w: 560, h: 100, max: 30, min: 14 },
  },
  square: {
    question: { w: 700, h: 400, max: 66, min: 24 }, answer: { w: 600, h: 340, max: 140, min: 30 }, label: { w: 680, h: 90, max: 30, min: 14 },
  },
};

/** A comic page: halftone dots, the question in a boxed panel, then the answer in an outlined burst with a "HA HA!". */
function ComicPlate({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const { kind } = plate;
  const box = BOX[kind];
  const k = plate.w / 660;

  const burst = useMemo(() => Array.from({ length: 32 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 32;
    const r = (i % 2 ? 130 : 190) * (kind === 'landscape' ? k : plate.w / 430);
    return `${(plate.w / 2 + Math.cos(a) * r * 1.6).toFixed(1)},${(plate.h * 0.52 + Math.sin(a) * r).toFixed(1)}`;
  }).join(' '), [plate.w, plate.h, k, kind]);

  return (
    <Stage className={`comic comic--${kind}${revealed ? ' is-revealed' : ''}`}>
      {revealed && (
        <span className="comic__burst idle-plate idle-swell"><svg viewBox={`0 0 ${plate.w} ${plate.h}`} aria-hidden="true">
          <polygon points={burst} fill="#ffd84d" stroke="#111" strokeWidth={7 * k} strokeLinejoin="round" />
        </svg></span>
      )}
      {revealed ? (
        <>
          <div className="comic__label">
            <FittedText text={joke.setup} width={box.label.w} height={box.label.h} max={box.label.max} min={box.label.min} lineHeight={1.2} charWidth={0.52} className="comic__label-text" />
          </div>
          <div className="comic__answer">
            <FittedText text={joke.punchline} width={box.answer.w} height={box.answer.h} max={box.answer.max} min={box.answer.min} lineHeight={1} charWidth={0.42} className="comic__answer-text" />
          </div>
          <div className="comic__haha">{t('HA HA!')}</div>
        </>
      ) : (
        <>
          <div className="comic__panel">
            <FittedText text={joke.setup} width={box.question.w} height={box.question.h} max={box.question.max} min={box.question.min} lineHeight={1.2} charWidth={0.52} className="comic__question-text" />
          </div>
          <div className="comic__mark idle-lean">?</div>
        </>
      )}
    </Stage>
  );
}

/** The strip formats get their own design (`./banner`); the others one plate. */
function Comic(props) {
  const { kind } = usePlate();
  return isBanner(kind) ? <Banner {...props} /> : <ComicPlate {...props} />;
}

export default Comic;
