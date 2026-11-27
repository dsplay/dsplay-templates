import { useMedia } from '@dsplay/react-template-utils';
import { AUTH_TYPE_NOPASS, resolveAuthType } from './auth-types';
import buildWifiString from './build-wifi-string';

/** Reads the Wi-Fi network from the media data and derives what the screen needs from it. */
function useWifiNetwork() {
  const {
    ssid,
    auth_type: authType,
    password,
    hidden,
  } = useMedia() || {};

  const open = resolveAuthType(authType, password) === AUTH_TYPE_NOPASS;
  const isHidden = hidden === true || hidden === 'true';

  return {
    ssid: ssid ? String(ssid) : '',
    password: password ? String(password) : '',
    open,
    hidden: isHidden,
    text: buildWifiString({
      ssid, authType, password, hidden,
    }),
  };
}

export default useWifiNetwork;
