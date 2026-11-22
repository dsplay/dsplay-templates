// Mock DSPLAY data for `npm start`. Try: ?theme=light  ?n=4 (how many menu lines)  ?locale=en_US  ?duration=20000  ?noimg=1
var query = new URLSearchParams(window.location.search);

function swatch(from, to) {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + from + '"/><stop offset="1" stop-color="' + to + '"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="210" cy="150" r="70" fill="rgba(255,255,255,.35)"/><circle cx="400" cy="250" r="110" fill="rgba(255,255,255,.25)"/></svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

var dsplay_config = {
  // config parameters
  locale: query.get('locale') || 'pt_br',
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 112,
};

var dsplay_media = {
  duration: Number(query.get('duration')) || 20000,
};

var dsplay_template = {
  // Theme Color (dark or light)
  theme: query.get('theme') || 'dark',
  // Menu board title
  title: 'Para encher o bucho',
  // Promo products
  promo_img_01: query.get('noimg') ? '' : swatch('#f97316', '#be123c'),
  promo_product_01: 'Hamburguer de Siri',
  promo_price_01: 'R$ 25,00',
  promo_img_02: query.get('noimg') ? '' : swatch('#0ea5e9', '#1e3a8a'),
  promo_product_02: 'Tangiroba Coke',
  promo_price_02: 'R$ 15,00',
};

// Menu board items
[
  ['X-Burger', 'R$ 25,00'],
  ['Hambuguer', 'R$ 20,00'],
  ['Fries', 'R$ 30,00'],
  ['Milk Shake', 'R$ 35,00'],
  ['Soda', 'R$ 40,00'],
  ['X-Salad', 'R$ 15,00'],
  ['X-Bacon', 'R$ 10,00'],
  ['X-Egg', 'R$ 12,00'],
  ['X-Bacon Egg', 'R$ 14,00'],
  ['X-Chicken', 'R$ 16,00'],
].slice(0, Number(query.get('n')) || 10).forEach(function (item, index) {
  var key = ('0' + (index + 1)).slice(-2);
  dsplay_template['prod_name' + key] = item[0];
  dsplay_template['prod_price' + key] = item[1];
});
