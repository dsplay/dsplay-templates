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
  kind, media, colors, insets, picture, showTitle, width, height,
}) {
  const host = useRef(null);
  const body = useRef(null);
  // A picture that cannot load gives its room back to the text.
  const [failed, setFailed] = useState(false);
  const withPicture = picture !== '' && !failed;
  const title = showTitle ? media.title || '' : '';

  // The margin follows the shorter side too: a percentage would be measured on the width and eat a wide, short region. A design's art takes room on some sides: the
  // margin there is at least that, so the text stays clear of the bands and drawings.
  const shorter = Math.min(width, height);
  const base = Math.round(shorter * (kind === 'long_post' ? 0.04 : 0.06));
  const margin = (side) => Math.max(base, Math.round(shorter * (insets?.[side] ?? 0)));
  const [top, right, bottom, left] = [margin('top'), margin('right'), margin('bottom'), margin('left')];
  // With a picture, a wide short region puts it on the left (a third of the width) and any other puts it on top (under half of the height); the text takes the rest.
  const wide = width / height > 1.8;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const gap = Math.round(base / 2);
  const pictureStyle = {
    width: wide ? Math.round(innerWidth * 0.34) : innerWidth,
    height: wide ? innerHeight : Math.round(innerHeight * 0.46),
    marginRight: wide ? gap : 0,
    marginBottom: wide ? 0 : gap,
    borderRadius: Math.round(shorter * 0.02),
  };
  const align = known(ALIGNS, media.align);
  const bodyStyle = align ? { textAlign: align, alignItems: ALIGNS[align] } : undefined;

  useLayoutEffect(() => {
    // A narrow tall region (a side strip) starts larger: 8% of its width would leave the text tiny.
    fit(host.current, body.current, Math.min(height * 0.2, width * (width / height < 0.6 ? 0.14 : 0.08)));
  });

  return (
    <div ref={host} className={`post ${kind}`} style={{ padding: `${top}px ${right}px ${bottom}px ${left}px`, flexDirection: withPicture && wide ? 'row' : 'column' }}>
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
