// The UOLIndoor feed swaps title/description fields. The DSPLAY app fixed
// this in version 40100, so the workaround only applies to older terminals.
const UOL_INDOOR_FIXED_APP_VERSION = 40100;

// A player that puts `platform` in the template's config (the newer players, and the Android build after 4.1.0) gets the item from the
// DSPLAY gateway, which already normalizes the title and the description, so it never needs the workaround whatever its version
// number is (each platform has its own version line). Only a player that does not send `platform` is judged by its app version.
function needsUolIndoorFix(source, appVersion, platform) {
  if (source !== 'UOLIndoor') {
    return false;
  }
  if (platform) {
    return false;
  }
  const version = Number(appVersion);
  // unknown version: assume an old app and keep the workaround
  return !Number.isFinite(version) || version < UOL_INDOOR_FIXED_APP_VERSION;
}

export default needsUolIndoorFix;
