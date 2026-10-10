import DSPLAY from "./dsplay-interface";

/** @type {import('./types').DsplayData} */
const data = JSON.parse(DSPLAY.getData());
const { config } = data;

/** @returns {boolean} Whether the device screen orientation is portrait */
export const isVertical = () => config.orientation === 'portrait';

export default config;