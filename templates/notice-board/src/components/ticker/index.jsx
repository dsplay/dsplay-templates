import { useLayoutEffect, useRef, useState } from 'react';
import Blocks from '../blocks';
import './style.sass';

const MIN_SECONDS = 5;

// The ticker is one line: a line break in a post's text becomes a space.
const oneLine = (blocks) => (blocks || []).map((block) => (block && typeof block.text === 'string' ? { ...block, text: block.text.replaceAll(/\s*\n\s*/g, ' ') } : block));

// One line that scrolls from right to left, vertically centred: the post of the showing (the player picks one per showing, like the other formats).
function Ticker({
  media, colors, speed, width, height,
}) {
  const track = useRef(null);
  const [seconds, setSeconds] = useState(null);

  useLayoutEffect(() => {
    // Pixels per second; the line enters from the right edge and leaves through the left one.
    let duration = (track.current.offsetWidth + width) / speed;
    // The player ends the showing after the media's duration, so a pass slower than that would be cut on its first words:
    // the whole line crosses within the showing, faster than the speed when it has to.
    const showing = ((media.duration || 0) / 1000) * 0.95;
    if (showing >= MIN_SECONDS && duration > showing) duration = showing;
    setSeconds(Math.max(duration, MIN_SECONDS));
  }, [media.duration, media.blocks, speed, width]);

  // 40% of the height, capped at 6% of the width: on a thin strip the height decides, on a big screen the width does.
  const fontSize = Math.max(12, Math.floor(Math.min(height * 0.4, width * 0.06)));
  const style = seconds === null ? undefined : { animationDuration: `${seconds}s`, WebkitAnimationDuration: `${seconds}s` };

  return (
    <div className="ticker" style={{ fontSize }}>
      <div ref={track} className={`track${seconds === null ? '' : ' run'}`} style={style}>
        <Blocks blocks={oneLine(media.blocks)} colors={colors} />
      </div>
    </div>
  );
}

export default Ticker;
