import { useTemplate, useTemplateVal, useTemplateBoolVal } from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { contrast, parseColor } from '../util/color';
import { LEGACY_KEYS, withLegacy } from '../utils/template-vars';
import { resolveTimeFormat } from '../utils/locale';

const PRESET_BASE = { light: '#E4E9F0', dark: '#23272E' };

/**
 * Every template variable of meeting-room-neo (spec meeting-room-neo, section 6). Legacy camelCase keys are read from
 * the raw object (new > legacy > default); background_image*, color_host_panel and rightColorBottom are never read.
 */
export default function useSettings(locale) {
  const raw = useTemplate() || {};
  const themeVar = useTemplateVal('theme', 'light');
  const mode = themeVar === 'dark' ? 'dark' : 'light';
  const backgroundColor = useTemplateVal('background_color', '');
  const colorPrimary = withLegacy(useTemplateVal('color_primary', ''), raw, LEGACY_KEYS.color_primary, '');
  const colorText = useTemplateVal('color_text', '');
  const logoCard = withLegacy(useTemplateVal('color_logo_card', ''), raw, LEGACY_KEYS.color_logo_card, '#FFFFFF');
  const reliefStrength = useTemplateVal('relief_strength', 'normal');
  const eventLogo = withLegacy(useTemplateVal('event_logo', ''), raw, LEGACY_KEYS.event_logo, '');
  const hostLogo = withLegacy(useTemplateVal('host_logo', ''), raw, LEGACY_KEYS.host_logo, '');
  const showStatus = useTemplateBoolVal('show_status', true);
  const timeFormat = resolveTimeFormat(useTemplateVal('time_format', ''), locale);
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);

  const custom = parseColor(backgroundColor)
    && backgroundColor.trim().toLowerCase() !== PRESET_BASE[mode].toLowerCase();
  const preset = buildTheme({ mode, reliefStrength });
  const accent = parseColor(colorPrimary) ? colorPrimary : preset.primary;
  const theme = custom
    ? buildTheme({
      mode: 'custom', background: backgroundColor, primary: accent, text: colorText, reliefStrength,
    })
    : buildTheme({
      mode, primary: accent, reliefStrength,
    });
  if (!custom && parseColor(colorText)) {
    theme.text = contrast(colorText, theme.base) >= 4.5 ? colorText : theme.text;
  }
  theme.primary = accent;
  // F-005: the accent (marker, ring) is only used when it reads (4.5:1) on the base; otherwise the text color
  theme.accentText = contrast(theme.primary, theme.base) >= 4.5 ? theme.primary : theme.text;

  return {
    theme, eventLogo, hostLogo, logoCard, showStatus, timeFormat, animationEnabled,
  };
}
