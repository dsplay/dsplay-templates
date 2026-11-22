// The mock data of the dev server (the player replaces this file with the real content before any script runs).
//
// `dsplay_media.result` is what the DSPLAY player gateway answers for an Information panel media: the widgets that play (`order`), split into `fixed` (side by side) and `rotating`
// (taking turns in the long area), and, by id, the body of each widget's own provider. To try another screen from the dev server add ?size=1920x120 (also 1920x81, 1920x56, 1920x240,
// 1080x1080, 1080x1920, 320x1080), ?style=classic|terminal|glass|newsroom|paper|neon|poster|cards|split|night|minimal, ?pin=both (spotlight), ?locale=en, ?iteration=N (the next headline, joke), ?few=1 (only a clock and the news), ?only=weather|quotes|news|holidays|countdown|jokes|clock|logo (one widget).
var dsplay_media = {
  duration: 30000,
  iteration: 0,
  result: {
    order: ['clock', 'weather', 'quotes', 'alerts', 'news', 'holidays', 'countdown', 'jokes', 'horoscope', 'logo'],
    fixed: ['clock', 'weather', 'quotes', 'logo'],
    rotating: ['alerts', 'news', 'holidays', 'countdown', 'jokes', 'horoscope'],
    widgets: {
      clock: { type: 'clock', status: 'ok', data: { hour12: false } },
      weather: {
        type: 'weather',
        status: 'ok',
        data: {
          unit: 'C', // 'F' for Fahrenheit: the unit the media's weather widget was set to
          weather: {
            city: 'São Paulo',
            country: 'BR',
            current: { temp: 28, icon: 'c02d', description: 'Parcialmente nublado', humidity: 62, wind: 3.9, min: 21, max: 29, sunrise: '05:40', sunset: '18:20' },
            forecast: [
              { date: '2026-11-22', min: 20, max: 27, icon: 'c04d' },
              { date: '2026-11-23', min: 19, max: 26, icon: 'r01d' },
              { date: '2026-11-24', min: 20, max: 28, icon: 'c04d' },
              { date: '2026-11-25', min: 22, max: 30, icon: 'c01d' },
            ],
          },
        },
      },
      quotes: {
        type: 'quotes',
        status: 'ok',
        data: { schema: 'currency-quotes/1', base: 'BRL', items: [
            { code: 'USD', name: 'US Dollar', price: 5.13, changePct: 0.4, series: [5.21, 5.18, 5.12, 5.08, 5.1, 5.04, 5.02, 5.07, 5.11, 5.13] },
            { code: 'EUR', name: 'Euro', price: 5.56, changePct: -0.3, series: [5.48, 5.52, 5.6, 5.66, 5.62, 5.58, 5.6, 5.57, 5.58, 5.56] },
          ],
        },
      },
      alerts: {
        type: 'alerts',
        status: 'ok',
        // the alerts active now, worst first; none = the widget is left out. severity: moderate (yellow), severe (orange), extreme (red)
        data: {
          schema: 'alerts/1',
          items: [{ id: 'a1', event: 'Tempestade forte', severity: 'severe', color: null, description: 'Risco de queda de árvores e alagamentos; evite áreas abertas.', areas: ['São Paulo'], areaCount: 1, onset: '2026-11-21T14:00:00', expires: '2026-11-21T18:00:00', sender: 'INMET' }],
        },
      },
      news: {
        type: 'news',
        status: 'ok',
        data: {
          title: 'Notícias',
          items: [
            { title: 'Prefeitura inaugura nova ciclovia na zona sul da cidade', description: 'A obra tem 12 km e liga três bairros; a abertura é neste sábado.', images: ['https://upload.wikimedia.org/wikipedia/commons/4/48/Gradient_Abstract_Background.jpg'] },
            { title: 'Feira de tecnologia reúne mais de 300 expositores', description: 'O evento segue até domingo, com entrada gratuita.' },
          ],
        },
      },
      holidays: {
        type: 'holidays',
        status: 'ok',
        data: { schema: 'holidays/1', date: '2026-11-21', holidays: [{ date: '2026-12-25', name: 'Natal' }, { date: '2027-01-01', name: 'Confraternização Universal' }, { date: '2027-02-09', name: 'Carnaval' }] },
      },
      countdown: { type: 'countdown', status: 'ok', data: { date: '2026-11-27T00:00', title: 'a Black Friday' } },
      jokes: {
        type: 'jokes',
        status: 'ok',
        data: { schema: 'jokes/1', jokes: [{ setup: 'Por que o livro de matemática ficou triste?', punchline: 'Porque tinha muitos problemas.' }] },
      },
      horoscope: {
        type: 'horoscope',
        status: 'ok',
        data: {
          schema: 'horoscope/1',
          lang: 'pt',
          signs: [
            { sign: 'leo', from: '07-23', to: '08-22', element: 'fire', keyword: 'Confiança', text: 'Seu entusiasmo contagia quem está ao redor. Aproveite a manhã para propor aquela ideia que andava guardada.' },
            { sign: 'virgo', from: '08-23', to: '09-22', element: 'earth', keyword: 'Organização', text: 'Pequenos ajustes de rotina trazem uma sensação boa de controle. Separe um momento para você.' },
          ],
        },
      },
      logo: { type: 'logo', status: 'ok', data: { url: 'https://developers.dsplay.tv/assets/images/dsplay-logo.png' } },
    },
  },
};

var dsplay_template = {
  // the style: classic, terminal, glass, newsroom, paper or neon
  style: 'classic',
  // the style: the panel family (classic, terminal, glass, newsroom, paper, neon) or the spotlight family (poster, cards, split, night, minimal)
  // pin: 'both' keeps the clock and the logo on the top bar of a spotlight instead of making them slides
  // the colors every style can take (leave out to keep the style's own)
  // bg_color: '#0b1d3a',
  // bg_image: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Gradient_Abstract_Background.jpg',
  // text_color: 'white',
  // currency_box_color: 'white',
  // currency_text_color: '#222',
  // rss_logo_box_color: 'white',
  // sponsor_logo_box_color: 'white',
};

var dsplay_config = {
  locale: 'pt_br',
  orientation: 'landscape',
  osVersion: 16,
  appVersion: 99,
};

// Dev server only: the page's own address picks the screen.
(function () {
  var params = new URLSearchParams(window.location.search);
  var style = params.get('style');
  if (style) dsplay_template.style = style;
  var pin = params.get('pin');
  if (pin) dsplay_template.pin = pin;
  var locale = params.get('locale');
  if (locale) dsplay_config.locale = locale;
  var iteration = params.get('iteration');
  if (iteration) dsplay_media.iteration = Number(iteration);
  var sev = params.get('sev');
  if (sev) dsplay_media.result.widgets.alerts.data.items[0].severity = sev;
  var dur = params.get('dur');
  if (dur) dsplay_media.duration = Number(dur);
  var only = params.get('only');
  if (only) {
    var r = dsplay_media.result;
    r.order = [only];
    r.fixed = r.fixed.indexOf(only) >= 0 ? [only] : [];
    r.rotating = r.rotating.indexOf(only) >= 0 ? [only] : [];
  }
  if (params.get('few')) {
    dsplay_media.result.order = ['clock', 'news'];
    dsplay_media.result.fixed = ['clock'];
    dsplay_media.result.rotating = ['news'];
  }
}());
