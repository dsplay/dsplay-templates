import { useMemo } from 'react';
import {
  useConfig, useTemplateVal, useTemplateBoolVal, useTemplateIntVal,
} from '@dsplay/react-template-utils';
import useLegacyVal from './use-template-any';
import buildClockTheme from '../utils/theme';
import {
  zonesPerPage, pageInterval, DEFAULT_ZONES_PER_PAGE, DEFAULT_PAGE_INTERVAL,
} from '../utils/paginate';

const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];
const RELIEF = ['normal', 'strong'];

// `city_01` (new) wins over `city_1` (legacy); an empty first slot is the local time
function useCity(slot) {
  const legacy = useLegacyVal([`city_${slot}`]);
  return useTemplateVal(`city_0${slot}`, slot === 1 && !legacy ? 'Local' : legacy);
}

/**
 * Every template variable (spec world-clocks-analog-neo section 6) with defaults, fallback to the legacy keys (`city_1..8`,
 * `brand`, `theme=sky`) and validation. The new key wins; when it is empty the legacy one is used; then the default.
 * NOT read: `background_image`, `background_image_portrait`, `background_overlay_opacity`, `background` and `clock_theme`
 * (neumorphism needs a smooth surface, and the theme decides the surface).
 */
export default function useSettings() {
  const { locale } = useConfig();
  const isEnUs = (locale || '').toLowerCase() === 'en_us';

  // a stable list: Main restarts the pagination when it changes, so a new array every render would loop
  const citiesKey = SLOTS.map(useCity).filter(Boolean).join('\u0001');
  const cities = useMemo(() => (citiesKey ? citiesKey.split('\u0001') : ['Local']), [citiesKey]);

  const legacyLogo = useLegacyVal(['brand', 'sponsor_logo']);
  const themeValue = useTemplateVal('theme', 'light');
  const theme = themeValue === 'dark' || themeValue === 'sky' ? 'dark' : 'light'; // `sky` was removed
  const relief = useTemplateVal('relief_strength', 'normal');
  const timeFormat = useTemplateVal('time_format', isEnUs ? '12h' : '24h');

  const look = buildClockTheme({
    theme,
    clockTheme: 'default',
    background: useTemplateVal('background_color', ''),
    primary: useTemplateVal('color_primary', ''),
    reliefStrength: RELIEF.includes(relief) ? relief : 'normal',
  });

  return {
    // nothing filled: one local clock, never an empty screen
    cities,
    look,
    hour12: timeFormat === '12h',
    showDayOffset: useTemplateBoolVal('show_day_offset', true),
    logo: useTemplateVal('logo', legacyLogo),
    logoUrl: useTemplateVal('logo_url', ''),
    logoBackground: useTemplateVal('color_logo_background', '#FFFFFF'),
    showLogo: useTemplateBoolVal('show_logo', true),
    showMap: useTemplateBoolVal('show_map', true),
    zonesPerPage: zonesPerPage(useTemplateIntVal('zones_per_page', DEFAULT_ZONES_PER_PAGE)),
    pageInterval: pageInterval(useTemplateIntVal('page_interval', DEFAULT_PAGE_INTERVAL)),
    showPageIndicator: useTemplateBoolVal('show_page_indicator', true),
    animationEnabled: useTemplateBoolVal('animation_enabled', true),
  };
}
