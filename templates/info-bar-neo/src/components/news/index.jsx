import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import useRemote from '../../hooks/use-remote';
import getJson from '../../util/http';
import plainText from '../../util/text';
import Headline from './headline';
import './style.sass';

const REFRESH = 10 * 60 * 1000;

function News({ drop }) {
  const { t } = useTranslation();
  const { settings, stage, logos } = useView();
  const { rssUrl, theme, newsInterval } = settings;
  const [index, setIndex] = useState(0);

  const feed = useRemote(rssUrl ? `news:${rssUrl}` : '', () => getJson(
    `https://api.dsplay.tv/rss/last-news?url=${encodeURIComponent(rssUrl)}`,
  ).then((body) => {
    const data = body && body.data;
    const items = data && Array.isArray(data.items)
      ? data.items.map((item) => plainText(item && item.title)).filter(Boolean)
      : [];
    return items.length ? { items } : null;
  }), REFRESH);

  const total = feed ? feed.items.length : 0;
  useEffect(() => {
    if (total < 2) {
      return undefined;
    }
    const timer = setInterval(() => setIndex((i) => i + 1), newsInterval * 1000);
    return () => clearInterval(timer);
  }, [total, newsInterval]);

  if (!feed || (drop && drop.indexOf('news') >= 0)) {
    return null;
  }
  const text = feed.items[index % feed.items.length];
  const feedLogo = logos.feed;

  return (
    <div className="widget news" data-w="news" role="group" aria-label={t('News')}>
      {feedLogo.status !== 'none' && (
        <div className="feed-logo" style={{ visibility: feedLogo.status === 'ok' ? 'visible' : 'hidden', borderColor: theme.dark }}>
          {feedLogo.status === 'ok' && <img alt="" src={feedLogo.src} />}
        </div>
      )}
      {stage.set !== 'a' && <div className="marker" style={{ backgroundColor: theme.primary }} />}
      <Headline text={text} animate={settings.animationEnabled} />
    </div>
  );
}

export default News;
