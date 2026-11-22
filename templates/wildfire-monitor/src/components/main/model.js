import COUNTRY_NAMES from './country-names';

// Pure helpers for the Main component: what the `wildfire/1` answer (`media.result`) becomes on screen.

/**
 * How many rows of the ranking fit the panel in each format (the service sends the 10 with the most detections): a row is never shown half.
 * 8 in landscape, 10 in portrait, 5 on a square screen, which has less height for the stacked panels.
 */
export const regionsShown = (screenFormat) => {
  if (screenFormat === 'portrait') return 10;
  if (screenFormat === 'square') return 5;
  return 8;
};

/** What the answer brings, so that a panel is drawn only for information that exists. */
export function panelsOf(data) {
  const summary = data && data.summary;
  const regions = (data && data.regions) || [];
  const points = (data && data.points) || [];
  return {
    stats: !!summary,
    regions: regions.length > 0,
    map: points.length > 0 || !!(data && data.scope),
    any: !!summary,
  };
}

/**
 * The change of the last 24 hours against the 24 before, said as a direction and a whole percent. With nothing before there is no percent to give:
 * `new` when there are detections now, `flat` when there are none either way.
 */
export function trend(summary) {
  const now = (summary && summary.last24h) || 0;
  const before = (summary && summary.previous24h) || 0;
  if (before === 0) return { direction: now > 0 ? 'new' : 'flat', percent: null };
  const percent = Math.round(((now - before) / before) * 100);
  if (percent === 0) return { direction: 'flat', percent: 0 };
  return { direction: percent > 0 ? 'up' : 'down', percent: Math.abs(percent) };
}

/** The 27 Brazilian states, the only subdivisions the service ranks today (a proper name is written the same in every language). */
export const BR_STATES = {
  AC: 'Acre',
  AL: 'Alagoas',
  AM: 'Amazonas',
  AP: 'Amapá',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MG: 'Minas Gerais',
  MS: 'Mato Grosso do Sul',
  MT: 'Mato Grosso',
  PA: 'Pará',
  PB: 'Paraíba',
  PE: 'Pernambuco',
  PI: 'Piauí',
  PR: 'Paraná',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RO: 'Rondônia',
  RR: 'Roraima',
  RS: 'Rio Grande do Sul',
  SC: 'Santa Catarina',
  SE: 'Sergipe',
  SP: 'São Paulo',
  TO: 'Tocantins',
};

/** The country in the screen's language when the WebView can say it, else in English, else its code. */
export function countryName(code, language) {
  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const name = new Intl.DisplayNames([language || 'en'], { type: 'region', fallback: 'code' }).of(code);
      if (name && name !== code) return name;
    }
  } catch {
    // an unknown language or code: the English table answers
  }
  return COUNTRY_NAMES[code] || code;
}

/** `BR` is a country, `BR-PE` a state: the name to draw for a code of the ranking. */
export function regionName(code, language) {
  const [country, subdivision] = code.split('-');
  if (!subdivision) return countryName(country, language);
  return country === 'BR' && BR_STATES[subdivision] ? BR_STATES[subdivision] : subdivision;
}

const KM_PER_DEGREE = 111.32;

/** The box the map shows, `[[south, west], [north, east]]`: the circle of a radius scope, the whole world for the world scope, the points for a country. */
export function mapBounds(data) {
  const scope = (data && data.scope) || { type: 'world' };
  if (scope.type === 'radius') {
    const dLat = scope.radiusKm / KM_PER_DEGREE;
    const dLon = scope.radiusKm / (KM_PER_DEGREE * Math.max(Math.cos((scope.lat * Math.PI) / 180), 0.05));
    return [[scope.lat - dLat, scope.lon - dLon], [scope.lat + dLat, scope.lon + dLon]];
  }
  const points = (data && data.points) || [];
  if (scope.type === 'country' && points.length > 0) {
    const lats = points.map((p) => p.lat);
    const lons = points.map((p) => p.lon);
    return [[Math.min(...lats), Math.min(...lons)], [Math.max(...lats), Math.max(...lons)]];
  }
  if (scope.type === 'country') return [[scope.lat - 5, scope.lon - 5], [scope.lat + 5, scope.lon + 5]];
  return [[-58, -170], [75, 170]];
}

/**
 * Where a position falls in a box of `width` by `height` pixels that shows `bounds` (`[[south, west], [north, east]]`): a plain latitude/longitude grid with the
 * longitudes narrowed by the cosine of the middle latitude, so a country keeps its shape, fitted and centred with a margin.
 */
export function projection(bounds, width, height, margin = 8) {
  const [[south, west], [north, east]] = bounds;
  const middle = (south + north) / 2;
  const narrow = Math.max(Math.cos((middle * Math.PI) / 180), 0.2);
  const spanX = Math.max((east - west) * narrow, 0.0001);
  const spanY = Math.max(north - south, 0.0001);
  const scale = Math.min((width - 2 * margin) / spanX, (height - 2 * margin) / spanY);
  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;
  return {
    scale,
    x: (lon) => offsetX + (lon - west) * narrow * scale,
    y: (lat) => offsetY + (north - lat) * scale,
  };
}

/** The `d` of an SVG path for a flat ring `[lon, lat, lon, lat, ...]`, or `''` when no point of it falls in the box. */
export function ringPath(ring, project, width, height) {
  let inside = false;
  let d = '';
  for (let i = 0; i < ring.length; i += 2) {
    const x = project.x(ring[i]);
    const y = project.y(ring[i + 1]);
    if (x >= 0 && x <= width && y >= 0 && y <= height) inside = true;
    d += `${i === 0 ? 'M' : 'L'}${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;
  }
  return inside ? `${d}Z` : '';
}

/** The four tones of a fire's intensity on the map, from the weakest (yellow) to the strongest (red). */
export const INTENSITY_COLORS = ['#ffd84d', '#ffa726', '#ff6a1a', '#e0301f'];

/**
 * How intense the fire of a map cell is, 0 (yellow) to 3 (red): by the strongest fire radiative power in the cell (megawatts: under 5, 5 to 20, 20 to 60, 60 and
 * more), or, when the sensor gave none, by how many detections the cell holds (under 5, 5 to 19, 20 and more).
 */
export function intensityOf(point) {
  const frp = point && point.frpMw;
  if (typeof frp === 'number') {
    if (frp >= 60) return 3;
    if (frp >= 20) return 2;
    if (frp >= 5) return 1;
    return 0;
  }
  const count = (point && point.count) || 0;
  if (count >= 20) return 2;
  if (count >= 5) return 1;
  return 0;
}

/** The radius of a dot on the map, in pixels: the area grows with the number of detections it stands for, between a floor and a ceiling. */
export function dotRadius(count, max, base) {
  const share = max > 0 ? Math.sqrt(count / max) : 0;
  return Math.round((base * (0.3 + 0.7 * share)) * 10) / 10;
}

/** The strongest dot's count, the scale of every dot. */
export const maxCount = (points) => (points || []).reduce((m, p) => Math.max(m, p.count), 0);

/** The title of the area the answer is about: the country, the radius around a place, or the world. */
export function scopeLabel(scope, language, t) {
  if (!scope || scope.type === 'world') return t('The whole world');
  if (scope.type === 'country') return countryName(scope.country, language);
  return t('{{km}} km around the place', { km: scope.radiusKm });
}

/** The sources that gave the data, once each: what the footer credits. */
export function attributions(sources) {
  const seen = new Set();
  return (sources || []).flatMap((source) => {
    if (!source || !source.text || seen.has(source.text)) return [];
    seen.add(source.text);
    return [source.text];
  });
}

/** Whole numbers with thousands separators in the screen's language. */
export const formatCount = (n, language) => Number(n || 0).toLocaleString(language || 'en');
