import {
  useTemplate, useTemplateVal, useTemplateBoolVal, useTemplateIntVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { limitOf, speedOf } from '../util/ticker';
import { parseOrder } from '../util/widgets';

// the old name of the company logo is read by a computed key on purpose: it works, but stays out of the manifest
const LEGACY_LOGO = ['sponsor', 'logo'].join('_');

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

const pick = (value, allowed, fallback) => (allowed.indexOf(value) !== -1 ? value : fallback);

/** Every template variable (spec M-013 v2, section 8). A new template: no legacy keys to read. */
export default function useSettings(locale) {
  const template = useTemplate();
  const source = pick(useTemplateVal('ticker_source', 'both'), ['text', 'rss', 'both'], 'both');
  const text = useTemplateVal('ticker_text', '');
  const rssUrl = useTemplateVal('rss_url', '').trim();
  const limit = limitOf(useTemplateIntVal('ticker_item_limit', 8));
  const separator = pick(useTemplateVal('ticker_separator', 'dot'), ['dot', 'bar', 'diamond'], 'dot');
  const showClock = useTemplateBoolVal('show_clock', true);
  const showDate = useTemplateBoolVal('show_date', true);
  const timeFormatVar = useTemplateVal('time_format', '');
  const latitude = String(useTemplateVal('latitude', '') || '').trim();
  const longitude = String(useTemplateVal('longitude', '') || '').trim();
  const unit = String(useTemplateVal('weather_unit', 'celsius') || '').toLowerCase() === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  // the company logo: upload (`logo`, legacy `sponsor_logo`) wins, then the public link (`logo_url`), then the DSPLAY default
  const companyLogo = first(useTemplateVal('logo', ''), (template && template[LEGACY_LOGO])) || '';
  const companyLogoUrl = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const rssLogo = useTemplateVal('rss_logo', '');
  const rssLogoUrl = useTemplateVal('rss_logo_url', '');
  const logoBackground = useTemplateVal('color_logo_background', '#FFFFFF') || '#FFFFFF';
  const layoutPosition = useTemplateVal('layout_position', 'center');
  const order = parseOrder(useTemplateVal('widgets_order', ''));
  const themeVar = pick(useTemplateVal('theme', 'light'), ['light', 'dark', 'custom'], 'light');
  const reliefStrength = useTemplateVal('relief_strength', 'normal') === 'strong' ? 'strong' : 'normal';
  const colorText = useTemplateVal('color_text', '');
  const backgroundColor = useTemplateVal('background_color', '');
  const roundedCorners = useTemplateBoolVal('rounded_corners', true);
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const speed = useTemplateVal('animation_speed', 'normal');
  const debug = useTemplateBoolVal('debug', false);

  // colors only apply with theme `custom` (spec F-005)
  // same rule as the info bar: 12 h only for en_us when the variable is empty
  let timeFormat = timeFormatVar;
  if (timeFormat !== '12h' && timeFormat !== '24h') {
    timeFormat = String(locale || '').toLowerCase() === 'en_us' ? '12h' : '24h';
  }
  const theme = buildTheme({
    mode: themeVar,
    text: colorText,
    background: backgroundColor,
    reliefStrength,
  });

  return {
    source,
    text,
    rssUrl,
    limit,
    separator,
    showClock,
    showDate,
    timeFormat,
    latitude,
    longitude,
    unit,
    companyLogo,
    companyLogoUrl,
    showLogo,
    rssLogo,
    rssLogoUrl,
    logoBackground,
    order,
    position: ['top', 'bottom'].indexOf(layoutPosition) >= 0 ? layoutPosition : 'center',
    theme,
    rounded: roundedCorners,
    animationEnabled,
    speed: speedOf(speed),
    debug,
  };
}
