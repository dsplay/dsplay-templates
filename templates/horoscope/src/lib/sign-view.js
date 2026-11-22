import { formatRange } from './model';
import { COLOR_LABEL, ELEMENT_LABEL, SIGN_LABEL } from './labels';
import { COLOR_HEX } from './zodiac';

/** What a style writes about a sign, in the screen's language: names, the range of dates, the lucky colour (null when the answer has none) and the match. */
export default function signView(sign, t) {
  return {
    ...sign,
    name: t(SIGN_LABEL[sign.id]),
    range: formatRange(sign.from, sign.to, t),
    elementName: t(ELEMENT_LABEL[sign.element]),
    colorName: sign.luckyColor ? t(COLOR_LABEL[sign.luckyColor]) : null,
    colorHex: sign.luckyColor ? COLOR_HEX[sign.luckyColor] : null,
    matchName: sign.compatible ? t(SIGN_LABEL[sign.compatible]) : null,
  };
}
