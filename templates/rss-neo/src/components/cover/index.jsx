import { useState } from 'react';
import { useView } from '../../hooks/view-context';
import { rectStyle } from '../../util/geometry';
import Photo from '../photo';
import './style.sass';

/**
 * The hero: the photo covers the rectangle, which the layouts make as wide as the window (stage = window): it bleeds to the
 * edges in any proportion, with no frame, radius or shadow, under a flat veil. Content stays inside the 4 rem safe margins.
 * `sources` are tried in order (item photo, then the operator's default photo); with none left the cover is flat
 * `color_primary` without veil and the content uses `onPrimary`. `children(ink, onPhoto)` renders the content.
 */
function Cover({ rect, sources, children }) {
  const { theme, settings } = useView();
  const [failed, setFailed] = useState([]);
  const src = sources.filter((s) => s && failed.indexOf(s) === -1)[0];

  return (
    <div className="cover" style={{ ...rectStyle(rect), backgroundColor: src ? '#15181D' : theme.primary }}>
      {src && (
        <Photo
          key={src}
          src={src}
          frameRatio={rect.w / rect.h}
          onError={() => setFailed((list) => list.concat(src))}
        />
      )}
      {src && <div className="veil" style={{ backgroundColor: `rgba(0,0,0,${settings.veil})` }} />}
      <div className="content">{children(src ? '#FFFFFF' : theme.onPrimary, Boolean(src))}</div>
    </div>
  );
}

export default Cover;
