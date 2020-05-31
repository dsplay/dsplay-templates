import { tval, tfval } from '@dsplay/template-utils';
import {
  DEFAULT_COLOR_1,
  DEFAULT_COLOR_2,
  DEFAULT_COLOR_3,
  DEFAULT_COLOR_4,
  DEFAULT_OVERLAY_POSITION,
  DEFAULT_IMAGE_FIT,
} from './defaults';
import { hexToRgba } from './color';

export const color1 = tval('color_1', DEFAULT_COLOR_1);
export const color2 = tval('color_2', DEFAULT_COLOR_2);
export const color3 = tval('color_3', DEFAULT_COLOR_3);
export const color4 = tval('color_4', DEFAULT_COLOR_4);

export const textColor = tval('text_color', color1);
export const borderColor = tval('border_color', color1);
export const hashtagColor = tval('hashtag_color', color2);
export const mentionColor = tval('mention_color', color2);
export const phoneColor = tval('phone_color', color2);
export const linkColor = tval('link_color', color3);
export const textBgColorHex = tval('text_bg_color', color4);
export const textBgOpacity = tfval('text_bg_opacity', .3);
export const textBgColor = hexToRgba(textBgColorHex, textBgOpacity);

export const overlay = tval('overlay');
export const overlayPosition = tval('overlay_position', DEFAULT_OVERLAY_POSITION);
export const imageFit = tval('image_fit', DEFAULT_IMAGE_FIT);