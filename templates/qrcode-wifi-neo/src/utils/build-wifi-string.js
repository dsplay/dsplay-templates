import { AUTH_TYPE_NOPASS, resolveAuthType } from './auth-types';

// Characters with a meaning in the WIFI: format must be escaped with a backslash.
const SPECIAL_CHARS = /[\\;,:"]/g;

export const escapeWifiValue = (value) => String(value === undefined || value === null ? '' : value)
  .replace(SPECIAL_CHARS, '\\$&');

/**
 * Builds the standard `WIFI:T:<auth>;S:<ssid>;P:<password>;H:true;;` connection string.
 * `P` is omitted for open networks and `H` only when the network is hidden.
 */
function buildWifiString({
  ssid, authType, password, hidden,
}) {
  const type = resolveAuthType(authType, password);
  const parts = [`S:${escapeWifiValue(ssid)}`, `T:${type}`];

  if (type !== AUTH_TYPE_NOPASS && password) parts.push(`P:${escapeWifiValue(password)}`);
  if (hidden === true || hidden === 'true') parts.push('H:true');

  return `WIFI:${parts.join(';')};;`;
}

export default buildWifiString;
