const template = window.dsplay_template || window.template || {};

export const val = (key, defaultValue) => template[key] !== undefined && template[key] !== null ? template[key] : defaultValue;

export const bval = (key, defaultValue) => val(key, defaultValue ? 'true' : 'false').toLowerCase() === 'true';

export const ival = (key, defaultValue) => parseInt(val(key, defaultValue));

export const fval = (key, defaultValue) => parseFloat(val(key, defaultValue));