// Weather code -> text, icon and background family (spec weather-base, section 4).

const GROUPS = [
  { from: 200, to: 233, text: 'Thunderstorm', family: 'rain', icon: 'thunder' },
  { from: 300, to: 302, text: 'Drizzle', family: 'rain', icon: 'rain' },
  { from: 500, to: 522, text: 'Rain', family: 'rain', icon: 'rain' },
  { from: 600, to: 623, text: 'Snow', family: 'snow', icon: 'snow' },
  { from: 700, to: 751, text: 'Fog', family: 'mist', icon: 'mist' },
  { from: 800, to: 800, text: 'Clear sky', family: 'clear', icon: 'clear' },
  { from: 801, to: 801, text: 'Partly cloudy', family: 'clear', icon: 'few-clouds' },
  { from: 802, to: 803, text: 'Cloudy', family: 'clouds', icon: 'clouds' },
  { from: 804, to: 804, text: 'Overcast', family: 'clouds', icon: 'clouds' },
];

/** @returns {{ text: string, family: string, icon: string, known: boolean }} unknown codes: clouds, the service's own text */
export function conditionOf(code, day) {
  const c = Number(code);
  const group = GROUPS.find((g) => c >= g.from && c <= g.to);
  const g = group || { text: 'Unknown', family: 'clouds', icon: 'clouds' };
  const icon = g.icon === 'clear' || g.icon === 'few-clouds' ? `${g.icon}-${day ? 'day' : 'night'}` : g.icon;
  return {
    text: g.text, family: g.family, icon, known: Boolean(group),
  };
}

const minutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || ''));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Day or night by the sunrise/sunset of the city against the device clock; no data: day is 06:00-18:00. */
export function isDay(sunrise, sunset, now) {
  const at = now.getHours() * 60 + now.getMinutes();
  const rise = minutes(sunrise);
  const set = minutes(sunset);
  if (rise === null || set === null) {
    return at >= 360 && at < 1080;
  }
  return at >= rise && at < set;
}
