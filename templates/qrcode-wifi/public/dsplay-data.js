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

  // custom media parameters
  ssid: 'Customer Wifi',
  password: 'pcmnac84',
  auth_type: 'wpa',
  hidden: false,
};

var dsplay_template = {
  qr_code_dot_scale: .3,
  qr_code_dot_scale_timing: 0.5,
  qr_code_logo: '../test-assets/dsplay-logo.png',
  qr_code_logo_background_transparent: false,
  qr_code_quiet_zone_color: 'blue',
  qr_code_foreground_color: 'red',
  qr_code_background_color: '#ffffff',
};
