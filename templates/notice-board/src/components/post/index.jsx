import { useLayoutEffect, useRef, useState } from 'react';
import { ALIGNS, known } from '../../lib/post-look';
import Blocks from '../blocks';
import './style.sass';

// The largest size the region allows, then smaller until neither the height nor the width overflows (never under 10 px).
// The size is set on `host` and what has to fit is `box`, the body that holds the title and the text.
function fit(host, box, largest) {
  let size = Math.max(10, Math.floor(largest));
  host.style.fontSize = `${size}px`;
  while (size > 10 && (box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1)) {
    size = Math.max(10, Math.floor(size * 0.92));
    host.style.fontSize = `${size}px`;
  }
}

// The card (a framed message in the middle of the region) and the long post (a heading and left-aligned text, like a paper notice): an optional picture
// beside or above the text, the title and the blocks, all sized to fit the region.
function Post({
  kind, media, colors, picture, showTitle, width, height,
}) {
  const host = useRef(null);
  const body = useRef(null);
  // A picture that cannot load gives its room back to the text.
  const [failed, setFailed] = useState(false);
  const withPicture = picture !== '' && !failed;
  const title = showTitle ? media.title || '' : '';

  // The margin follows the shorter side too: a percentage would be measured on the width and eat a wide, short region.
  const pad = Math.round(Math.min(width, height) * (kind === 'long_post' ? 0.04 : 0.06));
  // With a picture, a wide short region puts it on the left (a third of the width) and any other puts it on top (under half of the height); the text takes the rest.
  const wide = width / height > 1.8;
  const innerWidth = width - pad * 2;
  const innerHeight = height - pad * 2;
  const gap = Math.round(pad / 2);
  const pictureStyle = {
    width: wide ? Math.round(innerWidth * 0.34) : innerWidth,
    height: wide ? innerHeight : Math.round(innerHeight * 0.46),
    marginRight: wide ? gap : 0,
    marginBottom: wide ? 0 : gap,
    borderRadius: Math.round(Math.min(width, height) * 0.02),
  };
  const align = known(ALIGNS, media.align);
  const bodyStyle = align ? { textAlign: align, alignItems: ALIGNS[align] } : undefined;

  useLayoutEffect(() => {
    fit(host.current, body.current, Math.min(height * 0.2, width * 0.08));
  });

  return (
    <div ref={host} className={`post ${kind}`} style={{ padding: pad, flexDirection: withPicture && wide ? 'row' : 'column' }}>
      {withPicture && (
        <div className="pic" style={pictureStyle}>
          <img alt="" src={picture} onError={() => setFailed(true)} />
        </div>
      )}
      <div ref={body} className="body" style={bodyStyle}>
        {title !== '' && <div className="title">{title}</div>}
        <div className="text"><Blocks blocks={media.blocks} colors={colors} /></div>
      </div>
    </div>
  );
}

export default Post;
