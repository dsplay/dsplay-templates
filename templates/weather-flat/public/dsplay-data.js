// Mock data for local development only (never shipped as the real data).
// Scenarios by URL, e.g. http://localhost:5187/?code=500&night=1&unit=fahrenheit&days=3
//   wind=kmh|ms  windms=<m/s value, default 4.58>  code=<weather code>  night=1  unit=celsius|fahrenheit  days=<items in the forecast, default 5; 0-8>
//   result=none (no data)  outdated=1 (validity in the past)  showoutdated=0  nodetails=1 (no humidity/wind/sun)  city=long
//   theme=light|dark|custom  bg=<css color> (custom)  wbg=solid  logo=1|broken  logourl=<url>|bad  showlogo=0
//   showcity=0 showdesc=0 showminmax=0 showdetails=0  locale=pt_BR|en_us|es_ES  rounded=0  nofc=1 (no forecast key)
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
function bool(name, fallback) {
  return q(name, fallback ? '1' : '0') === '0' ? 'false' : 'true';
}
function pad(n) {
  return n < 10 ? '0' + n : String(n);
}
function hhmm(minutes) {
  var m = Math.max(0, Math.min(1439, minutes));
  return pad(Math.floor(m / 60)) + ':' + pad(m % 60);
}
function isoDay(offset) {
  var d = new Date();
  d.setDate(d.getDate() + offset);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

var dsplay_config = {
  locale: q('locale', 'pt_BR'),
  osVersion: 23,
  appVersion: 40100,
  platform: 'ANDROID',
};

var now = new Date();
var nowMin = now.getHours() * 60 + now.getMinutes();
var night = q('night', '') === '1';
var codes = [801, 500, 800, 600, 804, 211, 741, 300];
var count = Number(q('days', 5));
var forecast = [];
for (var i = 0; i < count; i += 1) {
  forecast.push({
    code: codes[i % codes.length],
    description: 'Forecast ' + (i + 1),
    icon: 'c01',
    humidity: 56,
    wind: 3.99,
    date: isoDay(i),
    value: 27 - i,
    min: 12 + i,
    max: 27 - i + (i % 2),
  });
}

var weather = {
  city: q('city', '') === 'long' ? 'Auerbach in der Oberpfalz, Baviera' : 'Lisboa',
  country: 'PT',
  current: {
    code: Number(q('code', 801)),
    description: 'Few clouds',
    icon: 'c02',
    humidity: q('nodetails', '') === '1' ? undefined : 78,
    wind: q('nodetails', '') === '1' ? undefined : Number(q('windms', 4.58)),
    date: isoDay(0),
    value: 23,
    temp: 23,
    min: 12,
    max: 27,
    sunrise: q('nodetails', '') === '1' ? undefined : (night ? hhmm(nowMin + 60) : hhmm(nowMin - 180)),
    sunset: q('nodetails', '') === '1' ? undefined : (night ? hhmm(nowMin + 120) : hhmm(nowMin + 180)),
  },
};
if (q('nofc', '') !== '1') {
  weather.forecast = forecast;
}

var dsplay_media = {
  duration: 30000,
  result: q('result', '') === 'none' ? undefined : {
    validity: q('outdated', '') === '1' ? new Date(Date.now() - 7200000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
    showOutdated: q('showoutdated', '1') !== '0',
    data: { lang: 'pt', weather: weather },
  },
};

var dsplay_template = {
  unit: q('unit', 'celsius'),
  wind_unit: q('wind', 'kmh'),
  show_city: bool('showcity', true),
  show_description: bool('showdesc', true),
  show_min_max: bool('showminmax', true),
  show_details: bool('showdetails', true),
  theme: q('theme', 'light'),
  weather_background: q('wbg', 'auto'),
  rounded_corners: bool('rounded', true),
  // no operator logo by default: the DSPLAY logo shows; ?logo=1 sends a test logo, ?logo=broken a failing one
  logo: q('logo', '0') === '1' ? 'test-assets/logo.svg' : (q('logo', '0') === 'broken' ? 'test-assets/missing-logo.png' : ''),
  logo_url: q('logourl', '') === 'bad' ? 'javascript:alert(1)' : q('logourl', ''),
  show_logo: bool('showlogo', true),
  debug: 'false',
};
if (q('bg', '')) {
  dsplay_template.background_color = q('bg', '');
}
