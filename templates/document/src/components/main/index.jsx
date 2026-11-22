import { useMedia, useTemplateVal, useTemplateIntVal } from '@dsplay/react-template-utils';
import Paged from '../paged';
import Scrolling from '../scrolling';
import './style.sass';

const DEFAULT_DURATION_MS = 30000;
const DEFAULT_END_MARGIN_MS = 2000;
const DEFAULT_TRANSITION_MS = 500;

function Main() {
  const media = useMedia();
  const images = media.images || [];
  const durationMs = media.duration > 0 ? media.duration : DEFAULT_DURATION_MS;
  const mode = useTemplateVal('mode', 'paged');
  const transition = useTemplateVal('transition', 'fade');
  const transitionMs = useTemplateIntVal('transitionMs', DEFAULT_TRANSITION_MS);
  const fit = useTemplateVal('fit', 'contain') === 'cover' ? 'cover' : 'contain';
  const background = useTemplateVal('background', '#000000');
  const endMarginMs = useTemplateIntVal('endMarginMs', DEFAULT_END_MARGIN_MS);

  return (
    <div className="main" style={{ backgroundColor: background }}>
      {mode === 'scroll'
        ? <Scrolling images={images} durationMs={durationMs} endMarginMs={endMarginMs} />
        : (
          <Paged
            images={images}
            durationMs={durationMs}
            endMarginMs={endMarginMs}
            transition={transition}
            transitionMs={transitionMs}
            fit={fit}
          />
        )}
    </div>
  );
}

export default Main;
