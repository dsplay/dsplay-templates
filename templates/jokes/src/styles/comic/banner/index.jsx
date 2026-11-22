import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import FittedText from '../../../components/fitted-text';
import { bannerSplit } from '../../../lib/layout';
import './style.sass';

/** An outlined yellow starburst filling a `w` x `h` box, as the points of a polygon. */
const burstPoints = (w, h) => Array.from({ length: 28 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 28;
  const r = i % 2 ? 0.84 : 1;
  return `${(w / 2 + Math.cos(angle) * (w / 2 - 6) * r).toFixed(1)},${(h / 2 + Math.sin(angle) * (h / 2 - 6) * r).toFixed(1)}`;
}).join(' ');

/** The strip of the Comic style: the question in a boxed panel with its yellow "?"; then the question shrinks to a label and the answer bursts in, red and outlined on a starburst, with the "HA HA!". */
function ComicBanner({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const split = bannerSplit(plate, revealed, { lead: vertical ? 70 : 170, share: vertical ? 0.26 : 0.3, gap: vertical ? 16 : 20 });
  // on a long vertical strip the burst stays a burst instead of a needle: the boxes stop growing and the rest is air around them
  const q = vertical && revealed ? { ...split.q, h: Math.min(split.q.h, 260) } : split.q;
  const a = vertical ? { ...split.a, h: Math.min(split.a.h, 420) } : split.a;
  const qBox = vertical ? { w: q.w - 56, h: q.h - 44 } : { w: q.w - 64, h: q.h - 36 };
  const aBox = vertical ? { w: a.w - 40, h: a.h * 0.55 } : { w: a.w - 130, h: a.h * 0.6 };
  const burst = burstPoints(a.w || 1, a.h || 1);
  const sizeOf = (box) => (vertical ? { height: `${box.h / 10}rem` } : { width: `${box.w / 10}rem` });

  return (
    <Stage className={`comic${revealed ? ' is-revealed' : ''}`}>
      <div className={`comicb comicb--${vertical ? 'v' : 'h'}`}>
        <div className={`comicb__panel${revealed ? ' is-label' : ''}`} style={sizeOf(q)}>
          <FittedText text={joke.setup} width={qBox.w} height={qBox.h} max={revealed ? 24 : (vertical ? 40 : 56)} min={revealed ? 12 : 16} lineHeight={1.2} charWidth={0.56} wholeWords className="comic__question-text" />
        </div>
        {revealed ? (
          <>
            <div className="comicb__answer" style={sizeOf(a)}>
              <svg className="comicb__burst" viewBox={`0 0 ${a.w} ${a.h}`} preserveAspectRatio="none" aria-hidden="true">
                <polygon points={burst} fill="#ffd84d" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
              </svg>
              <div className="comicb__answer-box">
                <FittedText text={joke.punchline} width={aBox.w} height={aBox.h} max={vertical ? 84 : 110} min={16} lineHeight={1} charWidth={0.46} wholeWords className="comic__answer-text" />
              </div>
            </div>
            <div className="comicb__haha">{t('HA HA!')}</div>
          </>
        ) : <div className="comicb__mark">?</div>}
      </div>
    </Stage>
  );
}

export default ComicBanner;
