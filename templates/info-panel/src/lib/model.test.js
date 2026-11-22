import { describe, it, expect } from 'vitest';
import {
  readPanel, bodyOf, weatherKind, readQuotes, formatTemp, readWeather, shorten, pick, typeOfId,
} from './model';

const NOW = new Date(2026, 10, 21, 9, 14);
const answer = (extra = {}) => ({
  result: {
    order: ['clock', 'weather', 'quotes', 'news', 'holidays', 'countdown', 'jokes', 'horoscope', 'logo'],
    fixed: ['clock', 'weather', 'quotes', 'logo'],
    rotating: ['news', 'holidays', 'countdown', 'jokes', 'horoscope'],
    widgets: {
      clock: { type: 'clock', status: 'ok', data: { hour12: false } },
      weather: { type: 'weather', status: 'ok', data: { weather: { city: 'São Paulo', current: { temp: 27.6, icon: 'c02d' } } } },
      quotes: { type: 'quotes', status: 'ok', data: { items: [{ code: 'usd', price: 5.1305, changePct: 0.4 }, { code: 'eur', price: 5.56, changePct: -0.3 }] } },
      logo: { type: 'logo', status: 'ok', data: { url: 'https://example.com/logo.png' } },
      news: { type: 'news', status: 'ok', data: { items: [{ title: 'A', description: '<p>Obra tem 12 km</p>' }, { title: 'B' }] } },
      holidays: { type: 'holidays', status: 'ok', data: { date: '2026-11-21', holidays: [{ date: '2026-11-20', name: 'Consciência Negra' }, { date: '2026-12-25', name: 'Natal' }] } },
      countdown: { type: 'countdown', status: 'ok', data: { date: '2026-11-27T00:00', title: 'a Black Friday' } },
      horoscope: { type: 'horoscope', status: 'ok', data: { signs: [{ sign: 'leo', from: '07-23', to: '08-22', keyword: 'Confiança', text: 'Um bom dia.' }, { sign: 'virgo', keyword: 'Ordem', text: 'Organize-se.' }] } },
      jokes: { type: 'jokes', status: 'ok', data: { jokes: [{ setup: 'Por quê?', punchline: 'Porque sim.' }] } },
    },
    ...extra,
  },
});

describe('readPanel', () => {
  it('lists the widgets in the customer\'s order, with the rotating area where the first rotating widget was', () => {
    const panel = readPanel(answer(), { lng: 'pt', now: NOW });
    expect(panel.order).toEqual(['clock', 'weather', 'quotes', 'rot', 'logo']);
  });

  it('turns every rotating widget into a slide, a joke taking two turns', () => {
    const panel = readPanel(answer(), { lng: 'pt', now: NOW });
    expect(panel.slides.map((s) => s.type)).toEqual(['news', 'holiday', 'countdown', 'joke', 'horoscope']);
    expect(panel.slots).toBe(6);
    expect(panel.slides[1]).toMatchObject({ big: '34', headline: 'dias para Natal' });
    expect(panel.slides[2]).toMatchObject({ big: '5', headline: 'dias para a Black Friday' });
    expect(panel.slides[3]).toMatchObject({ headline: 'Por quê?', alt: 'Porque sim.' });
  });

  it('reads one sign per showing: the glyph, the name and the text of the day', () => {
    const first = readPanel(answer(), { lng: 'pt', iteration: 0, now: NOW }).slides[4];
    expect(first).toMatchObject({ type: 'horoscope', lead: 'Leão', headline: 'Um bom dia.', sub: 'Confiança' });
    expect(readPanel(answer(), { lng: 'pt', iteration: 1, now: NOW }).slides[4].lead).toBe('Virgem');
  });

  it('shows the next headline at each showing', () => {
    expect(readPanel(answer(), { iteration: 0, now: NOW }).slides[0].headline).toBe('A');
    expect(readPanel(answer(), { iteration: 1, now: NOW }).slides[0].headline).toBe('B');
  });

  it('leaves out a widget that failed, and the answer still plays', () => {
    const base = answer();
    base.result.widgets.weather = { type: 'weather', status: 'error', code: 'timeout' };
    base.result.fixed = ['clock', 'quotes', 'logo'];
    base.result.order = ['clock', 'quotes', 'logo'];
    base.result.rotating = [];
    const panel = readPanel(base, { now: NOW });
    expect(panel.order).toEqual(['clock', 'quotes', 'logo']);
    expect(panel.slides).toEqual([]);
  });

  it('falls back to fixed then rotating when the answer has no order', () => {
    const base = answer();
    delete base.result.order;
    expect(readPanel(base, { now: NOW }).order).toEqual(['clock', 'weather', 'quotes', 'logo', 'rot']);
  });

  it('is null when the media carries no panel answer', () => {
    expect(readPanel({}, {})).toBeNull();
    expect(readPanel({ result: { items: [] } }, {})).toBeNull();
  });

  it('reads the answer kept inside the player\'s envelope', () => {
    const body = answer().result;
    expect(bodyOf({ result: { data: body } })).toBe(body);
    expect(readPanel({ result: { validity: 'x', data: answer().result } }, { now: NOW }).order).toContain('weather');
  });
});

describe('the weather alert', () => {
  const withAlerts = (items) => {
    const base = answer();
    base.result.order = ['clock', 'alerts', 'news'];
    base.result.fixed = ['clock'];
    base.result.rotating = ['alerts', 'news'];
    base.result.widgets.alerts = { type: 'alerts', status: 'ok', data: { schema: 'alerts/1', items } };
    return base;
  };
  const storm = { id: 'a', event: 'Tempestade forte', severity: 'severe', areas: ['São Paulo', 'Osasco'], expires: '2026-11-21T18:00:00', description: 'Risco de queda de árvores e alagamentos.' };

  it('is a slide per active alert, wearing its severity, with the event, the place and until when', () => {
    const { slides } = readPanel(withAlerts([storm, { ...storm, id: 'b', event: 'Vendaval', severity: 'extreme', areas: [] }]), { lng: 'pt', now: NOW });
    expect(slides.map((s) => [s.type, s.sev, s.headline])).toEqual([['alert', 'severe', 'Tempestade forte · São Paulo'], ['alert', 'extreme', 'Vendaval'], ['news', undefined, 'A']]);
    expect(slides[0]).toMatchObject({ tag: 'Alerta · Tempestade forte' });
    expect(slides[0].sub).toMatch(/^até \d{2}:\d{2} · Risco de queda/);
  });

  it('leaves the widget out when there is no alert, so the rotation is the others', () => {
    const { slides } = readPanel(withAlerts([]), { lng: 'pt', now: NOW });
    expect(slides.map((s) => s.type)).toEqual(['news']);
  });

  it('ignores an alert of a severity it does not know', () => {
    expect(readPanel(withAlerts([{ ...storm, severity: 'minor' }]), { now: NOW }).slides.map((s) => s.type)).toEqual(['news']);
  });
});

describe('pieces', () => {
  it('names the drawing of a weather icon', () => {
    expect(['c01d', 'c02n', 't04d', 'r01d', 's01d', 'a01d', 'c04d', undefined].map(weatherKind)).toEqual(['sun', 'partly', 'storm', 'rain', 'snow', 'fog', 'cloud', 'cloud']);
  });

  it('writes the temperature in celsius or fahrenheit, with its letter when asked', () => {
    expect(formatTemp(27.6, 'C')).toBe('28°');
    expect(formatTemp(0, 'F')).toBe('32°');
    expect(formatTemp(27.6, 'C', true)).toBe('28°C');
    expect(formatTemp(27.6, 'F', true)).toBe('82°F');
    expect(formatTemp(0, 'Fahrenheit', true)).toBe('32°F');
  });

  it('reads the unit the weather widget was set to, Celsius when it names none', () => {
    const weather = { weather: { city: 'Lisboa', current: { temp: 21, icon: 'c01d' } } };
    expect(readWeather({ ...weather, unit: 'F' })).toMatchObject({ temp: 21, unit: 'F', kind: 'sun', city: 'Lisboa' });
    expect(readWeather(weather).unit).toBe('C');
    expect(readWeather({ weather: { current: {} } })).toBeNull();
  });

  it('reads two currencies with their change and drops the ones without a price', () => {
    const quotes = readQuotes({ items: [{ code: 'usd', price: 5.13, changePct: 0.4 }, { code: 'xxx', price: 0 }, { code: 'eur', price: 5.56, changePct: -0.3 }] }, 'en');
    expect(quotes).toEqual([
      { code: 'USD', value: '5.13', dir: 'up', arrow: '▲', pct: '0.40%' },
      { code: 'EUR', value: '5.56', dir: 'down', arrow: '▼', pct: '0.30%' },
    ]);
  });

  it('shortens at a word and strips tags', () => {
    expect(shorten('<b>um dois três</b> quatro cinco', 14)).toBe('um dois três…');
    expect(shorten('curto', 14)).toBe('curto');
  });

  it('picks by iteration and strips the counter suffix of an id', () => {
    expect(pick(['a', 'b'], 3)).toBe('b');
    expect(pick([], 1)).toBeNull();
    expect(typeOfId('countdown-2')).toBe('countdown');
  });
});
