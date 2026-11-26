// The "weather background" in neomorphism: a subtle tint of the base color per family (spec weather-neo, section 4).

const TINTS = {
  clear: { light: '#E3EBF6', day: '#242B38', night: '#1F2334' },
  clouds: { light: '#E5E8ED', day: '#262A33', night: '#202330' },
  rain: { light: '#DDE5F0', day: '#222A38', night: '#1C2232' },
  snow: { light: '#E8EEF5', day: '#262C38', night: '#202638' },
  mist: { light: '#E6E8EA', day: '#292C31', night: '#202329' },
};

/** Base color of the screen for a family, theme mode ('light'|'dark') and day/night. */
// eslint-disable-next-line import/prefer-default-export
export function tintOf(family, mode, day) {
  const tint = TINTS[family] || TINTS.clouds;
  if (mode === 'dark') {
    return day ? tint.day : tint.night;
  }
  return tint.light;
}
