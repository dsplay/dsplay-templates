export const AUTH_TYPE_NOPASS = 'nopass';

// `sae` (WPA3) has no token of its own in the WIFI: QR format; scanners treat it as WPA.
export const authTypes = {
  none: AUTH_TYPE_NOPASS,
  wpa: 'WPA',
  wpa2: 'WPA',
  sae: 'WPA',
  wep: 'WEP',
};

const warned = {};

/**
 * Maps `dsplay_media.auth_type` to the WIFI: QR token.
 * An empty value means an open network. An unknown value is logged and, instead of silently
 * becoming an open network, falls back to WPA when a password was given.
 */
export function resolveAuthType(value, password) {
  const key = String(value || 'none').toLowerCase();
  if (authTypes[key]) return authTypes[key];

  if (!warned[key]) {
    warned[key] = true;
    console.warn(`[qrcode-wifi-neo] unknown auth_type "${value}", expected none, wpa, wep or sae`);
  }
  return password ? authTypes.wpa : AUTH_TYPE_NOPASS;
}
