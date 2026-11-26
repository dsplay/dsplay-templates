// Dev only (never shipped: scripts/ is not part of the build): downloads a real RSS feed and writes
// public/test-assets/real-feed.json, which `public/dsplay-data.js` reads for the `?feed=real` scenario.
//
//   node scripts/fetch-feed.mjs [feed-url] [max-items] [file-name]      (npm run feed -- <feed-url> 40 real-feed-cnn.json)
//
// Default: G1 (https://g1.globo.com/rss/g1/). No dependency: a plain regex parse is enough for RSS 2.0.
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import plainText from '../src/util/text.js';

const url = process.argv[2] || 'https://g1.globo.com/rss/g1/';
const max = Number(process.argv[3]) || 40;
// third argument: file name inside public/test-assets (default real-feed.json), read in dev by `?feed=real&feed_file=<name>`
const fileName = (process.argv[4] || 'real-feed.json').replace(/[^\w.-]/g, '');
const out = resolve(import.meta.dirname, '..', 'public', 'test-assets', fileName.endsWith('.json') ? fileName : `${fileName}.json`);

const tag = (xml, name) => {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(xml);
  if (!m) {
    return '';
  }
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(m[1]);
  return cdata ? cdata[1] : m[1];
};
const all = (xml, name) => Array.from(xml.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'gi'))).map((m) => {
  const cdata = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/.exec(m[1]);
  return plainText(cdata ? cdata[1] : m[1]);
});
const attr = (xml, name, key) => {
  const m = new RegExp(`<${name}\\s[^>]*${key}="([^"]+)"`, 'i').exec(xml);
  return m ? m[1].replace(/&amp;/g, '&') : '';
};

function imageOf(item, rawDescription) {
  // WordPress feeds (CNN Brasil) carry the photos only in <content:encoded>
  const encoded = tag(item, 'content:encoded');
  const media = attr(item, 'media:content', 'url');
  const thumb = attr(item, 'media:thumbnail', 'url');
  const enclosure = /<enclosure\s[^>]*type="image[^"]*"[^>]*>/i.test(item) ? attr(item, 'enclosure', 'url') : '';
  const inline = (/<img\s[^>]*src=["']([^"']+)["']/i.exec(rawDescription) || /<img\s[^>]*src=["'](https?:[^"']+)["']/i.exec(encoded) || [])[1] || '';
  const found = media || enclosure || thumb || inline.replace(/&amp;/g, '&');
  // WordPress resizes by ?w=: ask for a size good enough for a full-width hero
  return /\/wp-content\/uploads\//.test(found) ? found.replace(/([?&])w=\d+/, '$1w=1024') : found;
}

const response = await fetch(url, { headers: { 'user-agent': 'dsplay-template-dev/1.0' } });
if (!response.ok) {
  console.error(`HTTP ${response.status} for ${url}`);
  process.exit(1);
}
const xml = await response.text();
const channelXml = xml.split(/<item[\s>]/i)[0];
const items = Array.from(xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)).map((m) => m[0]).slice(0, max).map((item) => {
  const rawDescription = tag(item, 'description');
  const image = imageOf(item, rawDescription);
  return {
    title: plainText(tag(item, 'title')),
    description: plainText(rawDescription),
    link: plainText(tag(item, 'link')),
    categories: all(item, 'category'),
    pubDate: plainText(tag(item, 'pubDate')),
    images: image ? [{ url: image }] : [],
  };
});

mkdirSync(resolve(out, '..'), { recursive: true });
writeFileSync(out, `${JSON.stringify({
  source: url,
  fetchedAt: new Date().toISOString(),
  channel: { title: plainText(tag(channelXml, 'title')), link: plainText(tag(channelXml, 'link')) },
  items,
}, null, 2)}\n`);
console.log(`${items.length} items (${items.filter((i) => i.images.length).length} with image) from ${url} -> ${out}`);
