import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import FittedText from '../../../components/fitted-text';
import { bannerSplit } from '../../../lib/layout';
import Face from '../face';
import './style.sass';

const FACE = 150;

/** The strip of the Speech Bubbles style: the face at one end and the question in a white bubble that points at it; once the answer is out the question shrinks to a chip and the answer pops into a bubble beside it, on the pink and orange. */
function BubblesBanner({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const { q, a } = bannerSplit(plate, revealed, { lead: vertical ? 120 : FACE, share: vertical ? 0.34 : 0.38 });
  const inner = (box) => ({ w: box.w - (vertical ? 36 : 56), h: box.h - (vertical ? 28 : 36) });
  const qBox = inner(q);
  const aBox = inner(a);

  return (
    <Stage className={`bubbles${revealed ? ' is-revealed' : ''}`}>
      <div className="bubbles__bg bubbles__bg--answer" />
      <div className={`bubb bubb--${vertical ? 'v' : 'h'}`}>
        <div className="bubb__face"><Face happy={revealed} label={t(revealed ? 'Answer' : 'Question')} /></div>
        <div className={`bubb__question${revealed ? ' is-small' : ''}`} style={{ width: vertical ? undefined : `${q.w / 10}rem`, height: vertical ? `${q.h / 10}rem` : undefined }}>
          <FittedText
            text={joke.setup}
            width={qBox.w}
            height={qBox.h}
            max={revealed ? 26 : (vertical ? 44 : 64)}
            min={revealed ? 12 : 16}
            lineHeight={1.2}
            charWidth={0.54}
            wholeWords className={revealed ? 'bubbles__chip-text' : 'bubbles__question-text'}
          />
        </div>
        {revealed && (
          <div className="bubb__answer" style={{ width: vertical ? undefined : `${a.w / 10}rem`, height: vertical ? `${a.h / 10}rem` : undefined }}>
            <FittedText text={joke.punchline} width={aBox.w} height={aBox.h} max={vertical ? 56 : 80} min={14} lineHeight={1.1} charWidth={0.66} wholeWords className="bubbles__answer-text" />
          </div>
        )}
      </div>
    </Stage>
  );
}

export default BubblesBanner;
