import { useTemplateVal, useTemplateFloatVal, color } from '@dsplay/react-template-utils';
import {
  DEFAULT_COLOR_1,
  DEFAULT_COLOR_2,
  DEFAULT_COLOR_3,
  DEFAULT_COLOR_4,
  DEFAULT_OVERLAY_POSITION,
  DEFAULT_IMAGE_FIT,
} from '../util/defaults';

export default function useStyle() {
  const color1 = useTemplateVal('color_1', DEFAULT_COLOR_1);
  const color2 = useTemplateVal('color_2', DEFAULT_COLOR_2);
  const color3 = useTemplateVal('color_3', DEFAULT_COLOR_3);
  const color4 = useTemplateVal('color_4', DEFAULT_COLOR_4);

  const textColor = useTemplateVal('text_color', color1);
  const borderColor = useTemplateVal('border_color', color1);
  const hashtagColor = useTemplateVal('hashtag_color', color2);
  const mentionColor = useTemplateVal('mention_color', color2);
  const phoneColor = useTemplateVal('phone_color', color2);
  const linkColor = useTemplateVal('link_color', color3);
  const textBgColorHex = useTemplateVal('text_bg_color', color4);
  const textBgOpacity = useTemplateFloatVal('text_bg_opacity', 0.3);
  const textBgColor = color.hexToRgba(textBgColorHex, textBgOpacity);

  const overlay = useTemplateVal('overlay');
  const overlayPosition = useTemplateVal('overlay_position', DEFAULT_OVERLAY_POSITION);
  const imageFit = useTemplateVal('image_fit', DEFAULT_IMAGE_FIT);

  return {
    color1,
    color2,
    color3,
    color4,
    textColor,
    borderColor,
    hashtagColor,
    mentionColor,
    phoneColor,
    linkColor,
    textBgColorHex,
    textBgOpacity,
    textBgColor,
    overlay,
    overlayPosition,
    imageFit,
  };
}
