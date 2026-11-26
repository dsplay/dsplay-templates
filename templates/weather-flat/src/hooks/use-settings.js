import {
  useTemplate, useTemplateVal, useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { logoSources, validLogoUrl } from '../util/logo-url';

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

// Legacy keys are read by a computed key on purpose: they work but stay out of the manifest.
const LEGACY = { logo: ['sponsor_logo'], logoBackground: ['logo_bg_color'] };
const legacy = (template, group) => LEGACY[group].map((key) => template && template[key]).find((v) => v !== undefined && v !== null && v !== '');

/**
 * Every template variable. `background_image`, `background_image_portrait` and `background_overlay_opacity` are not variables of
 * this flat style (no photo): they are neither read nor listed.
 */
export default function useSettings() {
  const template = useTemplate();
  const unit = useTemplateVal('unit', 'celsius');
  const windUnit = useTemplateVal('wind_unit', 'kmh');
  const showCity = useTemplateBoolVal('show_city', true);
  const showDescription = useTemplateBoolVal('show_description', true);
  const showMinMax = useTemplateBoolVal('show_min_max', true);
  const showDetails = useTemplateBoolVal('show_details', true);
  const themeVar = useTemplateVal('theme', '');
  const colorPrimary = useTemplateVal('color_primary', '');
  const colorText = useTemplateVal('color_text', '');
  const backgroundColor = useTemplateVal('background_color', '');
  const weatherBackground = useTemplateVal('weather_background', 'auto');
  const logoUpload = first(useTemplateVal('logo', ''), legacy(template, 'logo'));
  const logoUrlRaw = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const logoBackground = first(useTemplateVal('color_logo_background', ''), legacy(template, 'logoBackground')) || '#FFFFFF';
  const roundedCorners = useTemplateBoolVal('rounded_corners', true);
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  let mode = themeVar;
  if (mode !== 'light' && mode !== 'dark' && mode !== 'custom') {
    mode = (colorPrimary || colorText || backgroundColor) ? 'custom' : 'light';
  }
  const theme = buildTheme({
    mode, primary: colorPrimary, text: colorText, background: backgroundColor,
  });
  if (logoUrlRaw && !validLogoUrl(logoUrlRaw) && import.meta.env && import.meta.env.DEV) {
    console.warn('[weather-flat] logo_url ignored: only public http(s) links are accepted');
  }

  return {
    unit: unit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    windUnit: windUnit === 'ms' ? 'ms' : 'kmh',
    showCity,
    showDescription,
    showMinMax,
    showDetails,
    theme,
    weatherBackground: weatherBackground === 'solid' ? 'solid' : 'auto',
    showLogo,
    logoSources: logoSources(logoUpload, logoUrlRaw),
    logoBackground,
    rounded: roundedCorners,
    animationEnabled,
    debug,
  };
}
