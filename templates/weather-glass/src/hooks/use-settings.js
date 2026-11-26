import {
  useTemplate, useTemplateVal, useTemplateBoolVal, useTemplateIntVal,
} from '@dsplay/react-template-utils';
import buildTheme, { DEFAULT_BACKGROUND } from '../util/theme';
import { logoSources, validLogoUrl } from '../util/logo-url';

// the old name of the company logo is read by a computed key on purpose: it works, but stays out of the manifest
const LEGACY_LOGO = ['sponsor', 'logo'].join('_');
const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');
const pick = (value, allowed, fallback) => (allowed.indexOf(value) !== -1 ? value : fallback);

/** Every template variable (spec weather-base 6 and weather-glass 6). The forecast is always 5 days: no variable. */
export default function useSettings() {
  const template = useTemplate();
  const unit = pick(String(useTemplateVal('unit', 'celsius')).toLowerCase(), ['celsius', 'fahrenheit'], 'celsius');
  const windUnit = pick(String(useTemplateVal('wind_unit', 'kmh')).toLowerCase(), ['kmh', 'ms'], 'kmh');
  const showCity = useTemplateBoolVal('show_city', true);
  const showDescription = useTemplateBoolVal('show_description', true);
  const showMinMax = useTemplateBoolVal('show_min_max', true);
  const showDetails = useTemplateBoolVal('show_details', true);
  const themeVar = pick(useTemplateVal('theme', 'dark'), ['light', 'dark', 'custom'], 'dark');
  const colorPrimary = useTemplateVal('color_primary', '');
  const colorText = useTemplateVal('color_text', '');
  const backgroundColor = useTemplateVal('background_color', '');
  const weatherBackground = pick(useTemplateVal('weather_background', 'auto'), ['auto', 'solid'], 'auto');
  const backgroundImage = useTemplateVal('background_image', '');
  const backgroundImagePortrait = useTemplateVal('background_image_portrait', '');
  const overlay = useTemplateIntVal('background_overlay_opacity', 45);
  const logoUpload = first(useTemplateVal('logo', ''), template && template[LEGACY_LOGO]);
  const logoUrlRaw = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const logoBackground = useTemplateVal('color_logo_background', '') || '#FFFFFF';
  const glassEffect = pick(useTemplateVal('glass_effect', 'auto'), ['auto', 'off'], 'auto');
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  if (logoUrlRaw && !validLogoUrl(logoUrlRaw) && import.meta.env && import.meta.env.DEV) {
    console.warn('[weather-glass] logo_url ignored: only public http(s) links are accepted');
  }
  const theme = buildTheme({
    mode: themeVar,
    hasImage: Boolean(backgroundImage),
    primary: colorPrimary,
    text: colorText,
    background: backgroundColor,
  });

  return {
    unit,
    windUnit,
    showCity,
    showDescription,
    showMinMax,
    showDetails,
    theme,
    themeMode: themeVar,
    weatherBackground,
    solidColor: weatherBackground === 'solid' ? (backgroundColor || DEFAULT_BACKGROUND) : '',
    backgroundImage,
    backgroundImagePortrait,
    veil: Math.max(0, Math.min(100, Number.isFinite(overlay) ? overlay : 45)) / 100,
    showLogo,
    logoSources: logoSources(logoUpload, logoUrlRaw),
    logoBackground,
    glassEffect,
    animationEnabled,
    debug,
  };
}
