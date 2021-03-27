import React, { useState, useEffect } from 'react';
import { tval } from '@dsplay/template-utils';
import Parser from 'rss-parser';
import rssLogo from '../rss.png';
import axios from 'axios';

const url = tval('rss_url');
const logoBoxColor = tval('rss_logo_box_color');
const parser = new Parser();
const KEY_VERSION = 'news_version';
const VERSION = '1.0';

function NewsContent() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState({});
  const [item, setItem] = useState({});
  const [error, setError] = useState();

  const storageKey = 'news-' + url;
  // const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const CORS_PROXY = 'https://api.allorigins.win/get';

  useEffect(() => {
    const interval = setInterval(() => setCount(count + 1), 1000 * 30);

    if (count % 10 === 0) {
      let news = undefined;
      const storedNews = localStorage.getItem(storageKey);
      const storedVersion = localStorage.getItem(KEY_VERSION);

      console.log('Getting news');

      if (storedNews) {
        try {
          news = JSON.parse(storedNews);
        } catch (e) {
          localStorage.removeItem(storageKey);
          console.error('Error parsing stored value: ' + storedNews);
        }
      }

      if (storedVersion !== VERSION || !news || (new Date().getTime() - news.timestamp > 1000 * 60 * 9)) {
        (async () => {
          try {
            const response = await axios.get(CORS_PROXY, {
              params: {
                url,
              },
            })
            const feed = await parser.parseString(response.data.contents);

            setResult(feed);

            localStorage.setItem(storageKey, JSON.stringify({
              timestamp: new Date().getTime(),
              value: feed,
            }));
            localStorage.setItem(KEY_VERSION, VERSION.toString());
          } catch (e) {
            console.error(e);
            setError(e);
            localStorage.removeItem(storageKey);
          }
        })();
      } else {
        setResult(news.value);
      }
    }

    return () => clearInterval(interval);
  }, [count, storageKey]);

  useEffect(() => {
    console.log(count)

    if (result && result.items && result.items.length > 0) {
      setItem(result.items[Math.floor(Math.random() * result.items.length)]);
    }
  }, [count, result]);

  if (error) {
    return <div className="block news" />;
  }

  const sizeMap = {
    '20': 3,
    '50': 2.5,
    '75': 2.2,
    '100': 1.8,
    '120': 1.5,
    '140': 1.3,
    '200': 1.2,
  };

  if (item && item.title) {

    let ratio = 1;

    const sizeKeys = Object.keys(sizeMap);
    for (let i = 0; i < sizeKeys.length; i++) {
      if (item.title.length <= +sizeKeys[i]) {
        ratio = sizeMap[sizeKeys[i]];
        break;
      }
    }

    const {
      image: {
        url = rssLogo,
      } = {},
    } = result;

    return (
      <div className="block news">
        <div className="channel" style={{ backgroundImage: `url('${url}')`, backgroundColor: logoBoxColor }}></div>
        <div className="title" style={{ fontSize: `${ratio}em` }}>{item.title}</div>
      </div>
    )
  }

  return <div className="block news" />;
}

function News() {

  if (!url) return null;

  return <NewsContent />;
}

export default News;