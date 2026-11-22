// The slides of the spotlight family: one widget at a time, with its detail. Pure functions, tested in spotlight.test.js.
//
// The same answer as the panel's (see model.js), read for detail: the forecast and the facts of the weather, the chart and the two currencies, the photo of a news item, the next holidays,
// the counters, a joke. Every widget that plays is a slide, in the order the media sets; the quotes of the two currencies are one slide. A widget that failed, or that has nothing to show, is left out.

import {
  bodyOf, typeOfId, weatherKind, formatTemp, unitOf, pick, shorten,
} from './model';
import { flagUrl } from './flags';
import { stringsOf } from './strings';
import { GLYPH, signName, signDates } from './zodiac';

const DAY = 86400000;

// the icons of the media types in the CMS, without their tile
const ICON = {
  news: 'M4 5h16v14H4z M4 15l5-5 4 4 3-3 4 4 M9 9.5h.01',
  weather: 'M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.5 1A3.5 3.5 0 0 1 16 18z',
  sun: 'M12 4v2 M12 18v2 M4 12h2 M18 12h2 M6.3 6.3l1.4 1.4 M16.3 16.3l1.4 1.4 M17.7 6.3l-1.4 1.4 M7.7 16.3l-1.4 1.4 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  rain: 'M7 14a4 4 0 0 1 0-8 5 5 0 0 1 9.5 1A3.5 3.5 0 0 1 16 14z M8 17l-1 3 M12 17l-1 3 M16 17l-1 3',
  holiday: 'M4 6h16v14H4z M8 3v4 M16 3v4 M12 9.8 L13.1 12.7 L16.2 12.8 L13.8 14.8 L14.6 17.8 L12 16.1 L9.4 17.8 L10.2 14.8 L7.8 12.8 L10.9 12.7z',
  countdown: 'M7 3h10 M7 21h10 M7 3c0 5 5 6 5 9s-5 4-5 9 M17 3c0 5-5 6-5 9s5 4 5 9',
  countup: 'M10 2h4 M12 14l3-3 M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
  joke: 'M4 4.5h16v11H10l-5 4.5v-4.5H4z M9 9h.01 M15 9h.01 M8.5 12c1.8 1.6 5.2 1.6 7 0',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
};
const ALERT_PATH = 'M12 3.2 L21.4 19.6 H2.6 Z M12 9.5 V14 M12 16.9 h.01';
// the little icon of a day, drawn with HTML boxes (so it can move): which of the sun, the cloud and the falling drops it has
const DAY_ICON = {
  sun: { sun: true }, partly: { sun: true, cloud: true }, cloud: { cloud: true }, fog: { cloud: true }, snow: { cloud: true }, rain: { cloud: true, drops: true }, storm: { cloud: true, drops: true },
};

const text = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const num = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const localDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(String(value || ''));
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null;
};
const safe = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};
const long = (date, lng, options) => safe(() => date.toLocaleDateString(lng, options), safe(() => date.toLocaleDateString('en', options), ''));
const upper = (value) => value.replace(/\./g, '').replace(/\s+de\s+/i, ' ').toUpperCase();

/** The points of a chart, "x,y" in a 290x100 box, from a series of prices (oldest first); empty when there are fewer than two. */
export function chartPoints(series) {
  const values = Array.isArray(series) ? series.filter((v) => typeof v === 'number' && Number.isFinite(v)) : [];
  if (values.length < 2) return '';
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  return values.map((v, i) => `${Math.round((i * 290) / (values.length - 1))},${(90 - ((v - lo) / span) * 80).toFixed(1)}`).join(' ');
}

const weatherSlide = (data, ctx) => {
  const unit = unitOf(data.unit);
  const w = data.weather;
  const current = w && w.current;
  const temp = current && num(current.temp);
  if (temp === null || temp === undefined) return null;
  const kind = weatherKind(current.icon);
  const facts = [];
  if (num(current.humidity) !== null) facts.push({ k: ctx.t.humidity, v: `${Math.round(current.humidity)}%` });
  if (num(current.wind) !== null) facts.push({ k: ctx.t.wind, v: `${Math.round(current.wind * 3.6)} km/h` });
  if (text(current.sunrise)) facts.push({ k: ctx.t.sunrise, v: text(current.sunrise) });
  if (text(current.sunset)) facts.push({ k: ctx.t.sunset, v: text(current.sunset) });
  const days = [];
  const forecast = Array.isArray(w.forecast) ? w.forecast : [];
  const todayMin = num(current.min);
  const todayMax = num(current.max);
  if (todayMin !== null && todayMax !== null) days.push({ d: ctx.t.today, hi: formatTemp(todayMax, unit), lo: formatTemp(todayMin, unit), ...DAY_ICON[kind] });
  forecast.slice(0, 5 - days.length).forEach((day) => {
    const date = localDate(day.date);
    if (!date || num(day.max) === null || num(day.min) === null) return;
    days.push({ d: long(date, ctx.lng, { weekday: 'short' }).replace(/\./g, ''), hi: formatTemp(day.max, unit), lo: formatTemp(day.min, unit), ...DAY_ICON[weatherKind(day.icon)] });
  });
  days.forEach((day, n) => { day.delay = `${0.3 + n * 0.12}s`; });
  const city = text(w.city);
  const description = text(current.description);
  return {
    kind: 'weather', isWeather: true, hasTag: true, hasFacts: facts.length > 0, wx: kind, dayIcon: DAY_ICON[kind], icon: ICON.weather, tagText: city || ctx.t.weather, temp: formatTemp(temp, unit, true), text: description, facts, days,
    line: [city, formatTemp(temp, unit, true), description].filter(Boolean).join(' · '),
  };
};

const quotesSlide = (data, ctx) => {
  const list = (Array.isArray(data.items) ? data.items : []).filter((it) => it && text(it.code) && num(it.price) !== null && it.price > 0).slice(0, 2);
  if (!list.length) return null;
  let format;
  try {
    format = new Intl.NumberFormat(ctx.lng, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    format = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const items = list.map((it) => {
    const change = num(it.changePct) || 0;
    const dir = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    const series = Array.isArray(it.series) ? it.series.filter((v) => num(v) !== null) : [];
    const code = text(it.code).toUpperCase();
    return {
      flag: flagUrl(code), tagText: code, full: text(it.name), b: format.format(it.price), dir,
      delta: dir === 'flat' ? '' : `${dir === 'up' ? '▲' : '▼'} ${format.format(Math.abs(change))}%`,
      series: chartPoints(series), lo: series.length ? format.format(Math.min(...series)) : '', hi: series.length ? format.format(Math.max(...series)) : '',
    };
  });
  return { kind: 'quotes2', isQuotes2: true, base: text(data.base).toUpperCase(), baseFlag: flagUrl(text(data.base).toUpperCase()), labelBase: ctx.t.quoteBase, labelVs: ctx.t.quoteVs, flag1: items[0].flag, flag2: items[1] ? items[1].flag : null, items, line: items.map((i) => `${i.tagText} ${i.b} ${i.delta}`.trim()).join(' · ') };
};

const newsSlide = (data, ctx) => {
  const item = pick(Array.isArray(data.items) ? data.items.filter((it) => it && text(it.title)) : [], ctx.iteration);
  if (!item) return null;
  const images = Array.isArray(item.images) ? item.images : [];
  const image = images.map((im) => (typeof im === 'string' ? im : im && im.url)).find((u) => /^https?:/.test(u || ''));
  return { kind: 'news', isNews: true, isTitled: true, hasTag: true, icon: ICON.news, logo: /^https?:/.test(text(data.logo)) ? text(data.logo) : '', tagText: [ctx.t.news, text(data.title)].filter(Boolean).join(' · '), image: image || '', title: text(item.title), text: shorten(item.description, 160), line: text(item.title) };
};

const holidaysSlide = (data, ctx) => {
  const today = startOfDay(localDate(data.date) || ctx.now);
  const next = (Array.isArray(data.holidays) ? data.holidays : []).map((h) => ({ h, d: localDate(h.date) })).filter((x) => x.d && x.d >= today && text(x.h.name)).sort((a, b) => a.d - b.d).slice(0, 3);
  if (!next.length) return null;
  const rows = next.map(({ h, d }, n) => {
    const days = Math.round((d - today) / DAY);
    return { d: String(d.getDate()).padStart(2, '0'), m: upper(long(d, ctx.lng, { month: 'short' })), n: text(h.name), w: days === 0 ? ctx.t.today : `${ctx.t.in} ${days} ${ctx.t.days}`, delay: `${0.2 + n * 0.15}s` };
  });
  return { kind: 'hol', isHol: true, hasTag: true, icon: ICON.holiday, tagText: ctx.t.holidays, mon: rows[0].m, dayNum: String(next[0].d.getDate()), rows, line: `${rows[0].n} · ${rows[0].w}` };
};

const counterSlide = (type, data, ctx) => {
  const when = localDate(data.date);
  if (!when || !text(data.title)) return null;
  const ahead = type === 'countdown';
  if (ahead ? when < ctx.now : when > ctx.now) return null;
  const ms = Math.abs(ahead ? when - ctx.now : ctx.now - when);
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const title = `${ahead ? ctx.t.daysTo : ctx.t.days} ${text(data.title)}`;
  return {
    kind: ahead ? 'count' : 'up', isBig: true, isTitled: true, hasTag: true, icon: ICON[type], tagText: ctx.t[type], big: String(days), title,
    text: `${long(when, ctx.lng, { day: 'numeric', month: 'long' })} · ${days} d ${String(hours).padStart(2, '0')} h ${String(minutes).padStart(2, '0')} min`, line: `${days} ${title}`,
  };
};

const jokeSlide = (data, ctx) => {
  const joke = pick(Array.isArray(data.jokes) ? data.jokes.filter((j) => j && text(j.setup) && text(j.punchline)) : [], ctx.iteration);
  return joke && { kind: 'joke', isJoke: true, hasTag: true, icon: ICON.joke, tagText: ctx.t.joke, q: text(joke.setup), a: text(joke.punchline), line: text(joke.setup) };
};

const clockSlide = (data, ctx) => {
  const date = ctx.now;
  const time = safe(() => date.toLocaleTimeString(ctx.lng, { hour: '2-digit', minute: '2-digit', hour12: data.hour12 === true }), '00:00');
  const [hours, minutes] = time.split(':');
  return {
    kind: 'clock', isClock: true, isTitled: true, hasTag: true, icon: ICON.clock, tagText: ctx.t.clock, hours, minutes: minutes || '00',
    title: long(date, ctx.lng, { weekday: 'long', day: 'numeric', month: 'long' }), text: '', line: `${upper(long(date, ctx.lng, { day: '2-digit', month: 'short' }))} · ${time}`,
    dateShort: upper(long(date, ctx.lng, { day: '2-digit', month: 'short' })),
  };
};

const hourOf = (iso, lng) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : safe(() => date.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit' }), '');
};

/** One slide per active alert (the gateway sends them worst first): the severity colors the hero, the facts are severity, start, end and source. */
const alertSlides = (data, ctx) => {
  const items = (Array.isArray(data.items) ? data.items : []).filter((a) => a && text(a.event) && ['moderate', 'severe', 'extreme'].includes(a.severity));
  return items.map((a) => {
    const until = hourOf(a.expires, ctx.lng);
    const place = text(Array.isArray(a.areas) ? a.areas[0] : '');
    const facts = [{ k: ctx.t.severity, v: ctx.t[a.severity] }, { k: ctx.t.start, v: hourOf(a.onset, ctx.lng) }, { k: ctx.t.end, v: until }, { k: ctx.t.source, v: text(a.sender) }].filter((f) => f.v);
    const title = [text(a.event), place].filter(Boolean).join(' · ');
    return {
      kind: `alert sev-${a.severity}`, isAlert: true, isTitled: true, hasTag: true, hasFacts: facts.length > 0, icon: ALERT_PATH, tagText: `${ctx.t.alert} · ${text(a.event)}`, title,
      text: [until && `${ctx.t.until} ${until}`, shorten(a.description, 160)].filter(Boolean).join('. '), facts, line: `⚠ ${title}${until ? ` · ${ctx.t.until} ${until}` : ''}`,
    };
  });
};

/** One sign per showing, in turn: the glyph and the name in the hero, the keyword as the title and the text of the day under it. */
const horoscopeSlide = (data, ctx) => {
  const entry = pick(Array.isArray(data.signs) ? data.signs.filter((s) => s && GLYPH[s.sign] && text(s.text)) : [], ctx.iteration);
  if (!entry) return null;
  const name = signName(entry.sign, ctx.lng);
  const dates = signDates(entry.from, entry.to, ctx.lng);
  return {
    kind: 'horo', isHoro: true, isTitled: true, hasTag: true, signName: name, icon: GLYPH[entry.sign], tagText: [ctx.t.horoscope, name, dates].filter(Boolean).join(' \u00b7 '),
    title: text(entry.keyword) || name, text: text(entry.text), lead: name, line: text(entry.keyword) || text(entry.text),
  };
};

const logoSlide = (data) => (text(data.url) ? { kind: 'logo', isLogo: true, url: data.url, line: '' } : null);

/**
 * The spotlight: `slides` (each lasts 8 s, in the order of the answer), the `pinned` clock and logo when the template pins them to the top bar (they then leave the loop), and the
 * dots' count. Returns null when the answer is not a panel's.
 */
export function readSpotlight(media, {
  lng = 'en', iteration = 0, now = new Date(), pin = false,
} = {}) {
  const body = bodyOf(media);
  if (!body) return null;
  const fixed = Array.isArray(body.fixed) ? body.fixed : [];
  const rotating = Array.isArray(body.rotating) ? body.rotating : [];
  const ids = Array.isArray(body.order) ? body.order.filter((id) => fixed.includes(id) || rotating.includes(id)) : [...fixed, ...rotating];
  const ctx = { lng, iteration, now, t: stringsOf(lng) };
  const slides = [];
  const pinned = {};
  ids.forEach((id) => {
    const widget = body.widgets[id];
    if (!widget || widget.status !== 'ok') return;
    const type = typeOfId(id);
    const data = widget.data || {};
    if (pin && (type === 'clock' || type === 'logo')) {
      pinned[type] = type === 'clock' ? { hour12: data.hour12 === true, timezone: text(data.timezone) } : text(data.url) ? { url: data.url } : null;
      return;
    }
    if (type === 'alerts') {
      alertSlides(data, ctx).forEach((alertSlide) => slides.push({ ...alertSlide, key: `${id}-${slides.length}`, delay: `${slides.length * 8}s` }));
      return;
    }
    let slide = null;
    if (type === 'weather') slide = weatherSlide(data, ctx);
    else if (type === 'quotes') slide = quotesSlide(data, ctx);
    else if (type === 'news') slide = newsSlide(data, ctx);
    else if (type === 'holidays') slide = holidaysSlide(data, ctx);
    else if (type === 'countdown' || type === 'countup') slide = counterSlide(type, data, ctx);
    else if (type === 'jokes') slide = jokeSlide(data, ctx);
    else if (type === 'horoscope') slide = horoscopeSlide(data, ctx);
    else if (type === 'clock') slide = clockSlide(data, ctx);
    else if (type === 'logo') slide = logoSlide(data);
    if (slide) slides.push({ ...slide, key: id, delay: `${slides.length * 8}s` });
  });
  return { slides: slides.slice(0, 11), pinned };
}
