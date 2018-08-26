var template = window.dsplay_config || window.config || {};

var isVertical = function isVertical() {
  return template.orientarion === 'portrait';
};