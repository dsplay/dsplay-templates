// Mock data for local development only (never shipped as the real data).
// Try a scenario by URL, e.g. http://localhost:5186/?code=500&night=1&unit=fahrenheit&days=3
//   code=200|300|500|600|700|800|801|804|900 (current weather code; the forecast cycles through other codes)   night=1
//   days=0..7 (the forecast has 5 days by default; the template shows at most 5)   unit=celsius|fahrenheit   windunit=kmh|ms   wind=<m/s>|none
//   theme=dark|light|custom   bg=<css color> (with theme=custom)   solid=1 (weather_background=solid)   photo=1 (background photo)
//   fx=off (glass_effect=off)   city=<long name>   none=1 (no data)   outdated=1|nodata   humidity=none   sun=none   logo=1|broken   logourl=   showlogo=0
//   details=0 desc=0 minmax=0 showcity=0   debug=1   locale=pt_br
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
function flag(name, fallback) {
  return q(name, fallback ? '1' : '0') === '1' ? 'true' : 'false';
}

var dsplay_config = {
  locale: q('locale', 'pt_br'),
  osVersion: 23,
  appVersion: 40100,
  platform: 'ANDROID',
};

var codes = [500, 801, 800, 804, 300, 600, 700];
var night = q('night', '0') === '1';
var windValue = q('wind', '4.58');
var count = Number(q('days', 5));

var forecast = [];
for (var i = 0; i < count; i += 1) {
  var date = new Date(2026, 10, 15 + i);
  forecast.push({
    code: codes[i % codes.length],
    description: 'forecast ' + i,
    date: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
    min: 12 + i,
    max: 27 - i,
  });
}

var current = {
  code: Number(q('code', 800)),
  description: 'Condition from the service',
  humidity: q('humidity', '78') === 'none' ? undefined : 78,
  wind: windValue === 'none' ? undefined : Number(windValue),
  date: '2026-11-15',
  temp: 23,
  min: 12,
  max: 27,
  sunrise: q('sun', '') === 'none' ? undefined : (night ? '00:01' : '00:00'),
  sunset: q('sun', '') === 'none' ? undefined : (night ? '00:02' : '23:59'),
};

var dsplay_media = {
  duration: 30000,
  result: q('none', '0') === '1' ? undefined : {
    validity: q('outdated', '') === '1' ? '2026-11-14T10:00:00.000Z' : '2999-01-01T00:00:00.000Z',
    showOutdated: q('outdated', '') !== 'nodata',
    data: {
      lang: 'pt',
      weather: {
        city: q('city', 'São Paulo'),
        country: 'BR',
        current: current,
        forecast: forecast,
      },
    },
  },
};

var dsplay_template = {
  unit: q('unit', 'celsius'),
  wind_unit: q('windunit', 'kmh'),
  show_city: flag('showcity', true),
  show_description: flag('desc', true),
  show_min_max: flag('minmax', true),
  show_details: flag('details', true),
  theme: q('theme', 'dark'),
  weather_background: q('solid', '') === '1' ? 'solid' : 'auto',
  background_image: q('photo', '') === '1' ? 'test-assets/news-1.svg' : '',
  glass_effect: q('fx', 'auto'),
  // company logo: none by default (the DSPLAY default shows), upload ('1') or an upload that fails ('broken')
  logo: q('logo', '0') === '1' ? 'test-assets/logo.svg' : (q('logo', '0') === 'broken' ? 'test-assets/missing-logo.png' : ''),
  logo_url: q('logourl', '') === 'bad' ? 'javascript:alert(1)' : q('logourl', ''),
  show_logo: q('showlogo', '1') === '0' ? 'false' : 'true',
  debug: flag('debug', false),
};
if (q('bg', '')) {
  dsplay_template.background_color = q('bg', '');
}
