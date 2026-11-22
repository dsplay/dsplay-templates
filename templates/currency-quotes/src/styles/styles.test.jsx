import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { player } from '../test-support/mock-utils';
import { exampleResult } from '../test-support/fixture';
import { readQuotes } from '../lib/model';
import { plateOf } from '../lib/layout';
import { pageCount } from '../lib/paging';
import { STYLES, CMS_TYPE, DEFAULT_STYLE } from '../styles';

// every style is imported by its folder, whichever one the build bundles
const MODULES = import.meta.glob('./*/index.jsx', { eager: true });

const SIZES = {
  landscape: [1920, 1080],
  portrait: [1080, 1920],
  square: [1080, 1080],
  'h-banner': [1920, 300],
  'v-banner': [300, 1920],
  // the footer region of a real layout (CVC: 1920 x 81) and a thin bar of 1920 x 56: one line of text
  'h-slim 1920x81': [1920, 81],
  'h-slim 1920x56': [1920, 56],
};

// the screens a banner is tried on, from the shortest strip (4:1) to a very long one
const BANNER_SIZES = [[1920, 480], [1920, 300], [3000, 300], [480, 1920], [300, 1920], [300, 3000], [1920, 81], [1920, 56], [3840, 56]];

const quotesOf = (search = '') => readQuotes(exampleResult(search));

function draw(module, search = '', page = 0) {
  const quotes = quotesOf(search);
  const plate = plateOf(player.format, player.w, player.h);
  const per = module.perPage(plate, quotes.items.length);
  const pages = pageCount(quotes.items.length, per);
  const items = quotes.items.slice(page * per, page * per + per);
  return {
    quotes, items, pages, per,
    ...render(
      <I18nextProvider i18n={i18n}>
        <module.default quotes={quotes} items={items} page={page} pages={pages} />
      </I18nextProvider>,
    ),
  };
}

afterEach(() => {
  cleanup();
  document.documentElement.style.fontSize = '';
  player.format = 'landscape';
  player.w = 1280;
  player.h = 720;
  i18n.changeLanguage('en');
});

describe('the styles of the package', () => {
  it('has a folder, a name and a description for each, all of one CMS type', () => {
    expect(CMS_TYPE).toBe('CurrencyQuotes');
    expect(STYLES.map((s) => s.name)).toEqual(['Quotes Board', 'Quotes Cards', 'Quotes Spotlight']);
    expect(STYLES.find((s) => s.id === DEFAULT_STYLE)).toBeTruthy();
    STYLES.forEach((style) => {
      expect(MODULES[`./${style.id}/index.jsx`], style.id).toBeTruthy();
      expect(style.description.length).toBeGreaterThan(20);
    });
    expect(new Set(STYLES.map((s) => s.id)).size).toBe(STYLES.length);
  });
});

STYLES.forEach(({ id }) => {
  describe(`style ${id}`, () => {
    const module = MODULES[`./${id}/index.jsx`];

    it('exports the fonts the app preloads and how many quotes a page holds', () => {
      expect(module.FONTS.length).toBeGreaterThan(0);
      expect(module.perPage(plateOf('landscape', 1920, 1080), 12)).toBeGreaterThan(0);
    });

    it('shows every quote at once on a slim banner, or one at a time when the style puts one on stage', () => {
      expect(module.perPage(plateOf('h-banner', 1920, 56), 12)).toBe(module.PACE.rotate ? 1 : 12);
    });

    it('never turns pages on a banner: every quote is there, running or standing still', () => {
      if (module.PACE.rotate) return; // a style that puts one quote on stage at a time rotates on a banner too
      expect(module.perPage(plateOf('h-banner', 1920, 300), 12)).toBe(12);
      expect(module.perPage(plateOf('v-banner', 300, 1920), 7)).toBe(7);
      player.format = 'h-banner';
      player.w = 1920;
      player.h = 300;
      const { container } = draw(module, '?count=12');
      expect(container.querySelector('.marquee__track')).toBeTruthy();
      cleanup();
      const few = draw(module, '?count=2');
      expect(few.container.querySelector('.marquee--static')).toBeTruthy();
      expect(few.container.querySelector('.marquee__track')).toBeNull();
    });

    Object.entries(SIZES).forEach(([name, [w, h]]) => {
      const format = name.startsWith('h-slim') ? 'h-banner' : name;
      const kind = name.startsWith('h-slim') ? 'h-slim' : name;
      it(`draws the quotes on a ${name} screen, on the ${kind} plate`, () => {
        player.format = format;
        player.w = w;
        player.h = h;
        const { container, quotes, items } = draw(module);
        const plate = container.querySelector('.stage__plate');
        const expected = plateOf(format, w, h);
        expect(expected.kind).toBe(kind);
        expect(plate.style.width).toBe(`${expected.w / 10}rem`);
        expect(plate.style.height).toBe(`${expected.h / 10}rem`);
        expect(document.documentElement.style.fontSize).toBe(`${Math.min(w / expected.w, h / expected.h) * 10}px`);
        // every quote of the page is on screen (the ticker repeats them)
        items.forEach((item) => expect(container.textContent).toContain(item.code));
        expect(container.textContent).toContain(quotes.base);
      });
    });

    BANNER_SIZES.forEach(([w, h]) => {
      it(`fills a ${w} x ${h} banner with a plate as long as the strip`, () => {
        player.format = w > h ? 'h-banner' : 'v-banner';
        player.w = w;
        player.h = h;
        const { container } = draw(module);
        const plate = container.querySelector('.stage__plate');
        const expected = plateOf(player.format, w, h);
        expect(plate.style.width).toBe(`${expected.w / 10}rem`);
        expect(plate.style.height).toBe(`${expected.h / 10}rem`);
      });
    });

    it('shows one quote, two quotes and twelve quotes without breaking, on every screen', () => {
      ['?count=1', '?count=2', '?count=12'].forEach((search) => {
        Object.entries(SIZES).forEach(([format, [w, h]]) => {
          player.format = format;
          player.w = w;
          player.h = h;
          const { container } = draw(module, search);
          expect(container.querySelector('.stage__plate'), `${search} ${format}`).toBeTruthy();
          cleanup();
        });
      });
    });

    it('draws no chart when the period is none, and a chart per quote with a period', () => {
      const none = draw(module, '?period=none');
      expect(none.container.querySelectorAll('svg').length).toBe(0);
      cleanup();
      const week = draw(module, '?period=7d');
      expect(week.container.querySelectorAll('svg').length).toBeGreaterThan(0);
    });

    it('writes the prices with the decimals of the media, and the screen language', () => {
      const auto = draw(module, '?count=1');
      expect(auto.container.textContent).toContain('5.934');
      cleanup();
      const fixed = draw(module, '?count=1&decimals=0');
      expect(fixed.container.textContent).toContain('6');
      expect(fixed.container.textContent).not.toContain('5.934');
      cleanup();
      i18n.changeLanguage('pt');
      const pt = draw(module, '?count=1');
      expect(pt.container.textContent).toContain('5,934');
    });

    it('writes a small crypto price in full in auto mode, never as a zero', () => {
      const { container } = draw(module, '?mode=price&count=12');
      // SHIB (0.0000222 BRL) is the eleventh quote: it sits on a later page of most screens; ask for its own page
      cleanup();
      const quotes = quotesOf('?count=12');
      const shib = quotes.items.find((item) => item.code === 'SHIB');
      expect(shib.price).toBeLessThan(0.0001);
      const plate = plateOf(player.format, player.w, player.h);
      const per = module.perPage(plate, quotes.items.length);
      const page = Math.floor(quotes.items.indexOf(shib) / per);
      const shown = draw(module, '?count=12', page);
      expect(shown.container.textContent).toMatch(/0[.,]00002/);
      expect(container).toBeTruthy();
    });

    it('survives very long names', () => {
      Object.entries(SIZES).forEach(([format, [w, h]]) => {
        player.format = format;
        player.w = w;
        player.h = h;
        const { container } = draw(module, '?long=4');
        expect(container.querySelector('.stage__plate')).toBeTruthy();
        cleanup();
      });
    });
  });
});
