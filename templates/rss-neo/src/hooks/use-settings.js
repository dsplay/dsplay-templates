import {
  useTemplate, useTemplateVal, useTemplateBoolVal, useTemplateIntVal,
} from '@dsplay/react-template-utils';
import buildTheme from '../util/theme';
import { logoSources, validLogoUrl } from '../util/logo-url';

// Legacy keys (previous templates) are read by a computed key on purpose: they work, but stay out of the manifest
// (`template-variables.json`), which should list only the current variables.
const LEGACY = {
  logo: ['sponsor_logo'],
  logoBackground: ['rss_logo_box_color', 'sponsor_logo_box_color', 'logo_bg_color'],
  primary: ['title_bg_color'],
  text: ['text_color'],
  background: ['bg_color', 'text_bg_color'],
  image: ['bg'],
};
const legacy = (template, group) => LEGACY[group].map((key) => template && template[key]).find((v) => v !== undefined && v !== null && v !== '');

const first = (...values) => values.find((v) => v !== undefined && v !== null && v !== '');

/**
 * Every template variable, with the legacy keys as fallback (the new key wins).
 * Colors only matter with theme `custom`; with no `theme` and any color set (new or legacy), the template is `custom`.
 */
export default function useSettings() {
  const template = useTemplate();
  const layout = useTemplateVal('layout_variant', 'hero');
  const showClock = useTemplateBoolVal('show_clock', true);
  const clockFormat = useTemplateVal('clock_format', '24h');
  const showCategory = useTemplateBoolVal('show_category', true);
  const showDescription = useTemplateBoolVal('show_description', true);
  const showQrCode = useTemplateBoolVal('show_qr_code', true);
  // the company logo: upload (`logo`, legacy `sponsor_logo`) wins, then the public link (`logo_url`)
  const logoUpload = first(useTemplateVal('logo', ''), legacy(template, 'logo'));
  const logoUrlRaw = useTemplateVal('logo_url', '');
  const showLogo = useTemplateBoolVal('show_logo', true);
  // the logo of the feed (a small circle): upload `rss_logo` wins, then `rss_logo_url`; no default logo
  const feedLogoUpload = useTemplateVal('rss_logo', '');
  const feedLogoUrlRaw = useTemplateVal('rss_logo_url', '');
  const photoFit = useTemplateVal('photo_fit', 'auto');
  const themeVar = useTemplateVal('theme', '');
  const logoBackground = first(useTemplateVal('color_logo_background', ''), legacy(template, 'logoBackground')) || '#FFFFFF';
  const colorPrimary = first(useTemplateVal('color_primary', ''), legacy(template, 'primary'));
  const colorText = first(useTemplateVal('color_text', ''), legacy(template, 'text'));
  const backgroundColor = first(useTemplateVal('background_color', ''), legacy(template, 'background'));
  const backgroundImage = first(useTemplateVal('background_image', ''), legacy(template, 'image'));
  const backgroundImagePortrait = useTemplateVal('background_image_portrait', '');
  const overlayOpacity = useTemplateIntVal('background_overlay_opacity', 55);
  const roundedCorners = useTemplateBoolVal('rounded_corners', true);
  const nextLabel = useTemplateVal('next_label', '');
  const animationEnabled = useTemplateBoolVal('animation_enabled', true);
  const debug = useTemplateBoolVal('debug', false);

  let mode = themeVar;
  if (mode !== 'light' && mode !== 'dark' && mode !== 'custom') {
    mode = (colorPrimary || colorText || backgroundColor) ? 'custom' : 'light';
  }
  const theme = buildTheme({
    mode,
    primary: colorPrimary,
    text: colorText,
    background: backgroundColor,
  });

  if (logoUrlRaw && !validLogoUrl(logoUrlRaw) && import.meta.env && import.meta.env.DEV) {
    console.warn('[rss-v2] logo_url ignored: only public http(s) links are accepted');
  }

  const veil = Math.max(0, Math.min(100, Number.isFinite(overlayOpacity) ? overlayOpacity : 55)) / 100;

  return {
    layout: layout === 'cards' ? 'cards' : 'hero',
    showClock,
    clockFormat: clockFormat === '12h' ? '12h' : '24h',
    showCategory,
    showDescription,
    showQrCode,
    showLogo,
    photoFit: photoFit === 'cover' || photoFit === 'contain' ? photoFit : 'auto',
    logoSources: logoSources(logoUpload, logoUrlRaw),
    feedLogoSources: logoSources(feedLogoUpload, feedLogoUrlRaw),
    logoBackground,
    theme,
    backgroundImage,
    backgroundImagePortrait,
    veil,
    rounded: roundedCorners,
    nextLabel,
    animationEnabled,
    debug,
  };
}
