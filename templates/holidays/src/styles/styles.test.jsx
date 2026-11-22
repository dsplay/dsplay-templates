import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { player } from '../test-support/mock-utils';
import { exampleResult } from '../test-support/fixture';
import { viewOf } from '../lib/model';
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

// the days a style is tried on: an ordinary day, a holiday, the middle of the five days of Carnival, a day with a long weekend ahead
const DAYS = { ordinary: '2026-09-01', holiday: '2026-09-07', carnival: '2026-02-16', longWeekend: '2026-04-15' };
const viewAt = (day, result = exampleResult()) => viewOf(result, day);
const draw = (module, view) => render(
  <I18nextProvider i18n={i18n}>
    <module.default view={view} />
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
    expect(CMS_TYPE).toBe('Holidays');
    expect(STYLES.map((s) => s.name)).toEqual(['Next Holiday', 'Month Calendar', 'Long Weekend', 'Holiday Poster', 'Upcoming Holidays']);
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

    it('exports the fonts the app preloads', () => {
      expect(module.FONTS.length).toBeGreaterThan(0);
    });

    Object.entries(SIZES).forEach(([format, [w, h]]) => {
      Object.entries(DAYS).forEach(([label, day]) => {
        it(`draws ${label} (${day}) on a ${format} screen, on the ${format} plate, with the holiday and no leftovers`, () => {
          player.format = format;
          player.w = w;
          player.h = h;
          const view = viewAt(day);
          const { container } = draw(module, view);
          const plate = container.querySelector('.stage__plate');
          const expected = plateOf(format, w, h);
          expect(expected.kind).toBe(format);
          expect(plate.style.width).toBe(`${expected.w / 10}rem`);
          expect(plate.style.height).toBe(`${expected.h / 10}rem`);
          expect(document.documentElement.style.fontSize).toBe(`${Math.min(w / expected.w, h / expected.h) * 10}px`);
          const shown = view.current[0] || view.next;
          // the long weekend style names the holidays inside the run, which can be another day than the next holiday
          if (!(id === 'long-weekend' && view.longWeekend)) expect(container.textContent).toContain(shown.name.length > 18 ? shown.name.slice(0, 12) : shown.name);
          expect(container.textContent).not.toMatch(/undefined|null|NaN|{{/);
        });
      });
    });

    BANNER_SIZES.forEach(([w, h]) => {
      it(`fills a ${w} x ${h} strip with a plate of its own shape`, () => {
        player.format = w > h ? 'h-banner' : 'v-banner';
        player.w = w;
        player.h = h;
        [DAYS.ordinary, DAYS.holiday].forEach((day) => {
          const { container, unmount } = draw(module, viewAt(day));
          const plate = container.querySelector('.stage__plate');
          const expected = plateOf(player.format, w, h);
          expect(plate.style.width).toBe(`${expected.w / 10}rem`);
          expect(plate.style.height).toBe(`${expected.h / 10}rem`);
          expect(container.querySelector('.stage').className).toContain(`stage--${player.format}`);
          expect(container.querySelector('.banner')).not.toBeNull();
          expect(container.textContent).not.toMatch(/undefined|null|NaN|{{/);
          unmount();
        });
      });
    });

    it('shrinks a very long holiday name instead of letting it run over', () => {
      const view = viewAt(DAYS.holiday);
      const normal = draw(module, view);
      const normalSizes = [...normal.container.querySelectorAll('[style*="max-height"]')].map((node) => parseFloat(node.style.fontSize));
      cleanup();
      const long = { ...exampleResult(), holidays: exampleResult().holidays.map((h) => ({ ...h, name: `${h.name} `.repeat(6).trim() })) };
      const result = draw(module, viewAt(DAYS.holiday, long));
      const nodes = [...result.container.querySelectorAll('[style*="max-height"]')];
      expect(nodes.length).toBe(normalSizes.length);
      nodes.forEach((node) => expect(node.style.overflow).toBe('hidden'));
    });

    it('draws a holiday with an icon kind it does not know, and every kind of the service', () => {
      const base = exampleResult();
      ['newyear', 'carnival', 'easter', 'christmas', 'labour', 'independence', 'election', 'remembrance', 'religious', 'islamic', 'lunar', 'indic', 'jewish', 'thanksgiving', 'city', 'people', 'generic', 'unknown'].forEach((kind) => {
        const result = { ...base, holidays: base.holidays.map((h) => ({ ...h, kind })) };
        const { container, unmount } = draw(module, viewAt(DAYS.holiday, result));
        expect(container.querySelector('svg')).not.toBeNull();
        unmount();
      });
    });

    it('speaks every language of the template', () => {
      ['en', 'pt', 'es', 'fr', 'de', 'it'].forEach((lng) => {
        i18n.changeLanguage(lng);
        [DAYS.ordinary, DAYS.holiday].forEach((day) => {
          const { container, unmount } = draw(module, viewAt(day));
          expect(container.textContent).not.toMatch(/undefined|{{/);
          unmount();
        });
      });
    });
  });
});
