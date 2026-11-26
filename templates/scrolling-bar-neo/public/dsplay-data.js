// Mock data for local development only (never shipped as the real data).
// Try a scenario by URL, e.g. http://localhost:5182/?theme=dark&source=text&speed=fast&strong=1
//   source=text|rss|both   text=<a|b|c> (ticker_text)   rss=<feed url>   limit=1..30   sep=dot|bar|diamond
//   clock=0|1   date=0|1   h12=1   logo=1|broken (test upload; no parameter = the DSPLAY default)   logourl=<public url>|bad   showlogo=0|1   rsslogo=0|1   rsslogourl=<url>   pos=top|center|bottom   theme=light|dark|custom   bg=<css color> (theme=custom)
//   weather=0|1 (latitude/longitude, F=1 for fahrenheit)   order=<clock,weather,news,sponsor>   strong=1   rounded=0|1   anim=0|1   speed=slow|normal|fast   debug=1   locale=pt_br
// The window size picks the format: 1920x120 / 1920x52 (bar), 1920x480 (wide), 1920x1080, 1080x1920, 1080x1080, 200x1920 (vertical).
var query = {};
(typeof location !== 'undefined' ? location.search.replace(/^\?/, '') : '').split('&').forEach(function (pair) {
  if (pair) {
    var kv = pair.split('=');
    query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
  }
});
function q(name, fallback) {
  return query[name] === undefined ? fallback : query[name];
}
function bool(name, fallback) {
  return q(name, fallback ? '1' : '0') === '1' ? 'true' : 'false';
}

var dsplay_config = {
  locale: q('locale', 'pt_br'),
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 23,
  // DSPLAY App version code
  appVersion: 40100,
  platform: 'ANDROID',
};

var dsplay_media = {
  id: 1,
  name: 'Barra com rolagem',
  count: 1,
  iteration: 0,
  duration: 30000,
  title: 'Barra com rolagem',
};

var dsplay_template = {
  ticker_source: q('source', 'text'),
  ticker_text: q('text', 'Prefeitura anuncia novo calendário de obras para o centro | Seleção vence amistoso por 3 a 0 | Cientistas descobrem sapo que brilha no escuro na Mata Atlântica | Ônibus terão novo horário a partir de segunda-feira | Feira de ciências recebe alunos de toda a região'),
  rss_url: q('rss', ''),
  ticker_item_limit: q('limit', '8'),
  ticker_separator: q('sep', 'dot'),
  show_clock: bool('clock', true),
  show_date: bool('date', true),
  time_format: q('h12', '') === '1' ? '12h' : '24h',
  latitude: q('weather', '1') === '1' ? '-23.55' : '',
  longitude: q('weather', '1') === '1' ? '-46.63' : '',
  weather_unit: q('F', '') === '1' ? 'fahrenheit' : 'celsius',
  widgets_order: q('order', ''),
  // company logo: none by default (the DSPLAY default shows), upload ('1') or an upload that fails ('broken'); logourl: public link ('bad' = javascript:)
  logo: q('logo', '0') === '1' ? 'test-assets/logo.svg' : (q('logo', '0') === 'broken' ? 'test-assets/missing-logo.png' : ''),
  logo_url: q('logourl', '') === 'bad' ? 'javascript:alert(1)' : q('logourl', ''),
  show_logo: q('showlogo', '1') === '0' ? 'false' : 'true',
  rss_logo: q('rsslogo', '0') === '1' ? 'test-assets/news-circle.svg' : '',
  rss_logo_url: q('rsslogourl', ''),
  color_logo_background: '#FFFFFF',
  layout_position: q('pos', 'center'),
  theme: q('theme', 'light'),
  relief_strength: q('strong', '') === '1' ? 'strong' : 'normal',
  rounded_corners: bool('rounded', true),
  animation_enabled: bool('anim', true),
  animation_speed: q('speed', 'normal'),
  debug: bool('debug', false),
};
if (q('bg', '')) {
  dsplay_template.background_color = q('bg', '');
}
