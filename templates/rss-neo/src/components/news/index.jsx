import { useEffect, useMemo } from 'react';
import { useConfig, useMedia } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import { currentNews, cardNews } from '../../util/news';
import { cardCount } from '../../util/geometry';
import { itemsOf, pickItem } from '../../util/rss-item';
import Hero from '../hero';
import Cards from '../cards';
import BarH from '../bar-h';
import BarV from '../bar-v';

const CARD_FORMATS = ['landscape', 'portrait'];

/** Picks the layout of the format and gives it the item(s) of this showing. */
function News() {
  const media = useMedia();
  const config = useConfig();
  const { stage, settings } = useView();
  const { format } = stage;

  const news = useMemo(() => currentNews(media, config), [media, config]);
  const items = useMemo(
    () => (settings.layout === 'cards' && CARD_FORMATS.indexOf(format) !== -1
      ? cardNews(media, config, cardCount(format, 3))
      : []),
    [media, config, settings.layout, format],
  );

  // warm the cache with the photo of the next showing
  const nextImage = useMemo(() => {
    const list = itemsOf(media);
    const next = pickItem(list, (Number(media.iteration) || 0) + 1);
    const image = next && Array.isArray(next.images) && next.images[0];
    return image ? image.url : '';
  }, [media]);
  useEffect(() => {
    if (nextImage) {
      const img = new Image();
      img.src = nextImage;
    }
  }, [nextImage]);

  const fallback = (format === 'portrait' || format === 'square') && settings.backgroundImagePortrait
    ? settings.backgroundImagePortrait
    : settings.backgroundImage;
  const photos = [news.image, fallback].filter(Boolean);

  if (format === 'bar-h') {
    return <BarH news={news} />;
  }
  if (format === 'bar-v') {
    return <BarV news={news} />;
  }
  if (items.length >= 2) {
    return <Cards items={items} photos={[items[0].image, fallback].filter(Boolean)} />;
  }
  return <Hero news={news} photos={photos} />;
}

export default News;
