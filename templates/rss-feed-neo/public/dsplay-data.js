// Mock data for local development only (never shipped as the real data).
// Try a scenario by URL, e.g. http://localhost:5184/?feed=real&iteration=3&theme=dark
//   theme=light|dark|custom   bg=<css color> (with theme=custom)   clock=0|1   h12=1
//   dlen=short|mid|long (description length)   headline=40|90|140 (characters)   items=0|1|2|4|8 (gateway items; 0 = flat keys only)   iteration=<n>
//   feed=real[&feed_file=cnn] (real feed saved by `npm run feed`; iteration=<n> picks the news)   image=0|1|white (item photo)   link=0|1   desc=0|1   category=0|1   logo=0|1|broken   showlogo=0   logourl=<public url>|bad   photo=<url> (default photo)   legacy=1
var query = {};
(typeof location !== 'undefined' ? location.search.replace(/^\?/, '') : '').split('&').forEach(function (pair) {
  if (pair) {
    var kv = pair.split('=');
    query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
  }
});
function q(name, fallback) {
  return query[name] === undefined ? fallback : query[name];
}

var dsplay_config = {
  // config parameters
  locale: q('locale', 'pt_br'),
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 23,
  // DSPLAY App version code
  appVersion: 40100,
  platform: 'ANDROID',
};

var titles = [
  'Prefeitura anuncia novo calendário de obras para o centro da cidade',
  'Seleção brasileira vence amistoso e embala para a próxima rodada de eliminatórias com três gols no segundo tempo',
  'Cientistas descobrem espécie de sapo que brilha no escuro na Mata Atlântica e preparam relatório para publicação internacional ainda neste ano com apoio de universidades de três países',
];
var base = 'Prefeitura anuncia obras no centro da cidade. ';
function headline(index) {
  var size = Number(q('headline', 90));
  var text = (size <= 40 ? 'Obras no centro mudam o trânsito' : size >= 140 ? titles[2] : titles[0]) + (index ? ' (' + (index + 1) + ')' : '');
  return text;
}

var categories = ['Cidades', 'Esporte', 'Ciência', 'Economia', 'Cultura', 'Saúde', 'Brasil', 'Mundo'];
function description() {
  var mid = base + 'Segundo o secretário, as intervenções começam na próxima semana &amp; devem durar três meses. &#36; 2 milhões em investimento. Os moradores serão avisados com antecedência.';
  var size = q('dlen', 'mid');
  if (size === 'short') {
    return 'Obras começam na próxima semana.';
  }
  return size === 'long' ? mid + ' ' + mid + ' ' + mid : mid;
}

function item(index) {
  var image = q('image', '1');
  return {
    title: headline(index),
    description: description(),
    content: 'Conteúdo da notícia',
    link: q('link', '1') === '0' ? '' : 'https://dsplay.tv/noticia/' + (index + 1),
    categories: q('category', '1') === '0' ? [] : [categories[index % categories.length]],
    images: image === '0' ? [] : [{ url: image === 'white' ? 'test-assets/news-white.svg' : 'test-assets/news-' + ((index % 8) + 1) + '.svg', title: 'Foto ' + (index + 1) }],
  };
}

// ?feed=real: a real feed saved by `npm run feed` (scripts/fetch-feed.mjs) in test-assets/real-feed.json. Without the file, the mock below is used.
function realFeed() {
  if (q('feed', '') !== 'real' || typeof XMLHttpRequest === 'undefined') {
    return null;
  }
  try {
    var request = new XMLHttpRequest();
    // ?feed_file=cnn reads test-assets/real-feed-cnn.json (saved by `npm run feed -- <url> 40 real-feed-cnn.json`)
    var name = q('feed_file', '') ? 'real-feed-' + q('feed_file', '').replace(/[^\w.-]/g, '') + '.json' : 'real-feed.json';
    request.open('GET', 'test-assets/' + name, false);
    request.send();
    return request.status === 200 ? JSON.parse(request.responseText) : null;
  } catch (e) {
    return null;
  }
}
var feed = realFeed();

var count = Number(q('items', 8));
var items = [];
for (var i = 0; i < count; i += 1) {
  items.push(item(i));
}
if (feed && feed.items && feed.items.length) {
  items = feed.items;
  count = items.length;
}

var dsplay_media = {
  id: 1,
  name: 'RSS Cidade',
  count: 1,
  iteration: Number(q('iteration', 0)),
  duration: 15000,
  title: feed ? feed.channel.title : 'Notícias da Cidade',
  // the gateway's own body; with items=0 the flat keys below are used (as the Android player sends them)
  result: count ? { validity: '2026-11-15T12:00:00.000Z', showOutdated: true, data: { title: feed ? feed.channel.title : 'Notícias da Cidade', link: feed ? feed.channel.link : 'https://dsplay.tv', items: items } } : undefined,
};
if (!count) {
  var flat = item(0);
  dsplay_media.itemTitle = flat.title;
  dsplay_media.itemDescription = flat.description;
  dsplay_media.link = flat.link || undefined;
  dsplay_media.categories = flat.categories;
  dsplay_media.hasImage = flat.images.length > 0;
  dsplay_media.imageUrl = flat.images.length ? flat.images[0].url : undefined;
  dsplay_media.source = 'Feed';
}

var dsplay_template = {
  show_clock: q('clock', '1') === '1' ? 'true' : 'false',
  clock_format: q('h12', '') === '1' ? '12h' : '24h',
  theme: q('theme', 'light'),
  show_description: q('desc', '1') === '1' ? 'true' : 'false',
  show_category: 'true',
  show_qr_code: 'true',
  // logo: upload ('1'), none ('0') or an upload that fails ('broken'); logourl: public link (valid, or 'bad' = javascript:), tried when the upload is absent/fails
  logo: q('logo', '0') === '1' ? 'test-assets/logo.svg' : (q('logo', '0') === 'broken' ? 'test-assets/missing-logo.png' : ''),
  logo_url: q('logourl', '') === 'bad' ? 'javascript:alert(1)' : q('logourl', ''),
  background_image: q('photo', ''),
  photo_fit: q('fit', ''),
  rss_logo: q('rsslogo', '0') === '1' ? 'test-assets/news-circle.svg' : '',
  rss_logo_url: q('rsslogourl', ''),
  show_logo: q('showlogo', '1') === '0' ? 'false' : 'true',
  debug: 'false',
};
if (q('bg', '')) {
  dsplay_template.background_color = q('bg', '');
}
if (q('legacy', '') === '1') {
  // keys of the previous RSS template
  dsplay_template = { bg_color: '#222', title_bg_color: 'darkorange', text_color: 'white', text_bg_color: '#111', bg: q('photo', ''), logo: dsplay_template.logo, logo_url: dsplay_template.logo_url };
}
