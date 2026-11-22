var dsplay_config = {
  // config parameters
  locale: 'pt_br',
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 99,
};

var dsplay_media = {
  duration: 30000,

  // The pages of the document, converted to images by DSPLAY. picsum.photos stands in for them in dev/CMS preview.
  images: [
    'https://picsum.photos/seed/document01/1240/1754',
    'https://picsum.photos/seed/document02/1240/1754',
    'https://picsum.photos/seed/document03/1240/1754',
    'https://picsum.photos/seed/document04/1240/1754',
  ],
};

var dsplay_template = {
  // paged | scroll
  mode: 'paged',
  // none | fade | slide-left | slide-up | zoom | flip
  transition: 'fade',
  transitionMs: 500,
  // contain | cover
  fit: 'contain',
  background: '#000000',
  endMarginMs: 2000,
};
