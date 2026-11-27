// Mock data for local development. Any template variable goes in the URL, e.g.
//   http://localhost:5183/?theme=dark&clock_theme=aluminum&color_face=%23888888&time_zone=Asia/Tokyo&locale=en_US
//   scenarios: ?w=1920&h=480 is NOT read here: resize the window (or use the browser's device emulation).
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
  };

  window.dsplay_media = { duration: 30000 };

  var template = {};
  Object.keys(query).forEach(function (key) {
    if (['locale'].indexOf(key) < 0) {
      template[key] = query[key];
    }
  });
  window.dsplay_template = template;
})();
