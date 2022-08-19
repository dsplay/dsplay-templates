import DSPLAY from "./dsplay-interface";

const { config } = DSPLAY.getData();

export const isVertical = () => config.orientation === 'portrait';

export default config;