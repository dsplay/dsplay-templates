import * as templateUtil from './template';
import * as configUtil from './config';

export { default as media } from './media';
export { default as config } from './config';
export { default as template } from './template';
export { default as DSPLAY } from './dsplay-interface';

// custom template vars

export const tval = templateUtil.val;

export const tbval = templateUtil.bval;

export const tival = templateUtil.ival;

export const tfval = templateUtil.fval;

// config

export const isVertical = configUtil.isVertical();