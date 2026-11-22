import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { player } from '../test-support/mock-utils';
import { exampleResult } from '../test-support/fixture';
import { readSigns, pickSigns } from '../lib/model';
import { plateOf } from '../lib/layout';
import { STYLES, CMS_TYPE, DEFAULT_STYLE } from '../styles';

// every style is imported by its folder, whichever one the build bundles
const MODULES = import.meta.glob('./*/index.jsx', { eager: true });

const SIZES = {
  landscape: [1920, 1080],
  portrait: [1080, 1920],
  square: [1080, 1080],
  'h-banner': [1920, 300],
  'v-banner': [300, 1920],
};

// the screens a banner is tried on, from the shortest strip (4:1) to a very long one
const BANNER_SIZES = [[1920, 480], [1920, 300], [3000, 300], [480, 1920], [300, 1920], [300, 3000]];

const all = readSigns(exampleResult());
const draw = (module, signs) => render(
  <I18nextProvider i18n={i18n}>
    <module.default signs={signs} today={new Date(2026, 10, 15)} screen={2} screens={module.PER_SCREEN === 2 ? 6 : 12} />
  </I18nextProvider>,
);

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
    expect(CMS_TYPE).toBe('Daily Horoscope');
    expect(STYLES).toHaveLength(8);
    expect(STYLES.map((s) => s.name)).toEqual(['Starry Sky', 'Duo', 'Daylight', 'Golden Age', 'Candy', 'Neon Nights', 'Gazette', 'Spectrum']);
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

    it('exports what the app needs: how many signs a screen and its fonts', () => {
      expect([1, 2]).toContain(module.PER_SCREEN);
      expect(module.FONTS.length).toBeGreaterThan(0);
    });

    Object.entries(SIZES).forEach(([format, [w, h]]) => {
      it(`draws the sign and the disclaimer on a ${format} screen, on the ${format} plate`, () => {
        player.format = format;
        player.w = w;
        player.h = h;
        i18n.changeLanguage('pt');
        const signs = pickSigns(all, 4, module.PER_SCREEN);
        const { container } = draw(module, signs);
        signs.forEach((sign) => {
          expect(screen.getAllByText(i18n.t(sign.id[0].toUpperCase() + sign.id.slice(1))).length).toBeGreaterThan(0);
          expect(screen.getByText(sign.text)).toBeInTheDocument();
        });
        expect(screen.getByText('Escrito por IA para entretenimento. Não é conselho nem previsão.')).toBeInTheDocument();
        const plate = container.querySelector('.stage__plate');
        const expected = plateOf(format, w, h);
        expect(expected.kind).toBe(format);
        expect(plate.style.width).toBe(`${expected.w / 10}rem`);
        expect(plate.style.height).toBe(`${expected.h / 10}rem`);
        // the plate is scaled to the screen by the root font size
        expect(document.documentElement.style.fontSize).toBe(`${Math.min(w / expected.w, h / expected.h) * 10}px`);
      });
    });

    BANNER_SIZES.forEach(([w, h]) => {
      it(`fills a ${w} x ${h} strip with a plate of its own shape, whatever the language`, () => {
        player.format = w > h ? 'h-banner' : 'v-banner';
        player.w = w;
        player.h = h;
        ['pt', 'de'].forEach((lng) => {
          i18n.changeLanguage(lng);
          const signs = pickSigns(all, 4, module.PER_SCREEN);
          const { container, unmount } = draw(module, signs);
          const plate = container.querySelector('.stage__plate');
          const expected = plateOf(player.format, w, h);
          expect(plate.style.width).toBe(`${expected.w / 10}rem`);
          expect(plate.style.height).toBe(`${expected.h / 10}rem`);
          expect(container.querySelector('.stage').className).toContain(`stage--${player.format}`);
          signs.forEach((sign) => expect(screen.getByText(sign.text)).toBeInTheDocument());
          expect(container.textContent).not.toMatch(/undefined|null|NaN|{{/);
          unmount();
        });
      });
    });

    it('shrinks a very long text to fit its box instead of letting it run over', () => {
      const [sign] = pickSigns(all, 4, 1);
      const short = draw(module, pickSigns(all, 4, module.PER_SCREEN));
      const sizeOf = (container) => parseFloat(container.querySelector('[style*="max-height"]').style.fontSize);
      const normal = sizeOf(short.container);
      cleanup();
      const longSigns = pickSigns(all, 4, module.PER_SCREEN).map((s) => ({ ...s, text: `${sign.text} `.repeat(8).trim() }));
      const long = draw(module, longSigns);
      expect(sizeOf(long.container)).toBeLessThan(normal);
      expect(long.container.querySelector('[style*="max-height"]').style.overflow).toBe('hidden');
    });

    it('leaves out what the answer does not have, without a crash', () => {
      const bare = pickSigns(all, 4, module.PER_SCREEN).map((s) => ({
        ...s, keyword: '', luckyNumber: null, luckyColor: null, colorName: null, compatible: null,
      }));
      const { container } = draw(module, bare);
      expect(container.querySelector('.stage__plate')).not.toBeNull();
      expect(container.textContent).not.toMatch(/undefined|null|NaN/);
    });

    it('speaks every language of the template', () => {
      ['en', 'pt', 'es', 'fr', 'de', 'it'].forEach((lng) => {
        i18n.changeLanguage(lng);
        const { container, unmount } = draw(module, pickSigns(all, 0, module.PER_SCREEN));
        expect(container.textContent).not.toMatch(/undefined|{{/);
        unmount();
      });
    });
  });
});
