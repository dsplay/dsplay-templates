/** @typedef {import('./types').DSplayInterface} DSplayInterface */

/** @type {import('./types').DsplayMedia} */
const media = window.dsplay_media || window.media || {};
/** @type {import('./types').DsplayConfig} */
const config = window.dsplay_config || window.config || {};
/** @type {import('./types').DsplayTemplate} */
const template = window.dsplay_template || window.template || {};

/** @type {DSplayInterface} */
const DSPLAY = {};

DSPLAY.error = (message) => {
  console.error(`media error: ${message}`);
}

DSPLAY.complete = () => {
  console.log('media complete');
}

DSPLAY.getData = () => JSON.stringify({
  media,
  config,
  template,
});

if (!window.DSPLAY) {
  console.log('Using mock DSPLAY interface [development mode]');
  window.DSPLAY = DSPLAY;
} else if (!window.DSPLAY.getData) {
  console.log('Using getData() from old dsplay-data.js [production mode]')
  window.DSPLAY.getData = DSPLAY.getData;
} else {
  console.log('Using native getData() from DSPLAY app [production mode]')
}

export default /** @type {DSplayInterface} */ (window.DSPLAY);