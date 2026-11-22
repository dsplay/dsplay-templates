import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

const state = { media: {}, format: 'landscape' };

vi.mock('@dsplay/react-template-utils', () => ({
  useMedia: () => state.media,
  useScreenInfo: () => ({ screenFormat: state.format }),
  screen: {
    LANDSCAPE: 'landscape', PORTRAIT: 'portrait', SQUARE: 'square', H_BANNER: 'h-banner', V_BANNER: 'v-banner',
  },
}));

// the map needs a laid-out page (tiles, bounds); what it is given is checked here
vi.mock('../fire-map', () => ({ default: ({ data }) => <div data-testid="map" data-points={(data.points || []).length} /> }));

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Main from '.';

const result = {
  schema: 'wildfire/1',
  generatedAt: '2026-11-15T15:00:00.000Z',
  scope: { type: 'world' },
  summary: {
    last24h: 66824, previous24h: 50000, observedAt: '2026-11-15T13:59:00.000Z', sensors: ['VIIRS_NOAA21_NRT'],
  },
  regionLevel: 'country',
  regions: [
    { code: 'SS', detections: 11631, previous: 15386 },
    { code: 'BR', detections: 5690, previous: 5690 },
    { code: 'AU', detections: 4707, previous: 0 },
  ],
  points: [{
    lat: -8, lon: -35, count: 4, recent: 3, frpMw: 12.5,
  }],
  sources: [{ text: 'NASA FIRMS (LANCE) active fire data', url: 'https://firms.modaps.eosdis.nasa.gov', license: null }],
};

function setMedia(media, format = 'landscape') {
  state.media = media;
  state.format = format;
}

const renderMain = () => render(<I18nextProvider i18n={i18n}><Main /></I18nextProvider>);

afterEach(() => {
  cleanup();
  i18n.changeLanguage('en');
});

describe('Main', () => {
  it('shows the headline, the trend, the ranking with names and the map', () => {
    setMedia({ result });
    renderMain();
    expect(screen.getByText('66,824')).toBeInTheDocument();
    expect(screen.getByText('34% more than the previous 24 hours')).toBeInTheDocument();
    expect(screen.getByText('Countries with most detections')).toBeInTheDocument();
    expect(screen.getByText('South Sudan')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByTestId('map').dataset.points).toBe('1');
  });

  it('names the area, the source and the last detection', () => {
    setMedia({ result });
    renderMain();
    expect(screen.getByText(/The whole world/)).toBeInTheDocument();
    expect(screen.getByText(/NASA FIRMS \(LANCE\) active fire data/)).toBeInTheDocument();
    expect(screen.getByText(/Last detection/)).toBeInTheDocument();
  });

  it('ranks states for a country scope', () => {
    setMedia({ result: { ...result, scope: { type: 'country', country: 'BR', lat: -8, lon: -35 }, regionLevel: 'subdivision', regions: [{ code: 'BR-PA', detections: 3367, previous: 5369 }] } });
    renderMain();
    expect(screen.getByText('States and regions with most detections')).toBeInTheDocument();
    expect(screen.getByText('Pará')).toBeInTheDocument();
  });

  it('says there is nothing to rank instead of drawing an empty panel', () => {
    setMedia({ result: { ...result, regions: [], points: [] } });
    renderMain();
    expect(screen.getByText('No detections in this area')).toBeInTheDocument();
    expect(screen.queryByText('Countries with most detections')).toBeNull();
  });

  it('says so when the answer has nothing at all', () => {
    setMedia({ result: undefined });
    renderMain();
    expect(screen.getByText('No information for this place')).toBeInTheDocument();
  });

  it('speaks the screen language', () => {
    i18n.changeLanguage('pt');
    setMedia({ result });
    renderMain();
    expect(screen.getByText('Países com mais focos')).toBeInTheDocument();
    expect(screen.getByText('Brasil')).toBeInTheDocument();
  });

  it('shows the three top regions in the horizontal banner and five in the vertical one', () => {
    setMedia({ result }, 'h-banner');
    const { container, unmount } = renderMain();
    expect(container.querySelectorAll('.banner-row')).toHaveLength(3);
    expect(screen.getByText('66,824')).toBeInTheDocument();
    unmount();
    setMedia({ result: { ...result, regions: [...result.regions, ...result.regions, ...result.regions].map((r, i) => ({ ...r, code: `${r.code}-${i}` })) } }, 'v-banner');
    const vertical = renderMain();
    expect(vertical.container.querySelectorAll('.banner-row')).toHaveLength(5);
  });

  it('shows the map only when the answer has something to draw on it', () => {
    setMedia({ result }, 'portrait');
    renderMain();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
});
