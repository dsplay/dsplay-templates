import * as templateUtil from './template';
import * as configUtil from './config';

/** The current media object. @type {import('./types').DsplayMedia} */
export { default as media } from './media';
/** The current device/app config object. @type {import('./types').DsplayConfig} */
export { default as config } from './config';
/** The current template variables object. @type {import('./types').DsplayTemplate} */
export { default as template } from './template';
/** The DSPLAY native/mock interface. @type {import('./types').DSplayInterface} */
export { default as DSPLAY } from './dsplay-interface';

// custom template vars

export const tval = templateUtil.val;

export const tbval = templateUtil.bval;

export const tival = templateUtil.ival;

export const tfval = templateUtil.fval;

// config

export const isVertical = configUtil.isVertical();