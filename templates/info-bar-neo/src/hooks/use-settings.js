import {
  useTemplateVal, useTemplateBoolVal, useTemplateIntVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { parseOrder } from '../util/widgets';

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

/** Every template variable, with the legacy keys as fallback (the new key wins). */
export default function useSettings(locale) {
  const showClock = useTemplateBoolVal('show_clock', useTemplateBoolVal('clock', true));
  const showDate = useTemplateBoolVal('show_date', true);
  const lng = String(locale || 'en').toLowerCase();
  const timeFormatVar = useTemplateVal('time_format', '');
  const order = first(useTemplateVal('widgets_order', ''), useTemplateVal('widgets_sequence_query', ''));
  const latitude = String(useTemplateVal('latitude', '') || '').trim();
  const longitude = String(useTemplateVal('longitude', '') || '').trim();
  const unitVar = String(useTemplateVal('weather_unit', 'celsius') || '').toLowerCase();
  const source1 = String(useTemplateVal('source_currency_1', '') || '').trim();
  const source2 = String(useTemplateVal('source_currency_2', '') || '').trim();
  const target = String(useTemplateVal('target_currency', '') || '').trim();
  const rssUrl = String(useTemplateVal('rss_url', '') || '').trim();
  const rssLogo = useTemplateVal('rss_logo', '');
  const rssLogoUrl = useTemplateVal('rss_logo_url', '');
  const newsInterval = useTemplateIntVal('news_interval', 30);
  const companyLogo = first(useTemplateVal('logo', ''), useTemplateVal('sponsor_logo', '')) || '';
  const companyLogoUrl = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const themeVar = useTemplateVal('theme', '');
  const reliefStrength = useTemplateVal('relief_strength', 'normal');
  const colorPrimary = useTemplateVal('color_primary', '');
  const colorText = first(useTemplateVal('color_text', ''), useTemplateVal('text_color', ''));
  const backgroundColor = first(useTemplateVal('background_color', ''), useTemplateVal('bg_color', ''));
  const rssBox = useTemplateVal('rss_logo_box_color', '');
  const sponsorBox = useTemplateVal('sponsor_logo_box_color', '');
  const logoBackground = first(useTemplateVal('color_logo_background', ''), sponsorBox, rssBox) || '#FFFFFF';
  const layoutPosition = useTemplateVal('layout_position', 'center');
  const roundedCorners = useTemplateBoolVal('rounded_corners', true);
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  let mode = themeVar;
  if (mode !== 'light' && mode !== 'dark' && mode !== 'custom') {
    mode = (colorPrimary || colorText || backgroundColor) ? 'custom' : 'light';
  }
  const theme = buildTheme({
    mode, primary: colorPrimary, text: colorText, background: backgroundColor, reliefStrength,
  });

  let timeFormat = timeFormatVar;
  if (timeFormat !== '12h' && timeFormat !== '24h') {
    timeFormat = lng === 'en_us' ? '12h' : '24h';
  }
  const interval = Number.isFinite(newsInterval) ? Math.max(10, Math.min(120, newsInterval)) : 30;

  return {
    order: parseOrder(order),
    showClock,
    showDate,
    timeFormat,
    latitude,
    longitude,
    unit: unitVar === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    sources: [source1, source2].filter(Boolean),
    target,
    rssUrl,
    rssLogo,
    rssLogoUrl,
    newsInterval: interval,
    companyLogo,
    companyLogoUrl,
    showLogo,
    theme,
    logoBackground,
    position: ['top', 'bottom'].indexOf(layoutPosition) >= 0 ? layoutPosition : 'center',
    rounded: roundedCorners,
    animationEnabled,
    debug,
  };
}
