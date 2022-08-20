import DSPLAY from "./dsplay-interface";

const { config } = JSON.parse(DSPLAY.getData());

export const isVertical = () => config.orientation === 'portrait';

export default config;