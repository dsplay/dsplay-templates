// Mock data for local development. Scenarios by URL, e.g. http://localhost:5185/?code=500&night=1&unit=fahrenheit&days=5
//   code=800|801|804|500|600|700|300|200|900   night=1   days=0..5 (forecast entries)   empty=1 (no media.result)
//   outdated=1   locale=en_US   plus any template variable: theme=dark, relief_strength=strong, show_logo=false, logo_url=...
(function () {
  var query = {};
  window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
    if (pair) {
      var kv = pair.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    }
  });

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function ymd(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); }

  var code = Number(query.code || 500);
  var night = query.night === '1';
  var days = query.days === undefined ? 5 : Number(query.days);
  var codes = [801, 500, 800, 600, 804];
  var forecast = [];
  for (var i = 0; i < days; i += 1) {
    var d = new Date();
    d.setDate(d.getDate() + i + 1);
    forecast.push({
      code: codes[i % codes.length],
      description: 'forecast',
      date: ymd(d),
      min: 12 + i,
      max: 27 + i * 2 - (i % 2) * 3,
    });
  }

  var validity = new Date(Date.now() + (query.outdated === '1' ? -90 * 60000 : 3600000)).toISOString();

  window.dsplay_config = {
    locale: query.locale || 'pt_BR',
    osVersion: 23,
    appVersion: 99,
  };

  window.dsplay_media = {
    duration: 30000,
    result: query.empty === '1' ? undefined : {
      validity: validity,
      showOutdated: query.show_outdated !== 'false',
      data: {
        lang: 'pt',
        weather: {
          city: query.city || 'Auerbach in der Oberpfalz',
          country: 'DE',
          current: {
            code: code,
            description: 'Service description',
            icon: 'c01',
            humidity: 78,
            wind: 4.58,
            date: ymd(new Date()),
            value: 23,
            temp: 23,
            min: 12,
            max: 27,
            sunrise: night ? '23:58' : '00:01',
            sunset: night ? '23:59' : '23:57',
          },
          forecast: forecast,
        },
      },
    },
  };

  var template = { unit: 'celsius' };
  Object.keys(query).forEach(function (key) {
    if (['code', 'night', 'days', 'empty', 'outdated', 'locale', 'city', 'show_outdated', 'measure'].indexOf(key) < 0) {
      template[key] = query[key];
    }
  });
  window.dsplay_template = template;

  if (query.measure === '1') {
    var script = document.createElement('script');
    script.src = './test-assets/measure.js';
    document.head.appendChild(script);
  }
}());
