import {
  useConfig, useTemplateVal, useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import useLegacyVal from './use-template-any';
import buildClockTheme from '../utils/theme';

const RELIEF = ['normal', 'strong'];

/**
 * Every template variable (spec analog-clock-neo section 6). The new key wins; when it is empty the legacy one is used;
 * then the default. `background_image`, `background_image_portrait`, `background_overlay_opacity`, `background` and
 * `color_rim` are NOT read: neumorphism needs a smooth surface and the relief replaces the rim (spec section 6).
 */
export default function useSettings() {
  const { locale } = useConfig();

  // legacy `background_theme`: `sky` (removed) becomes `dark`
  // (`theme` is read twice on purpose: the literal default `light` is what the manifest scanner publishes, and the raw
  // read tells an explicit `theme` apart from a missing one, so the legacy key only applies when it is missing)
  const legacyTheme = useLegacyVal(['background_theme'], 'light');
  const explicitTheme = useLegacyVal(['theme'], '');
  const themeVar = useTemplateVal('theme', 'light');
  const themeValue = explicitTheme ? themeVar : legacyTheme;
  let theme = 'light';
  if (themeValue === 'dark' || themeValue === 'sky') theme = 'dark';

  // only `aluminum` still means something: the old `dark`/`light` values are decided by `theme` now
  const clockTheme = useTemplateVal('clock_theme', 'default') === 'aluminum' ? 'aluminum' : 'default';
  const relief = useTemplateVal('relief_strength', 'normal');

  const look = buildClockTheme({
    theme,
    clockTheme,
    background: useTemplateVal('background_color', ''),
    primary: useTemplateVal('color_primary', ''),
    face: useTemplateVal('color_face', '#FFFFFF'),
    hands: useTemplateVal('color_hands', '#111111'),
    secondHand: useTemplateVal('color_second_hand', '#111111'),
    reliefStrength: RELIEF.includes(relief) ? relief : 'normal',
  });

  return {
    look,
    showDate: useTemplateBoolVal('show_date', true),
    showNumerals: useTemplateBoolVal('show_numerals', true),
    showSecondsHand: useTemplateBoolVal('show_seconds_hand', true),
    label: useTemplateVal('clock_label', ''),
    timeZone: useTemplateVal('time_zone', ''),
    animationEnabled: useTemplateBoolVal('animation_enabled', true),
    hour12: (locale || '').toLowerCase() === 'en_us',
  };
}
