import { useMemo } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import Style from '@style';
import Empty from '../empty';
import { isoOf, viewOf } from '../../lib/model';

/**
 * What this play shows, from the answer (`media.result`) and the screen's own clock: the holiday that is on, else the next one, as the style draws it. An answer with no
 * holiday (and none on) shows one centered message.
 */
function Main() {
  const { result } = useMedia();
  const view = useMemo(() => viewOf(result, isoOf(new Date())), [result]);

  if (view.empty) return <Empty />;
  return <Style view={view} />;
}

export default Main;
