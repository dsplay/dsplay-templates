/* eslint-disable vars-on-top */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-var */
var dsplay_config = {
  // config parameters
  locale: 'pt_br',
  orientation:
    window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 99,
};

// eslint-disable-next-line no-unused-vars
var dsplay_media = {
  duration: 30000,

  // for json service based media
  result: {
    validity: '2018-08-13T18:22:55.238Z',
    showOutdated: true,
    data: {},
  },

  // custom media parameters
  customMediaParam: 'value',
  ssid: 'LIVE TIM_5A20_5G',
  password: 'njc7e4ne3n',
  authentication: 'WPA',
  hidden: 'false',
};

var dsplay_template = {
  // template parameter

  template_var: 'My Template Var',

  logo: '../test-assets/dsplay-logo.png',

  title: 'My Super Template',
  expanded: 'false',

  qr_code_dotScale: 1,
  qr_code_dot_scale_timing: 0.5,
  qr_code_logo: '../test-assets/dsplay-logo.png',
  qr_code_logo_width: 40,
  qr_code_logo_height: 40,
  qr_code_logo_background_transparent: false,
  qr_code_quiet_zone: 3,
  qr_code_quiet_zone_color: 'white',
  qr_code_foreground_color: '#000000',
  qr_code_background_color: '#ffffff',
};
