// Dev-only (public/test-assets is left out of the release build): loaded by dsplay-data.js with ?measure=1.
// Writes the boxes of the main containers (px, relative to the window) as JSON into <pre id="measure">.
(function () {
  function box(el) {
    var r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  }
  function collect(selector) {
    return Array.prototype.map.call(document.querySelectorAll(selector), box);
  }
  function icons() {
    return Array.prototype.map.call(document.querySelectorAll('img.icon'), function (img) {
      return { box: box(img), parent: box(img.parentNode) };
    });
  }
  setTimeout(function () {
    var stage = document.querySelector('.stage');
    var out = {
      remPx: parseFloat(window.getComputedStyle(document.documentElement).fontSize),
      stage: stage ? box(stage) : null,
      app: document.querySelector('.app') ? box(document.querySelector('.app')) : null,
      now: collect('.now'),
      forecast: collect('.forecast'),
      company: collect('.company'),
      wells: collect('.details .well'),
      detailsRow: collect('.details-row'),
      bar: collect('.bar'),
      days: collect('.days'),
      icons: icons(),
    };
    var pre = document.createElement('pre');
    pre.id = 'measure';
    pre.textContent = 'MEASURE' + JSON.stringify(out) + 'END';
    document.body.appendChild(pre);
  }, 3500);
}());
