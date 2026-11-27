// Reads a template variable under its new snake_case key and, when it is empty, under the legacy camelCase key
// customers already have saved in the CMS (new key wins, then legacy, then default). The legacy key is read from the
// raw template object on purpose: the manifest only lists variables read with a literal key, so the legacy ones stay
// readable without showing up as new variables in the CMS.
export function withLegacy(value, template, legacyKey, fallback) {
  if (value) return value;
  const legacy = template ? template[legacyKey] : undefined;
  return legacy || fallback;
}

// Each new variable and the legacy key it replaces (documented in the README).
export const LEGACY_KEYS = {
  event_logo: 'eventLogo',
  host_logo: 'hostLogo',
  color_primary: 'mainColor', // the old full background color is now the accent (marker and ring)
  color_logo_card: 'rightColorTop', // the old host panel color is now the background of the logo tiles
};
// Read and ignored: rightColorBottom / color_location_panel, color_host_panel, background_image*, background_overlay_*.
