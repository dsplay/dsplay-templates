import { useMemo } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import Style from '@style';
import Empty from '../empty';
import useReveal from '../../lib/use-reveal';
import { pickJoke, questionMs, readJokes } from '../../lib/model';

/**
 * Picks the joke of this play from the answer (`media.result`): `jokes[iteration % n]`. The question is alone on screen for `questionMs`, then the style
 * reveals the answer, which stays until the media ends. An answer with no usable joke shows one centered message.
 */
function Main() {
  const { result, iteration, duration } = useMedia();
  const jokes = useMemo(() => readJokes(result), [result]);
  const joke = pickJoke(jokes, iteration);
  const revealed = useReveal(questionMs(duration), joke);

  if (!joke) return <Empty />;
  return <Style joke={joke} revealed={revealed} />;
}

export default Main;
