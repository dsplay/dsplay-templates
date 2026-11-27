// Mock data for local development. Scenarios by URL, e.g. http://localhost:5181/?auth=none&hidden=1
//   ssid=...  password=...  auth=none|wpa|wpa2|sae|wep  hidden=1  empty=1 (no ssid)  long=1 (very long ssid and password)
//   special=1 (ssid and password with ; , : \ ")  locale=en_US  plus any template variable: theme=dark,
//   background_color=%23777777, relief_strength=strong, show_logo=false, logo_url=..., animation_enabled=false
(function () {
  var query = {};
  window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
    if (pair) {
      var kv = pair.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    }
  });

  var ssid = query.ssid || 'Customer Wifi';
  var password = query.password === undefined ? 'wifi-password-123' : query.password;
  if (query.long === '1') {
    ssid = 'Rede-Convidados-Andar-12-Bloco-B-Torre-Norte';
    password = 'uma-senha-muito-longa-para-testar-o-corte-do-texto-123456789';
  }
  if (query.special === '1') {
    ssid = 'Café;Bar,"1":ok';
    password = 'p\\ss;w,o:r"d';
  }
  if (query.empty === '1') {
    ssid = '';
  }

  window.dsplay_config = {
    locale: query.locale || 'pt_BR',
    osVersion: 23,
    appVersion: 99,
  };

  window.dsplay_media = {
    duration: 30000,
    ssid: ssid,
    password: password,
    auth_type: query.auth || 'wpa',
    hidden: query.hidden === '1',
  };

  var template = {
    qr_code_dot_scale: '1',
  };
  Object.keys(query).forEach(function (key) {
    if (['ssid', 'password', 'auth', 'hidden', 'empty', 'long', 'special', 'locale'].indexOf(key) < 0) {
      template[key] = query[key];
    }
  });
  window.dsplay_template = template;
}());
