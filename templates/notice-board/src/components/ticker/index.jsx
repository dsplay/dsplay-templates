import { useLayoutEffect, useRef, useState } from 'react';
import Blocks from '../blocks';
import './style.sass';

const MIN_SECONDS = 5;

// The ticker is one line: a line break in a post's text becomes a space.
const oneLine = (blocks) => (blocks || []).map((block) => (block && typeof block.text === 'string' ? { ...block, text: block.text.replaceAll(/\s*\n\s*/g, ' ') } : block));

// The title, when shown, opens the line in bold.
const lineOf = (media, showTitle) => {
  const blocks = oneLine(media.blocks);
  return showTitle && media.title ? [{ text: media.title, bold: true }, { text: '   •   ' }, ...blocks] : blocks;
};

// One line that scrolls from right to left, vertically centred: the post of the showing (the player picks one per showing, like the other formats).
// A picture stays put at the left, as a square thumbnail, and the line scrolls in the room that is left.
function Ticker({
  media, colors, speed, width, height, picture, showTitle,
}) {
  const track = useRef(null);
  const [seconds, setSeconds] = useState(null);
  // A picture that cannot load gives its room back to the line.
  const [failed, setFailed] = useState(false);
  const withPicture = picture !== '' && !failed;
  const margin = Math.round(height * 0.1);
  const size = Math.round(height * 0.8);
  const lane = width - (withPicture ? size + 2 * margin : 0);

  useLayoutEffect(() => {
    // Pixels per second; the line enters from the right edge and leaves through the left one.
    let duration = (track.current.offsetWidth + lane) / speed;
    // The player ends the showing after the media's duration, so a pass slower than that would be cut on its first words:
    // the whole line crosses within the showing, faster than the speed when it has to.
    const showing = ((media.duration || 0) / 1000) * 0.95;
    if (showing >= MIN_SECONDS && duration > showing) duration = showing;
    setSeconds(Math.max(duration, MIN_SECONDS));
  }, [media.duration, media.blocks, media.title, showTitle, speed, lane]);

  // 40% of the height, capped at 6% of the width: on a thin strip the height decides, on a big screen the width does.
  const fontSize = Math.max(12, Math.floor(Math.min(height * 0.4, width * 0.06)));
  const style = seconds === null ? undefined : { animationDuration: `${seconds}s`, WebkitAnimationDuration: `${seconds}s` };

  return (
    <div className="ticker" style={{ fontSize }}>
      {withPicture && (
        <div className="pic" style={{ width: size, height: size, margin: `0 ${margin}px`, borderRadius: Math.round(height * 0.08) }}>
          <img alt="" src={picture} onError={() => setFailed(true)} />
        </div>
      )}
      <div className="scroll">
        <div className={`lane${seconds === null ? '' : ' run'}`} style={style}>
          <div ref={track} className={`track${seconds === null ? '' : ' run'}`} style={style}>
            <Blocks blocks={lineOf(media, showTitle)} colors={colors} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticker;
