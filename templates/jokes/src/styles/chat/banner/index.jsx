import { useTranslation } from 'react-i18next';
import Stage from '../../../components/stage';
import usePlate from '../../../components/stage/use-plate';
import FittedText from '../../../components/fitted-text';
import { bannerSplit } from '../../../lib/layout';
import Avatar from '../avatar';
import Laugh from '../laugh';
import './style.sass';

/** The strip of the Chat style: the contact on one side, the question as a message with the other side "typing"; then the question shrinks and the answer comes back in a green reply with the laugh reaction. */
function ChatBanner({ joke, revealed }) {
  const { t } = useTranslation();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const { q, a } = bannerSplit(plate, revealed, { lead: vertical ? 70 : 200, share: vertical ? 0.3 : 0.38 });
  // the room of the typing dots comes out of the question while they are on screen
  const qLong = vertical ? q.h - (revealed ? 0 : 70) : q.w - (revealed ? 0 : 140);
  const qBox = vertical ? { w: q.w - 36, h: qLong - 24 } : { w: qLong - 56, h: q.h - 28 };
  const aBox = vertical ? { w: a.w - 36, h: a.h - 56 } : { w: a.w - 60, h: a.h - 56 };
  const sizeOf = (long) => (vertical ? { height: `${long / 10}rem` } : { width: `${long / 10}rem` });

  return (
    <Stage className="chat">
      <div className={`chatb chatb--${vertical ? 'v' : 'h'}`}>
        <div className="chatb__bar">
          <Avatar />
          <div>
            <div className="chat__title chatb__title">{t('Joke of the day')}</div>
            <div className="chat__status chatb__status">{t(revealed ? 'online' : 'typing…')}</div>
          </div>
        </div>
        <div className="chatb__bubble chatb__bubble--question" style={sizeOf(qLong)}>
          <FittedText text={joke.setup} width={qBox.w} height={qBox.h} max={revealed ? 26 : (vertical ? 40 : 56)} min={revealed ? 12 : 16} lineHeight={1.22} charWidth={0.6} wholeWords className="chat__text" />
        </div>
        {revealed ? (
          <div className="chatb__bubble chatb__bubble--answer" style={sizeOf(a.w > 0 && !vertical ? a.w : a.h)}>
            <FittedText text={joke.punchline} width={aBox.w} height={aBox.h} max={vertical ? 48 : 70} min={14} lineHeight={1.12} charWidth={0.64} wholeWords className="chat__text chat__text--answer" />
            <div className="chatb__reaction"><Laugh />{t('haha')}</div>
          </div>
        ) : (
          <div className="chatb__bubble chatb__bubble--typing" role="img" aria-label={t('typing…')}>
            <span className="chat__dot" />
            <span className="chat__dot chat__dot--2" />
            <span className="chat__dot chat__dot--3" />
          </div>
        )}
      </div>
    </Stage>
  );
}

export default ChatBanner;
