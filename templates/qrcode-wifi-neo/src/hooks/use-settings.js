import {
  useTemplate, useTemplateVal, useTemplateBoolVal, useTemplateFloatVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { contrast, parseColor } from '../util/color';

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');
const PRESET_BASE = { light: '#E4E9F0', dark: '#23272E' };

/**
 * Every template variable of qrcode-wifi-neo (spec qrcode-wifi-neo, section 6).
 * `color_top` / `color_bottom` (the old two-block design) are deliberately NOT read: they are ignored.
 */
export default function useSettings() {
  const themeVar = useTemplateVal('theme', 'light');
  const mode = themeVar === 'dark' ? 'dark' : 'light';
  const backgroundColor = useTemplateVal('background_color', '');
  const colorPrimary = useTemplateVal('color_primary', '');
  const reliefStrength = useTemplateVal('relief_strength', 'normal');
  const showNetworkName = useTemplateBoolVal('show_network_name', true);
  const showPassword = useTemplateBoolVal('show_password', true);
  const showBadge = useTemplateBoolVal('show_wifi_badge', true);
  // legacy keys are read from the raw object so they stay out of the CMS manifest (only the new names are offered)
  const raw = useTemplate() || {};
  const companyLogo = first(useTemplateVal('logo', ''), raw.sponsor_logo) || '';
  const companyLogoUrl = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  const logoBackground = first(
    useTemplateVal('color_logo_background', ''),
    raw.sponsor_logo_box_color,
    raw.rss_logo_box_color,
    raw.logo_bg_color,
  ) || '#FFFFFF';
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  const qrForeground = useTemplateVal('qr_code_foreground_color', 'black');
  const qrBackground = useTemplateVal('qr_code_background_color', 'white');
  const qrQuietZone = useTemplateVal('qr_code_quiet_zone_color', qrBackground);
  const qrDotScale = useTemplateFloatVal('qr_code_dot_scale', 1);
  const qrDotScaleTiming = useTemplateFloatVal('qr_code_dot_scale_timing', qrDotScale);
  const qrLogo = useTemplateVal('qr_code_logo');
  const qrLogoTransparent = useTemplateBoolVal('qr_code_logo_background_transparent');

  const custom = parseColor(backgroundColor)
    && backgroundColor.trim().toLowerCase() !== PRESET_BASE[mode].toLowerCase();
  const preset = buildTheme({ mode, reliefStrength });
  const accent = parseColor(colorPrimary) ? colorPrimary : preset.primary;
  const theme = custom
    ? buildTheme({
      mode: 'custom', background: backgroundColor, primary: accent, reliefStrength,
    })
    : { ...preset, primary: accent };
  // F-005: the accent is only used as the badge icon color when it reads (4.5:1) on the base; else the text color
  theme.accentText = contrast(theme.primary, theme.base) >= 4.5 ? theme.primary : theme.text;

  return {
    theme,
    showNetworkName,
    showPassword,
    showBadge,
    companyLogo,
    companyLogoUrl,
    showLogo,
    logoBackground,
    animationEnabled,
    debug,
    qr: {
      foreground: qrForeground,
      background: qrBackground,
      quietZone: qrQuietZone,
      dotScale: qrDotScale,
      dotScaleTiming: qrDotScaleTiming,
      logo: qrLogo,
      logoTransparent: qrLogoTransparent,
    },
  };
}
