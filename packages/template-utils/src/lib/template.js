import DSPLAY from "./dsplay-interface";

/** @type {import('./types').DsplayData} */
const data = JSON.parse(DSPLAY.getData());
const { template } = data;

/**
 * Gets a template variable as string.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string} [defaultValue] - Value returned when the variable is not set
 * @returns {string}
 */
export const val = (key, defaultValue) => template[key] ? template[key] : defaultValue;

/**
 * Gets a template variable as boolean.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {boolean} [defaultValue] - Value returned when the variable is not set
 * @returns {boolean}
 */
export const bval = (key, defaultValue) => {
  let stringVal = val(key, defaultValue ? 'true' : 'false');
  if (typeof (stringVal) === 'boolean') return stringVal;
  stringVal = stringVal.toLowerCase();
  return stringVal === 'true' || stringVal === '1';
}

/**
 * Gets a template variable as integer.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string|number} [defaultValue] - Value returned when the variable is not set
 * @returns {number}
 */
export const ival = (key, defaultValue) => parseInt(val(key, defaultValue));

/**
 * Gets a template variable as float.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string|number} [defaultValue] - Value returned when the variable is not set
 * @returns {number}
 */
export const fval = (key, defaultValue) => parseFloat(val(key, defaultValue));

export default template;