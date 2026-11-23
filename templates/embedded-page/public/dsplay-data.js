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

  // The answer of the DSPLAY player gateway for a private dashboard: the address signed for this showing. Any page stands in for it in dev/CMS preview.
  result: {
    data: { url: 'https://example.com/' },
  },
};

var dsplay_template = {};
