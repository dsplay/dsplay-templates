/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-var */
var dsplay_config = {
  // config parameters
  locale: 'pt',
  orientation: window.innerHeight < window.innerWidth ? 'landscape' : 'portrait',
  // Android SDK version
  osVersion: 19,
  // DSPLAY App version code
  appVersion: 99,
};

var dsplay_media = {
  // for json service based media
  // result: { "validity": "2018-08-13T18:22:55.238Z", "showOutdated": true, "data": {} },
  // custom media parameters
  // customMediaParam: "value",
  offsetTimeMinutes: -240, // tempo em minutos
  maxPageDurationSeconds: 10,
  apiKey: 'xxxxxx-xxxxxx',
  arrivalDeparture: 'arrival',
  iataCode: 'LIS',
  duration: 30000,
};

// This template has no dsplay_template variables at all - it's configured
// entirely through custom dsplay_media parameters instead (see README.md).
// template_var/title/expanded/logo below were dead leftovers from whatever
// boilerplate this was cloned from - src/ never reads any of them.
