import { describe, it, expect } from 'vitest';
import {
  FALLBACK_PAGE_MS,
  attributions,
  bannerFeed,
  bannerItems,
  cardsPerPage,
  panelsOf,
  pageInterval,
  rainingStations,
  riverProgress,
  riverStatusClass,
  riversShown,
  shortRegionName,
  sourceNames,
} from './model';

describe('pageInterval', () => {
  it('splits the media duration across the pages, so that the pages together last as long as the media', () => {
    expect(pageInterval(30000, 3)).toBe(10000);
    expect(pageInterval(30000, 1)).toBe(30000);
    expect(pageInterval(10000, 3)).toBe(3333);
  });

  it('never goes below one second, and falls back when the duration or the pages are unknown', () => {
    expect(pageInterval(2000, 10)).toBe(1000);
    expect(pageInterval(undefined, 3)).toBe(FALLBACK_PAGE_MS);
    expect(pageInterval(0, 3)).toBe(FALLBACK_PAGE_MS);
    expect(pageInterval(30000, 0)).toBe(FALLBACK_PAGE_MS);
  });
});

describe('rainingStations', () => {
  it('keeps the stations with rain in the last hour and an intensity, in the order served', () => {
    const rainfall = [
      { id: 'a', last1hMm: 5, intensity: 'moderate' },
      { id: 'b', last1hMm: 0, intensity: 'none' },
      { id: 'c', last1hMm: null, intensity: null },
      { id: 'd', last1hMm: 1, intensity: 'light' },
    ];
    expect(rainingStations(rainfall).map((s) => s.id)).toEqual(['a', 'd']);
    expect(rainingStations(undefined)).toEqual([]);
  });
});

describe('bannerItems', () => {
  const river = (id, status, levelCm = 250) => ({
    id, name: `Station ${id}`, river: 'Capibaribe', status, levelCm,
  });

  it('lists the rivers above their attention level and the warnings, most serious first, as what to write', () => {
    const items = bannerItems(
      [river('1', 'attention'), river('2', 'normal'), river('3', 'flood', 340.04)],
      [{
        id: 'w', event: 'Chuvas Intensas', severity: 'moderate', areas: ['Recife'], areaCount: 3,
      }],
    );
    expect(items.map((i) => i.key)).toEqual(['river-3', 'alert-w', 'river-1']);
    expect(items[0]).toMatchObject({ status: 'enchente', river: { name: 'Capibaribe', levelCm: 340.04 } });
    expect(items[1]).toMatchObject({ status: 'alerta', alert: { event: 'Chuvas Intensas', area: 'Recife', more: 2 } });
    expect(items[2].status).toBe('pre-alerta');
  });

  it('is empty when nothing is above normal, or when the datasets are absent', () => {
    expect(bannerItems([river('1', 'normal')], [])).toEqual([]);
    expect(bannerItems(undefined, undefined)).toEqual([]);
  });

  it('a warning with no place has none to name', () => {
    expect(bannerItems([], [{ id: 'x', event: 'Wind', severity: 'extreme', areas: [], areaCount: 0 }])[0]).toMatchObject({ status: 'enchente', alert: { area: null, more: 0 } });
  });
});

describe('riverProgress', () => {
  it('is the level against the highest stage the state sets, capped at the full bar', () => {
    const thresholds = { attention: 200, alert: 230, flood: 330 };
    expect(riverProgress({ levelCm: 165, thresholds })).toBe(50);
    expect(riverProgress({ levelCm: 400, thresholds })).toBe(100);
    expect(riverProgress({ levelCm: 100, thresholds: { attention: null, alert: 200, flood: null } })).toBe(50);
  });

  it('is half full for a river with no stage at all, and empty at zero', () => {
    expect(riverProgress({ levelCm: 80, thresholds: { attention: null, alert: null, flood: null } })).toBe(50);
    expect(riverProgress({ levelCm: 0, thresholds: {} })).toBe(0);
  });
});

describe('names', () => {
  it('colours a river by its status, and shortens the mesoregions of Pernambuco', () => {
    expect(riverStatusClass('alert')).toBe('alerta');
    expect(riverStatusClass('normal')).toBe('normal');
    expect(shortRegionName('Metropolitana de Recife')).toBe('RMR');
    expect(shortRegionName('Another region')).toBe('Another region');
  });

  it('names each source once', () => {
    expect(sourceNames({ rainfall: { name: 'CEMADEN' }, rivers: { name: 'APAC' }, climate: { name: 'APAC' } })).toEqual(['CEMADEN', 'APAC']);
    expect(sourceNames(undefined)).toEqual([]);
  });
});

describe('attributions', () => {
  it('credits each source once, as the source words it, and skips a source with none', () => {
    const sources = {
      rainfall: { attribution: { text: 'CEMADEN' } },
      rivers: { attribution: { text: 'APAC' } },
      climate: { attribution: { text: 'APAC' } },
      alerts: {},
    };
    expect(attributions(sources)).toEqual(['CEMADEN', 'APAC']);
    expect(attributions(undefined)).toEqual([]);
  });
});

describe('cardsPerPage', () => {
  it('is what the stylesheet grid holds for the format: 8 (2x4) in landscape, 9 (3x3) in portrait, 6 (3x2) on a square screen', () => {
    expect(cardsPerPage('landscape')).toBe(8);
    expect(cardsPerPage('portrait')).toBe(9);
    expect(cardsPerPage('square')).toBe(6);
  });
});

describe('panelsOf', () => {
  it('draws a panel for each dataset the answer brings, an empty list included, and none for an absent one', () => {
    expect(panelsOf({ rainfall: [], rivers: [{}], alerts: [] })).toMatchObject({ rain: true, rivers: true, conditions: false, climate: false, alerts: true, alertsPanel: false, any: true });
    expect(panelsOf({ climate: [] }).climate).toBe(false); // a region bar with no region is nothing
  });

  it('gives the warnings a panel of their own only when they are all the place has', () => {
    expect(panelsOf({ alerts: [{}] })).toMatchObject({ alertsPanel: true, any: true });
    expect(panelsOf({ alerts: [{}], rainfall: [] }).alertsPanel).toBe(false);
  });

  it('knows an answer with nothing in it', () => {
    expect(panelsOf({}).any).toBe(false);
  });
});

describe('bannerFeed', () => {
  it('lists the urgent items first, then the stations raining, at most twelve', () => {
    const rainfall = Array.from({ length: 14 }, (_, i) => ({
      id: `s${i}`, name: `S${i}`, city: 'RECIFE', last1hMm: 14 - i, intensity: 'heavy',
    }));
    const feed = bannerFeed({
      rainfall,
      rivers: [{
        id: 'r', name: 'Engenho', river: 'Capibaribe', status: 'flood', levelCm: 340.04,
      }],
      alerts: [{
        id: 'w', event: 'Chuvas Intensas', severity: 'severe', areas: ['Recife'], areaCount: 1,
      }],
    });
    expect(feed).toHaveLength(12);
    expect(feed[0]).toMatchObject({ key: 'river-r', label: 'Flood', title: 'Capibaribe', value: '340.0', unit: 'cm' });
    expect(feed[1]).toMatchObject({ key: 'alert-w', title: 'Chuvas Intensas', detail: 'Recife' });
    expect(feed[2]).toMatchObject({ key: 'rain-s0', status: 'forte', title: 'S0', value: '14.0', unit: 'mm' });
  });

  it('is empty for an answer with nothing urgent and no rain', () => {
    expect(bannerFeed({})).toEqual([]);
  });
});

describe('riversShown', () => {
  it('is the rows the panel holds for the format, so no row is shown half', () => {
    expect(riversShown('landscape')).toBe(5);
    expect(riversShown('portrait')).toBe(12);
    expect(riversShown('square')).toBe(4);
  });
});
