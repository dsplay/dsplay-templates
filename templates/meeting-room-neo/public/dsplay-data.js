// Mock data for local development. Scenarios by URL, e.g. http://localhost:5181/?when=live&logos=none
//   when=future|soon|tomorrow|live|ended   (default live: the event is happening now)   days=1|3 (one day or several)
//   end=0 (start only)   name=long|xl   place=long|none   logos=none|event|host|both (default both)
//   badlogo=1 (broken image URLs)   locale=en_US   plus any template variable: theme=dark, background_color=%23777777,
//   color_primary=..., color_logo_card=..., relief_strength=strong, time_format=12h, show_status=false,
//   animation_enabled=false, and the legacy keys mainColor, rightColorTop, eventLogo, hostLogo
(function () {
  var query = {};
  window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
    if (pair) {
      var kv = pair.split('=');
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    }
  });

  var HOUR = 3600 * 1000;
  var now = Date.now();
  var when = query.when || 'live';
  var multi = query.days === '3';
  var length = multi ? 72 * HOUR : 2 * HOUR;
  var start = { future: now + 5 * 24 * HOUR, soon: now + 2 * HOUR, tomorrow: now + 20 * HOUR, live: now - HOUR, ended: now - length - 3 * HOUR }[when];
  if (multi && when === 'live') {
    start = now - 20 * HOUR;
  }
  var end = query.end === '0' ? '' : new Date(start + length).toISOString();

  var names = {
    long: 'Annual Meeting of the Regional Engineering and Operations Committee',
    xl: 'Reuniao Anual do Comite Regional de Engenharia, Operacoes e Planejamento Estrategico para o Proximo Ciclo de Investimentos da Companhia',
  };
  var places = { long: 'Building B, 12th floor, Conference Room Aurora, Cupertino, California, USA', none: '' };

  var logos = query.logos || 'both';
  var event = 'test-assets/logo.svg';
  var host = 'https://ui-avatars.com/api/?name=Venue&size=256&background=025EFD&color=fff&bold=true&format=png';
  if (query.badlogo === '1') {
    event = 'test-assets/missing.png';
    host = 'test-assets/missing2.png';
  }

  window.dsplay_config = {
    locale: query.locale || 'pt_BR',
    osVersion: 23,
    appVersion: 99,
  };

  window.dsplay_media = {
    duration: 30000,
    eventName: names[query.name] || 'DSPLAY Convention 2023',
    location: query.place in places ? places[query.place] : 'Cupertino, CA - USA',
    startDate: new Date(start).toISOString(),
    endDate: end,
  };

  var template = {};
  if (logos === 'both' || logos === 'event') {
    template.event_logo = event;
  }
  if (logos === 'both' || logos === 'host') {
    template.host_logo = host;
  }
  Object.keys(query).forEach(function (key) {
    if (['when', 'days', 'end', 'name', 'place', 'logos', 'badlogo', 'locale'].indexOf(key) < 0) {
      template[key] = query[key];
    }
  });
  window.dsplay_template = template;
}());
