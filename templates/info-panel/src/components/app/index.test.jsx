import {
  describe, it, expect, afterEach, beforeEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../../test-support/mock-utils')).mockUtils());

const { player } = await import('../../test-support/mock-utils');
const { default: App } = await import('.');

const answer = {
  order: ['clock', 'weather', 'quotes', 'news', 'logo'],
  fixed: ['clock', 'weather', 'quotes', 'logo'],
  rotating: ['news'],
  widgets: {
    clock: { type: 'clock', status: 'ok', data: {} },
    weather: { type: 'weather', status: 'ok', data: { weather: { city: 'Lisboa', current: { temp: 21, icon: 'c01d' } } } },
    quotes: { type: 'quotes', status: 'ok', data: { items: [{ code: 'USD', price: 5.13, changePct: 0.4 }, { code: 'EUR', price: 5.56, changePct: -0.3 }] } },
    news: { type: 'news', status: 'ok', data: { items: [{ title: 'Uma notícia' }] } },
    logo: { type: 'logo', status: 'ok', data: { url: 'https://example.com/logo.png' } },
  },
};

const screen = (width, height, template = {}) => {
  window.innerWidth = width;
  window.innerHeight = height;
  player.template = template;
};

beforeEach(() => {
  player.media = { duration: 30000, result: answer };
  screen(1920, 120);
});
afterEach(cleanup);

describe('App', () => {
  it('draws every widget of the answer in a strip', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.ip.fmt-slim.s120.st-classic.flat')).not.toBeNull();
    expect(container.querySelector('.wk-clock')).not.toBeNull();
    expect(container.querySelector('.wk-weather .wx-t').textContent).toBe('21°C');
    expect([...container.querySelectorAll('.q-c')].map((n) => n.textContent)).toEqual(['USD', 'EUR']);
    expect(container.querySelector('.wk-logo img').getAttribute('src')).toBe('https://example.com/logo.png');
    expect(container.querySelector('.rot .headline').textContent).toBe('Uma notícia');
  });

  it('the strip, which has no tag, opens a horoscope line with its sign, and the tile formats keep it in the tag', () => {
    const horoscope = { ...answer, rotating: ['horoscope'], order: ['clock', 'horoscope'], fixed: ['clock'], widgets: { clock: answer.widgets.clock, horoscope: { type: 'horoscope', status: 'ok', data: { signs: [{ sign: 'scorpio', keyword: 'Intuição', text: 'Sua intuição está afiada hoje.' }] } } } };
    player.media = { duration: 30000, result: horoscope };
    const { container } = render(<App />);
    expect(container.querySelector('.rot .headline .lead').textContent).toBe('Escorpião');
    expect(container.querySelector('.rot .headline').textContent).toBe('Escorpião · Sua intuição está afiada hoje.');
    cleanup();
    screen(1920, 1080);
    const tiles = render(<App />).container;
    expect(tiles.querySelector('.rot .tag').textContent).toContain('Escorpião');
  });

  it('keeps the customer\'s order: the rotating area where the first rotating widget was', () => {
    const { container } = render(<App />);
    const keys = [...container.querySelector('.ip').children].map((n) => n.className.split(' ')[0]);
    expect(keys).toEqual(['bg', 'w', 'w', 'w', 'rot', 'anchor']);
  });

  it('groups the widgets in tiles on a landscape screen and shows the city', () => {
    screen(1920, 1080);
    const { container } = render(<App />);
    expect(container.querySelector('.ip.fmt-landscape .fx .wk-weather .wx-p').textContent).toBe('Lisboa');
  });

  it('takes the style and the colors from the template variables', () => {
    screen(1920, 120, {
      style: 'newsroom', bg_color: '#123456', text_color: 'yellow', currency_box_color: 'white', currency_text_color: '#222', sponsor_logo_box_color: '#eee',
    });
    const { container } = render(<App />);
    expect(container.querySelector('.ip').className).toContain('st-newsroom');
    expect(container.querySelector('.ip').style.color).toBe('yellow');
    expect(container.querySelector('.bg').style.backgroundColor).toBe('rgb(18, 52, 86)');
    expect(container.querySelector('.q-v').style.color).toBe('rgb(34, 34, 34)');
    expect(container.querySelector('.logo').style.backgroundColor).toBe('rgb(238, 238, 238)');
  });

  it('keeps the style it knows when the variable is something else', () => {
    screen(1920, 120, { style: 'nope' });
    const { container } = render(<App />);
    expect(container.querySelector('.ip').className).toContain('st-classic');
  });

  it('writes the temperature with the unit the media set, C by default', () => {
    const { container, unmount } = render(<App />);
    expect(container.querySelector('.wx-t').textContent).toBe('21°C');
    unmount();
    player.media = { duration: 30000, result: { ...answer, widgets: { ...answer.widgets, weather: { ...answer.widgets.weather, data: { ...answer.widgets.weather.data, unit: 'F' } } } } };
    const again = render(<App />);
    expect(again.container.querySelector('.wx-t').textContent).toBe('70°F');
  });

  it('draws the spotlight family, one slide per widget, when the style is a spotlight style', () => {
    screen(1920, 1080, { style: 'poster' });
    const { container } = render(<App />);
    expect(container.querySelector('.sp.sf-landscape.st-poster.lay-overlay.nohead')).not.toBeNull();
    expect(container.querySelectorAll('.slide')).toHaveLength(5);
    expect(container.querySelectorAll('.dot')).toHaveLength(5);
    expect(container.querySelector('.sl-weather .temp').textContent).toBe('21°C');
  });

  it('puts the icon of each widget before its line on the thin strip of the spotlight: the channel logo for the news, the widget icon for the others', () => {
    screen(1920, 120, { style: 'poster' });
    player.media = { duration: 30000, result: { ...answer, order: ['news', 'clock'], rotating: ['news'], fixed: ['clock'], widgets: { clock: answer.widgets.clock, news: { type: 'news', status: 'ok', data: { logo: 'https://example.com/channel.png', items: [{ title: 'Uma notícia' }] } } } } };
    const { container } = render(<App />);
    expect(container.querySelector('.slide.sl-news .sicon.logo img').getAttribute('src')).toBe('https://example.com/channel.png');
    expect(container.querySelector('.slide.sl-clock .sicon svg')).not.toBeNull();
  });

  it('puts the animated weather icon of the place before the weather line on the thin strip', () => {
    screen(1920, 120, { style: 'poster' });
    player.media = { duration: 30000, result: { ...answer, order: ['weather', 'clock'], rotating: [], fixed: ['weather', 'clock'], widgets: { clock: answer.widgets.clock, weather: { type: 'weather', status: 'ok', data: { weather: { city: 'Lisboa', current: { temp: 18, icon: 'r01d' } } } } } } };
    const { container } = render(<App />);
    expect(container.querySelector('.slide.sl-weather .sicon.wx .dwx .dcloud')).not.toBeNull();
    expect(container.querySelector('.slide.sl-weather .sicon.wx .dwx .ddrops')).not.toBeNull();
  });

  it('draws the feed logo of a news item in the panel without a box of its own (the "logo" class has no background)', () => {
    screen(1920, 1080, { style: 'classic' });
    player.media = { duration: 30000, result: { ...answer, widgets: { ...answer.widgets, news: { type: 'news', status: 'ok', data: { logo: 'https://example.com/channel.png', items: [{ title: 'Uma notícia' }] } } } } };
    const { container } = render(<App />);
    expect(container.querySelector('.ri .ico.logo img').getAttribute('src')).toBe('https://example.com/channel.png');
  });

  it('keeps a slide hidden until its texts are final, so nothing around them moves while they are fitted', () => {
    screen(1920, 1080, { style: 'classic' });
    const { container } = render(<App />);
    // the stand-in for FittedText reports at once, so every slide is shown...
    expect(container.querySelectorAll('.ri.unfit')).toHaveLength(0);
  });

  it('draws the animated icons of the forecast and the alert slide of the spotlight', () => {
    screen(1920, 1080, { style: 'poster' });
    player.media = { duration: 30000, result: { ...answer, order: ['alerts', 'weather'], rotating: ['alerts'], fixed: ['weather'], widgets: { ...answer.widgets, alerts: { type: 'alerts', status: 'ok', data: { items: [{ id: 'a', event: 'Vendaval', severity: 'extreme', areas: [], expires: '2099-01-01T00:00:00' }] } }, weather: { type: 'weather', status: 'ok', data: { weather: { current: { temp: 20, icon: 'c01d', min: 15, max: 25 }, forecast: [{ date: '2026-11-22', min: 14, max: 22, icon: 'r01d' }] } } } } } };
    const { container } = render(<App />);
    expect(container.querySelector('.slide.sl-alert.sev-extreme .alertic')).not.toBeNull();
    expect(container.querySelectorAll('.sl-weather .dwx .dsun .dray')).toHaveLength(8);
    expect(container.querySelectorAll('.sl-weather .dwx .ddrops i')).toHaveLength(3);
  });

  it('pins the clock and the logo to the top bar of the spotlight when the template asks for it', () => {
    screen(1920, 1080, { style: 'cards', pin: 'both' });
    const { container } = render(<App />);
    expect(container.querySelector('.sp.withhead .sclock')).not.toBeNull();
    expect(container.querySelector('.sp .head .slogo img').getAttribute('src')).toBe('https://example.com/logo.png');
    expect(container.querySelectorAll('.slide')).toHaveLength(3);
  });

  it('draws only the background when the media carries no panel answer', () => {
    player.media = { duration: 30000 };
    const { container } = render(<App />);
    expect(container.querySelector('.bg')).not.toBeNull();
    expect(container.querySelector('.w')).toBeNull();
  });
});
