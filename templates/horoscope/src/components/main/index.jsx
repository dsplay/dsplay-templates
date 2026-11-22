import { useMemo, useState } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import Style, { PER_SCREEN } from '@style';
import Empty from '../empty';
import {
  pickSigns, readSigns, screenIndexOf, screensOf,
} from '../../lib/model';

/**
 * Picks what this play shows from the answer (`media.result`) and hands it to the style: the sign `iteration % 12`, or the pair `iteration % 6` for the
 * styles that draw two signs a screen. An answer with no usable sign shows one centered message.
 */
function Main() {
  const { result, iteration } = useMedia();
  // the player's own date, read once: the screen does not change at midnight while it is playing
  const [today] = useState(() => new Date());
  const all = useMemo(() => readSigns(result), [result]);
  const signs = pickSigns(all, iteration, PER_SCREEN);

  if (signs.length === 0) return <Empty />;
  return (
    <Style
      signs={signs}
      today={today}
      screen={screenIndexOf(all.length, iteration, PER_SCREEN)}
      screens={screensOf(all.length, PER_SCREEN)}
    />
  );
}

export default Main;
