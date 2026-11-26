import { useEffect, useMemo } from 'react';
import { useConfig, useMedia } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import { feedStories, nextImages } from '../../util/feed';
import Landscape from '../landscape';
import Portrait from '../portrait';
import Square from '../square';
import Wide from '../wide';
import BarH from '../bar-h';
import BarV from '../bar-v';
import Empty from '../empty';

/** Picks the layout of the format and gives it the stories of this showing (N1, N2, N3). */
function News() {
  const media = useMedia();
  const config = useConfig();
  const { stage, settings } = useView();
  const { format } = stage;

  const stories = useMemo(() => feedStories(media, config), [media, config]);

  // warm the cache with the photos of the next showing
  const upcoming = useMemo(() => nextImages(media), [media]);
  useEffect(() => {
    upcoming.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [upcoming]);

  const small = format === 'portrait' || format === 'square';
  const fallbackPhoto = small && settings.backgroundImagePortrait ? settings.backgroundImagePortrait : settings.backgroundImage;

  if (format === 'bar-h') {
    return <BarH news={stories[0] || {}} />;
  }
  if (format === 'bar-v') {
    return <BarV news={stories[0] || {}} />;
  }
  if (stories.length === 0) {
    return <Empty />;
  }
  const props = { stories, fallbackPhoto };
  if (format === 'portrait') {
    return <Portrait {...props} />;
  }
  if (format === 'square') {
    return <Square {...props} />;
  }
  if (format === 'wide') {
    return <Wide {...props} />;
  }
  return <Landscape {...props} />;
}

export default News;
