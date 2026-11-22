// Pure helpers for the Main component: what the `environment/1` answer (`media.result`) becomes on screen.

/** Used when the media has no usable duration (it always has one in the player). */
export const FALLBACK_PAGE_MS = 8000;

/**
 * How many rain cards one page holds: the cells of the grid the stylesheet draws for the screen format (2 columns by 4 rows in landscape, 3 by 3 on a portrait
 * screen, 3 by 2 on a square one, which has less height for the stacked panels), so nothing has to be configured and a page is always full except the last.
 */
export const cardsPerPage = (screenFormat) => {
  if (screenFormat === 'portrait') return 9;
  if (screenFormat === 'square') return 6;
  return 8;
};

/**
 * How many river rows fit the panel in each format (the service lists the most serious first, so what is left out is the least): a row is never shown half.
 * 5 in landscape, 12 in portrait (two columns of 6), 4 on a square screen (two columns of 2).
 */
export const riversShown = (screenFormat) => {
  if (screenFormat === 'portrait') return 12;
  if (screenFormat === 'square') return 4;
  return 5;
};

/** How many warning cards one page of the alerts panel holds (2 columns by 2 rows, or 1 by 4 stacked). */
export const ALERT_CARDS_PER_PAGE = 4;

/** What the answer brings, so that a panel is drawn only for information that exists: an absent dataset is no panel, an empty one is a panel that says so. */
export function panelsOf(data) {
  const present = (list) => Array.isArray(list);
  const panels = {
    rain: present(data.rainfall),
    rivers: present(data.rivers),
    conditions: present(data.conditions),
    climate: present(data.climate) && data.climate.length > 0,
    alerts: present(data.alerts),
  };
  // A place whose only information is warnings (the United States, Canada, Europe) gets them as a panel of their own; otherwise they ride in the banner.
  panels.alertsPanel = panels.alerts && !(panels.rain || panels.rivers || panels.conditions || panels.climate);
  panels.any = panels.rain || panels.rivers || panels.conditions || panels.climate || panels.alerts;
  return panels;
}

/** The rain cards are paged; every page is shown for the same time, so that the pages together last as long as the media. */
export function pageInterval(durationMs, totalPages) {
  if (!(durationMs > 0) || totalPages < 1) return FALLBACK_PAGE_MS;
  return Math.max(1000, Math.floor(durationMs / totalPages));
}

export const SEVERITY_CLASS = {
  light: 'fraca',
  moderate: 'moderada',
  heavy: 'forte',
  very_heavy: 'muito-forte',
  extreme: 'extrema',
};

/** The English text of each intensity, which is also its translation key (see i18n.js). */
export const SEVERITY_LABELS = {
  fraca: 'Light',
  moderada: 'Moderate',
  forte: 'Heavy',
  'muito-forte': 'Very heavy',
  extrema: 'Extreme',
};

/** The stations that are raining right now (the last hour), in the order the service ranked them. */
export function rainingStations(rainfall) {
  return (rainfall || []).filter((s) => s.last1hMm > 0 && SEVERITY_CLASS[s.intensity]);
}

const RIVER_STATUS_CLASS = { attention: 'pre-alerta', alert: 'alerta', flood: 'enchente' };

/** The card's colour class for a river's status (`normal` has its own). */
export const riverStatusClass = (status) => RIVER_STATUS_CLASS[status] || 'normal';

/** The English text (and translation key) of each banner level. */
export const BANNER_LABELS = { 'pre-alerta': 'Pre-alert', alerta: 'Alert', enchente: 'Flood' };
const ALERT_SEVERITY_CLASS = {
  minor: 'pre-alerta', moderate: 'alerta', severe: 'enchente', extreme: 'enchente', unknown: 'pre-alerta',
};

/**
 * The banner's items: the rivers above their attention level and the weather warnings in effect, most serious first. Each says what to write, not the
 * words: a river is its level's label, its name and its level; a warning is the event as its source wrote it, its first place and how many more.
 */
export function bannerItems(rivers, alerts) {
  const order = { enchente: 3, alerta: 2, 'pre-alerta': 1 };
  const items = [
    ...(rivers || [])
      .filter((r) => RIVER_STATUS_CLASS[r.status])
      .map((r) => ({
        key: `river-${r.id}`,
        status: RIVER_STATUS_CLASS[r.status],
        river: { name: r.river || r.name, levelCm: r.levelCm },
      })),
    ...(alerts || []).map((a) => ({
      key: `alert-${a.id}`,
      status: ALERT_SEVERITY_CLASS[a.severity] || 'pre-alerta',
      alert: { event: a.event, area: a.areas && a.areas.length > 0 ? a.areas[0] : null, more: Math.max(0, (a.areaCount || 0) - 1) },
    })),
  ];
  return items.sort((a, b) => order[b.status] - order[a.status]);
}

/** How full the river's bar is: the level against the highest stage the state sets for it. */
export function riverProgress(river) {
  const { attention, alert, flood } = river.thresholds || {};
  const ref = flood || alert || attention;
  if (!ref || ref <= 0) return river.levelCm > 0 ? 50 : 0;
  return Math.min(100, (river.levelCm / ref) * 100);
}

const SHORT_NAMES = {
  'Agreste Pernambucano': 'Agreste',
  'Mata Pernambucana': 'Mata PE',
  'Metropolitana de Recife': 'RMR',
  'Sertão Pernambucano': 'Sertão',
  'São Francisco Pernambucano': 'S. Francisco',
};

export const shortRegionName = (name) => SHORT_NAMES[name] || name;

/** The credit lines of the sources that served this answer, once each: the data providers ask to be named where their data is shown. */
export function attributions(sources) {
  return [...new Set(Object.values(sources || {}).map((s) => s.attribution && s.attribution.text).filter(Boolean))];
}

/** The names of the sources that served this answer, once each, in the order of the datasets. */
export function sourceNames(sources) {
  return [...new Set(Object.values(sources || {}).map((s) => s.name))];
}

/**
 * What the banner formats (a thin strip, a narrow column) rotate through, most urgent first: the banner items (rivers above their attention level and
 * warnings), then the stations raining. Each says what to write; the component writes it.
 */
export function bannerFeed(data) {
  const urgent = bannerItems(data.rivers, data.alerts).map((item) => (item.river
    ? { key: item.key, status: item.status, label: BANNER_LABELS[item.status], title: item.river.name, value: item.river.levelCm.toFixed(1), unit: 'cm' }
    : { key: item.key, status: item.status, title: item.alert.event, detail: item.alert.area }));
  const raining = rainingStations(data.rainfall).map((station) => ({
    key: `rain-${station.id}`,
    status: SEVERITY_CLASS[station.intensity],
    title: station.name,
    detail: station.city,
    value: station.last1hMm.toFixed(1),
    unit: 'mm',
  }));
  return [...urgent, ...raining].slice(0, 12);
}
