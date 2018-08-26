var template = window.dsplay_template || window.template || {};

export var tval = function tval(key, defaultValue) {
  return template[key] !== undefined && template[key] !== null ? template[key] : defaultValue;
};

export var tbval = function tbval(key, defaultValue) {
  return tval(key, defaultValue ? 'true' : 'false').toLowerCase() === 'true';
};

export var ibval = function ibval(key, defaultValue) {
  return parseInt(tval(key, defaultValue));
};

export var fbval = function fbval(key, defaultValue) {
  return parseFloat(tval(key, defaultValue));
};