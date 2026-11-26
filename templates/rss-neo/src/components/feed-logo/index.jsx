import { useState } from 'react';
import { useView } from '../../hooks/view-context';
import './style.sass';

/**
 * The logo of the feed (rss_logo, else rss_logo_url): a small, discreet flat circle with a 0.15 rem ring. No default logo: with
 * no upload/link, or if they fail, nothing is rendered. `onPhoto`: white background (a dark logo would vanish over the photo)
 * and a faint ring; in bars the background is transparent and the ring is the theme's border. The room is kept while it loads.
 * @param {number} size diameter, rem
 */
function FeedLogo({ size, onPhoto, className }) {
  const { feedLogo, theme } = useView();
  const [broken, setBroken] = useState('');
  if (!feedLogo.pending && (!feedLogo.src || broken === feedLogo.src)) {
    return null;
  }
  const box = {
    width: `${size}rem`,
    height: `${size}rem`,
    border: `0.15rem solid ${onPhoto ? 'rgba(21,22,24,0.10)' : theme.border}`,
    backgroundColor: onPhoto ? '#FFFFFF' : 'transparent',
  };
  return (
    <div className={`feed-logo ${className || ''}`} style={box}>
      {!feedLogo.pending && (
        <img src={feedLogo.src} alt="" onError={() => setBroken(feedLogo.src)} />
      )}
    </div>
  );
}

export default FeedLogo;
