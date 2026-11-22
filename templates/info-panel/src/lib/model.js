// What the gateway's answer for an information panel becomes on screen. Pure functions, tested in model.test.js.
//
//   media.result = { order?: ["clock", "weather", "news", ...], fixed: ["clock", "weather", "quotes", "logo"], rotating: ["news", "holidays", "countdown", "countup", "jokes"],
//                    widgets: { <id>: { type, status: "ok", expiresAt, data } | { type, status: "error", code } } }
//
// An id is the widget's type, or `<type>-2` for the second of a counter. `data` is the body of the widget's own provider (weather, currency-quotes/1, rss, holidays/1,
// jokes/1) or, for the logo, the clock and the counters, the widget's own config. A widget that failed is not listed, so a missing widget is "off or failed", never an error.

import { stringsOf } from './strings';
import { GLYPH, signName } from './zodiac';

const DAY = 86400000;

// the drawings of the media types in the CMS (holidays, countdown, count up, jokes), without their tile
const PATH = {
  holiday: 'M4 6h16v14H4z M8 3v4 M16 3v4 M12.00 9.80 L13.12 12.66 L16.18 12.84 L13.81 14.79 L14.59 17.76 L12.00 16.10 L9.41 17.76 L10.19 14.79 L7.82 12.84 L10.88 12.66z',
  countdown: 'M7 3h10 M7 21h10 M7 3c0 5 5 6 5 9s-5 4-5 9 M17 3c0 5-5 6-5 9s5 4 5 9',
  countup: 'M10 2h4 M12 14l3-3 M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
  joke: 'M4 4.5h16v11H10l-5 4.5v-4.5H4z M9 9h.01 M15 9h.01 M8.5 12c1.8 1.6 5.2 1.6 7 0',
  alert: 'M12 3.2 L21.4 19.6 H2.6 Z M12 9.5 V14 M12 16.9 h.01',
};

const text = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const finite = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

/** The answer's body: `media.result`, or its `data` when the player kept the envelope. */
export function bodyOf(media) {
  const result = media && media.result;
  if (!result) return null;
  if (result.widgets) return result;
  return result.data && result.data.widgets ? result.data : null;
}

/** The widget types of an id: "countdown-2" -> "countdown". */
export const typeOfId = (id) => String(id).replace(/-\d+$/, '');

const dataOf = (body, id) => {
  const widget = body.widgets[id];
  return widget && widget.status === 'ok' ? widget.data || {} : null;
};

/** The kind of drawing a weatherbit icon code stands for: sun, partly, cloud, rain, snow, storm or fog. */
export function weatherKind(icon) {
  const code = String(icon || '');
  if (/^c01/.test(code)) return 'sun';
  if (/^c0[23]/.test(code)) return 'partly';
  if (/^t/.test(code)) return 'storm';
  if (/^[rdu]/.test(code)) return 'rain';
  if (/^s/.test(code)) return 'snow';
  if (/^a/.test(code)) return 'fog';
  return 'cloud';
}

/** The unit the widget was set to: `F` (or "Fahrenheit") is Fahrenheit, anything else Celsius. */
export const unitOf = (value) => (value === 'F' || value === 'Fahrenheit' ? 'F' : 'C');

/** The current weather: the temperature in celsius (the media's values always are), the unit the widget was set to, the drawing and the city. */
export function readWeather(data) {
  const weather = data && data.weather;
  const current = weather && weather.current;
  const temp = current ? finite(current.temp) : null;
  if (temp === null) return null;
  return {
    temp, unit: unitOf(data.unit), kind: weatherKind(current.icon), city: text(weather.city),
  };
}

/** The temperature as the screen writes it: "28°", or "28°C" / "82°F" with its letter, converted to fahrenheit when the unit is F. */
export const formatTemp = (celsius, unit, letter = false) => {
  const f = unitOf(unit) === 'F';
  return `${Math.round(f ? (celsius * 9) / 5 + 32 : celsius)}°${letter ? (f ? 'F' : 'C') : ''}`;
};

/** Up to two currencies with their price and the day's change; an item without a positive price is dropped. */
export function readQuotes(data, lng) {
  const list = data && Array.isArray(data.items) ? data.items : [];
  let format;
  try {
    format = new Intl.NumberFormat(lng, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    format = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return list
    .filter((item) => item && text(item.code) && finite(item.price) !== null && item.price > 0)
    .slice(0, 2)
    .map((item) => {
      const change = finite(item.changePct) || 0;
      const dir = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
      return {
        code: text(item.code).toUpperCase(),
        value: format.format(item.price),
        dir,
        arrow: dir === 'up' ? '▲' : dir === 'down' ? '▼' : '',
        pct: `${format.format(Math.abs(change))}%`,
      };
    });
}

/** The first `max` characters of a description, cut at a word. */
export function shorten(value, max) {
  const plain = text(String(value || '').replace(/<[^>]*>/g, ' '));
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max / 2))}…`;
}

/** One item per showing, in turn: `iteration` is how many times the media has been shown. */
export function pick(items, iteration) {
  if (!items.length) return null;
  return items[(Math.abs(Math.trunc(Number(iteration))) || 0) % items.length];
}

const dateLabel = (date, lng) => {
  try {
    return date.toLocaleDateString(lng, { day: 'numeric', month: 'long' });
  } catch {
    return date.toLocaleDateString('en', { day: 'numeric', month: 'long' });
  }
};

const localDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(String(value || ''));
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null;
};

const SEVERITIES = ['moderate', 'severe', 'extreme'];

/** The hour of an ISO instant as "18:00", in the screen's own clock (the alert says when it ends). */
const hourOf = (iso, lng) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return date.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
};

/** One slide per active alert, the most severe first (the gateway sorts them): the event as the source words it, the place, until when. */
export function alertSlides(data, ctx) {
  const t = stringsOf(ctx.lng);
  const items = Array.isArray(data.items) ? data.items : [];
  return items.filter((a) => a && text(a.event) && SEVERITIES.includes(a.severity)).map((a) => {
    const until = hourOf(a.expires, ctx.lng);
    const place = text(Array.isArray(a.areas) ? a.areas[0] : '');
    return {
      type: 'alert', sev: a.severity, tag: `${t.alert} · ${text(a.event)}`, tile: PATH.alert, headline: [text(a.event), place].filter(Boolean).join(' · '), sub: [until && `${t.until} ${until}`, shorten(a.description, 90)].filter(Boolean).join(' · '), slots: 1,
    };
  });
}

/** A slide is one showing of a rotating widget: `{ type, tag, ico?, tile?, big?, headline, alt?, sub?, slots }`. `alt` is the second half of a joke (it takes two turns). */
const slideOf = (type, id, data, ctx) => {
  const t = stringsOf(ctx.lng);
  if (type === 'news') {
    const item = pick(Array.isArray(data.items) ? data.items.filter((it) => it && text(it.title)) : [], ctx.iteration);
    return item && { type, tag: t.news, ico: true, logo: /^https?:/.test(text(data.logo)) ? text(data.logo) : '', headline: text(item.title), sub: shorten(item.description, 110), slots: 1 };
  }
  if (type === 'holidays') {
    const today = localDate(data.date) || ctx.now;
    const next = (Array.isArray(data.holidays) ? data.holidays : []).map((h) => ({ h, d: localDate(h.date) })).filter((x) => x.d && x.d >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).sort((a, b) => a.d - b.d)[0];
    if (!next) return null;
    const days = Math.round((next.d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / DAY);
    return { type: 'holiday', tag: t.holiday, tile: PATH.holiday, big: days > 0 ? String(days) : '', headline: days > 0 ? `${t.daysTo} ${text(next.h.name)}` : text(next.h.name), sub: dateLabel(next.d, ctx.lng), slots: 1 };
  }
  if (type === 'countdown' || type === 'countup') {
    const when = localDate(data.date);
    if (!when || !text(data.title)) return null;
    const days = Math.floor(Math.abs(type === 'countdown' ? when - ctx.now : ctx.now - when) / DAY);
    if ((type === 'countdown' && when < ctx.now) || (type === 'countup' && when > ctx.now)) return null;
    return { type, tag: t[type], tile: PATH[type], big: String(days), headline: `${type === 'countdown' ? t.daysTo : t.days} ${text(data.title)}`, sub: dateLabel(when, ctx.lng), slots: 1 };
  }
  if (type === 'horoscope') {
    const entry = pick(Array.isArray(data.signs) ? data.signs.filter((s) => s && GLYPH[s.sign] && text(s.text)) : [], ctx.iteration);
    if (!entry) return null;
    const name = signName(entry.sign, ctx.lng);
    return { type: 'horoscope', tag: `${t.horoscope} · ${name}`, lead: name, tile: GLYPH[entry.sign], headline: text(entry.text), sub: text(entry.keyword), slots: 1 };
  }
  if (type === 'jokes') {
    const joke = pick(Array.isArray(data.jokes) ? data.jokes.filter((j) => j && text(j.setup) && text(j.punchline)) : [], ctx.iteration);
    return joke && { type: 'joke', tag: t.joke, tile: PATH.joke, headline: text(joke.setup), alt: text(joke.punchline), slots: 2 };
  }
  return null;
};

const MAX_SLOTS = 7;

/**
 * The panel: `order` is the list of what is drawn left to right (or top to bottom), with `rot` where the rotating area sits (where the first rotating widget was put); `slides` are the
 * showings of the rotating widgets, at most MAX_SLOTS turns; `quotes`, `weather`, `logo` and `clock` are the fixed widgets' data. Returns null when the answer is not a panel's.
 */
export function readPanel(media, { lng = 'en', iteration = 0, now = new Date() } = {}) {
  const body = bodyOf(media);
  if (!body) return null;
  const fixed = Array.isArray(body.fixed) ? body.fixed : [];
  const rotating = Array.isArray(body.rotating) ? body.rotating : [];
  const ids = Array.isArray(body.order) ? body.order.filter((id) => fixed.includes(id) || rotating.includes(id)) : [...fixed, ...rotating];
  const ctx = { lng, iteration, now };

  const widgets = {};
  const order = [];
  let slides = [];
  let slots = 0;
  ids.forEach((id) => {
    const type = typeOfId(id);
    const data = dataOf(body, id);
    if (!data) return;
    if (rotating.includes(id)) {
      if (!order.includes('rot')) order.push('rot');
      (type === 'alerts' ? alertSlides(data, ctx) : [slideOf(type, id, data, ctx)]).forEach((slide) => {
        if (slide && slots + slide.slots <= MAX_SLOTS) {
          slots += slide.slots;
          slides = [...slides, slide];
        }
      });
      return;
    }
    if (type === 'clock') widgets.clock = { hour12: data.hour12 === true, timezone: text(data.timezone) };
    else if (type === 'weather') {
      const weather = readWeather(data);
      if (!weather) return;
      widgets.weather = weather;
    } else if (type === 'quotes') {
      const quotes = readQuotes(data, lng);
      if (!quotes.length) return;
      widgets.quotes = quotes;
    } else if (type === 'logo') {
      if (!text(data.url)) return;
      widgets.logo = { url: data.url };
    } else return;
    order.push(type);
  });
  if (!slides.length) return { order: order.filter((k) => k !== 'rot'), widgets, slides: [], slots: 0 };
  return { order, widgets, slides, slots };
}
