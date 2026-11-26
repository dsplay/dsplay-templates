import {
  useTemplateVal, useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

/** Every template variable of weather-neo (spec weather-base section 6 + weather-neo section 7). */
export default function useSettings() {
  const unitVar = String(useTemplateVal('unit', 'celsius') || '').toLowerCase();
  const windUnitVar = String(useTemplateVal('wind_unit', 'kmh') || '').toLowerCase();
  const showCity = useTemplateBoolVal('show_city', true);
  const showDescription = useTemplateBoolVal('show_description', true);
  const showMinMax = useTemplateBoolVal('show_min_max', true);
  const showDetails = useTemplateBoolVal('show_details', true);
  const themeVar = useTemplateVal('theme', '');
  const reliefStrength = useTemplateVal('relief_strength', 'normal');
  const colorPrimary = useTemplateVal('color_primary', '');
  const colorText = useTemplateVal('color_text', '');
  const backgroundColor = useTemplateVal('background_color', '');
  const backgroundMode = useTemplateVal('weather_background', 'auto');
  const companyLogo = first(useTemplateVal('logo', ''), useTemplateVal('sponsor_logo', '')) || '';
  const companyLogoUrl = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const logoBackground = first(
    useTemplateVal('color_logo_background', ''),
    useTemplateVal('sponsor_logo_box_color', ''),
    useTemplateVal('rss_logo_box_color', ''),
    useTemplateVal('logo_bg_color', ''),
  ) || '#FFFFFF';
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  let mode = themeVar;
  if (mode !== 'light' && mode !== 'dark' && mode !== 'custom') {
    mode = (colorPrimary || colorText || backgroundColor) ? 'custom' : 'light';
  }
  const theme = buildTheme({
    mode, primary: colorPrimary, text: colorText, background: backgroundColor, reliefStrength,
  });

  return {
    unit: unitVar === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    windUnit: windUnitVar === 'ms' ? 'ms' : 'kmh',
    showCity,
    showDescription,
    showMinMax,
    showDetails,
    theme,
    mode,
    // 'custom' always paints the operator's color; 'auto' tints the base by weather
    solid: backgroundMode === 'solid' || mode === 'custom',
    companyLogo,
    companyLogoUrl,
    showLogo,
    logoBackground,
    animationEnabled,
    debug,
  };
}
