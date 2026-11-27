// Mock data for local development. Scenarios by URL, e.g.
//   http://localhost:5182/?icon=fire&alert_message=Perigo&color_primary=%23D50000&show_holes=false&animation_enabled=false
// Any query parameter becomes a template variable. locale=en_US sets the locale.
var query = {};
window.location.search.replace(/^\?/, '').split('&').forEach(function (pair) {
  if (pair) {
    var kv = pair.split('=');
    query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
  }
});

var dsplay_config = {
  locale: query.locale || 'pt_BR',
  osVersion: 23,
  appVersion: 99,
};

var dsplay_media = {
  duration: 30000,
};

var dsplay_template = {
  // template variables (defaults of the CMS: icon 'warning', color_primary '#FFD600', show_holes true, animation_enabled true)
  icon: 'biological',
  alert_message: 'Atenção! Risco Biológico',
  color_primary: '#FFD600',
  show_holes: true,
  animation_enabled: true,
};
Object.keys(query).forEach(function (key) {
  if (key !== 'locale') {
    dsplay_template[key] = query[key];
  }
});

// ?measure=1: after the layout settles, writes the measurements into <pre id="measure"> (read by scripts/check-layout.mjs via --dump-dom)
if (query.measure === '1') {
  window.setTimeout(function () {
    var rect = function (el) { var r = el.getBoundingClientRect(); return { x: r.left, y: r.top, r: r.right, b: r.bottom }; };
    var q = function (s) { return document.querySelector(s); };
    var root = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    var out = { w: window.innerWidth, h: window.innerHeight, remPx: root, layout: (q('.alert') || {}).className };
    var field = q('.plate-field');
    var panel = q('.alert-panel');
    var text = q('.alert-panel h1');
    var icon = q('.alert-icon img');
    if (field) out.field = rect(field);
    if (panel) out.panel = rect(panel);
    if (icon) { out.icon = rect(icon); out.iconOk = icon.complete && icon.naturalWidth > 0; out.pulse = window.getComputedStyle(q('.alert-icon')).animationName; }
    out.appFade = window.getComputedStyle(q('.app')).animationName;
    if (text) {
      var cs = window.getComputedStyle(text);
      out.fontRem = parseFloat(cs.fontSize) / root;
      out.color = cs.color;
      out.textOverflowY = text.scrollHeight - (text.parentNode.clientHeight || text.clientHeight);
      out.textOverflowX = text.scrollWidth - text.clientWidth;
      out.clamped = /clamped/.test(text.className);
    }
    out.plate = window.getComputedStyle(q('.alert')).backgroundColor;
    out.docOverflowX = document.documentElement.scrollWidth - window.innerWidth;
    out.docOverflowY = document.documentElement.scrollHeight - window.innerHeight;
    var pre = document.createElement('pre');
    pre.id = 'measure';
    pre.textContent = 'MEASURE' + JSON.stringify(out) + 'END';
    document.body.appendChild(pre);
  }, 4000);
}
