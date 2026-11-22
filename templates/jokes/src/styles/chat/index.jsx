import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import { isBanner } from '../../lib/layout';
import Avatar from './avatar';
import Banner from './banner';
import Laugh from './laugh';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }];

const BOX = {
  landscape: {
    question: { w: 733, h: 300, max: 62, min: 22 }, answer: { w: 738, h: 230, max: 78, min: 26 }, small: { w: 620, h: 82, max: 41, min: 16 },
  },
  portrait: {
    question: { w: 520, h: 420, max: 70, min: 22 }, answer: { w: 520, h: 420, max: 96, min: 26 }, small: { w: 520, h: 130, max: 34, min: 16 },
  },
  square: {
    question: { w: 600, h: 300, max: 54, min: 22 }, answer: { w: 620, h: 300, max: 74, min: 26 }, small: { w: 600, h: 110, max: 34, min: 16 },
  },
};

/** A chat: the question arrives as a message while the other side is "typing"; then the answer comes back in a green reply with a laugh reaction. */
function ChatPlate({ joke, revealed }) {
  const { t } = useTranslation();
  const { kind } = usePlate();
  const box = BOX[kind];

  return (
    <Stage className={`chat chat--${kind}`}>
      <div className="chat__bar">
        <Avatar />
        <div>
          <div className="chat__title">{t('Joke of the day')}</div>
          <div className="chat__status">{t(revealed ? 'online' : 'typing…')}</div>
        </div>
      </div>
      <div className="chat__thread">
        {revealed ? (
          <div className="chat__bubble chat__bubble--small">
            <FittedText text={joke.setup} width={box.small.w} height={box.small.h} max={box.small.max} min={box.small.min} lineHeight={1.25} charWidth={0.56} className="chat__text" />
          </div>
        ) : (
          <div className="chat__bubble chat__bubble--question">
            <FittedText text={joke.setup} width={box.question.w} height={box.question.h} max={box.question.max} min={box.question.min} lineHeight={1.25} charWidth={0.56} className="chat__text" />
          </div>
        )}
        {revealed ? (
          <>
            <div className="chat__bubble chat__bubble--answer">
              <FittedText text={joke.punchline} width={box.answer.w} height={box.answer.h} max={box.answer.max} min={box.answer.min} lineHeight={1.12} charWidth={0.58} className="chat__text chat__text--answer" />
            </div>
            <div className="chat__time">{t('now')}</div>
            <div className="chat__reaction"><Laugh />{t('haha')}</div>
          </>
        ) : (
          <div className="chat__bubble chat__bubble--typing" role="img" aria-label={t('typing…')}>
            <span className="chat__dot" />
            <span className="chat__dot chat__dot--2" />
            <span className="chat__dot chat__dot--3" />
          </div>
        )}
      </div>
    </Stage>
  );
}

/** The strip formats get their own design (`./banner`); the others one plate. */
function Chat(props) {
  const { kind } = usePlate();
  return isBanner(kind) ? <Banner {...props} /> : <ChatPlate {...props} />;
}

export default Chat;
