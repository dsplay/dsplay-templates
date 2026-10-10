import DSPLAY from "./dsplay-interface";

/** @type {import('./types').DsplayData} */
const data = JSON.parse(DSPLAY.getData());
const { media } = data;

export default media;