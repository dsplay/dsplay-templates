// Mock data for local development. Any template variable goes in the URL, e.g.
//   http://localhost:5183/?theme=dark&zones_per_page=2&city_03=Tokyo&show_map=false&locale=en_US
//   n=1..8 keeps only the first n cities of the default list (default 8); page_interval=10 turns the pages faster.
// Resize the window (or use the browser's device emulation) to try each format.
(function () {
  var query = {};
  window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
    if (pair) {
      var kv = pair.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    }
  });

  window.dsplay_config = {
    locale: query.locale || 'pt_BR',
    osVersion: 23,
    appVersion: 99,
    timestamp: Date.now(),
  };

  window.dsplay_media = { duration: 30000 };

  var defaults = ['Local', 'Recife', 'Lisbon', 'London', 'Tokyo', 'Cairo', 'New York', 'Dubai'];
  var count = Math.max(1, Math.min(8, Number(query.n || 8)));
  var template = {};
  defaults.forEach(function (city, i) {
    template['city_0' + (i + 1)] = i < count ? city : '';
  });
  Object.keys(query).forEach(function (key) {
    if (['locale', 'n'].indexOf(key) < 0) {
      template[key] = query[key];
    }
  });
  window.dsplay_template = template;
})();
