import { useMemo } from 'react';
import {
  template, tval, tbval, tival, tfval,
} from '@dsplay/template-utils';

/**
 * @returns {import('@dsplay/template-utils').DsplayTemplate} The current template variables object
 */
export default () => template;

/**
 * Gets a template variable as string, memoized by key/default.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string} [def] - Value returned when the variable is not set
 * @returns {string}
 */
export const useTemplateVal = (key, def) => useMemo(() => tval(key, def), [key, def]);

/**
 * Gets a template variable as boolean, memoized by key/default.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {boolean} [def] - Value returned when the variable is not set
 * @returns {boolean}
 */
export const useTemplateBoolVal = (key, def) => useMemo(() => tbval(key, def), [key, def]);

/**
 * Gets a template variable as integer, memoized by key/default.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string|number} [def] - Value returned when the variable is not set
 * @returns {number}
 */
export const useTemplateIntVal = (key, def) => useMemo(() => tival(key, def), [key, def]);

/**
 * Gets a template variable as float, memoized by key/default.
 * @param {string} key - Variable name, as registered in the CMS
 * @param {string|number} [def] - Value returned when the variable is not set
 * @returns {number}
 */
export const useTemplateFloatVal = (key, def) => useMemo(() => tfval(key, def), [key, def]);
