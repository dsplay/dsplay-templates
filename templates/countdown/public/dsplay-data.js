/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-var */
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

  title: 'Countdown to the new year - 2024',
  date: '2023-09-01T00:00',
};

var dsplay_template = {
  // template parameter
  // bg_image always wins over this gradient when both are set (see count-down-context) -
  // kept as a sensible fallback for when no image is configured.
  bg_color_1: '#0a1128',
  bg_color_2: '#000000',
  bg_image: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Celebration_fireworks.jpg',
  bg_font_color: '#ffffff',
};
