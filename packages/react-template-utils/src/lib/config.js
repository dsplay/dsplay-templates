const config = window.dsplay_config || window.config || {};

export const isVertical = () => config.orientation === 'portrait';

export default config;