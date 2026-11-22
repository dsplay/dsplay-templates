import {
  describe, it, expect, afterEach, beforeEach, vi,
} from 'vitest';
import {
  render, screen, cleanup, act,
} from '@testing-library/react';

const state = { media: {}, format: 'landscape' };

vi.mock('@dsplay/react-template-utils', () => ({
  useMedia: () => state.media,
  useScreenInfo: () => ({ screenFormat: state.format }),
  screen: {
    LANDSCAPE: 'landscape', PORTRAIT: 'portrait', SQUARE: 'square', H_BANNER: 'h-banner', V_BANNER: 'v-banner',
  },
}));

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Main from '.';

const station = (id, name, last1hMm, intensity) => ({
  id, name, operator: 'CEMADEN', city: 'RECIFE', observedAt: '2026-11-14T18:50:00.000Z', last1hMm, intensity,
});

const result = {
  generatedAt: '2026-11-14T19:00:00.000Z',
  unavailable: [],
  sources: {
    rainfall: { name: 'CEMADEN', attribution: { text: 'CEMADEN – Centro Nacional' } },
    rivers: { name: 'APAC', attribution: { text: 'APAC – Agência Pernambucana' } },
  },
  summary: { rainfall: { stationsReporting: 5, stationsRaining: 3, maxLast1hMm: 31.2 } },
  rainfall: [
    station('1', 'Ibura', 31.2, 'very_heavy'),
    station('2', 'Dois Unidos', 4.4, 'moderate'),
    station('3', 'Muribeca', 0.8, 'light'),
    station('4', 'Moreno', 0, 'none'),
  ],
  rivers: [{
    id: 'R1', name: 'Engenho Velho', river: 'Capibaribe', levelCm: 248, status: 'alert', thresholds: { attention: 200, alert: 230, flood: 330 },
  }],
  alerts: [],
};

const renderMain = () => render(<I18nextProvider i18n={i18n}><Main /></I18nextProvider>);

function setMedia(media, format = 'landscape') {
  state.media = media;
  state.format = format;
}

beforeEach(async () => {
  await i18n.changeLanguage('en');
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Main', () => {
  it('draws what the answer holds and nothing it does not: the sections of absent datasets are left out', () => {
    setMedia({ duration: 30000, result });
    renderMain();
    expect(screen.getByText('Rainfall')).toBeInTheDocument();
    expect(screen.getByText('Ibura')).toBeInTheDocument();
    expect(screen.queryByText('Moreno')).not.toBeInTheDocument(); // no rain in the last hour
    expect(screen.getByText('River levels')).toBeInTheDocument();
    expect(screen.getByText('CEMADEN / APAC')).toBeInTheDocument();
    expect(screen.getByText('Source: CEMADEN – Centro Nacional · APAC – Agência Pernambucana')).toBeInTheDocument();
    expect(screen.getByText(/Alert — Capibaribe/)).toBeInTheDocument(); // the banner
    expect(screen.queryByText('Weather conditions')).not.toBeInTheDocument();
    expect(screen.queryByText('Region')).not.toBeInTheDocument();
  });

  it('pages the rain cards by what the grid holds, each page for the media duration divided by the pages', () => {
    const many = Array.from({ length: 11 }, (_, i) => station(`s${i}`, `Station ${i}`, 20 - i, 'heavy'));
    setMedia({ duration: 20000, result: { ...result, rainfall: many } });
    renderMain();
    expect(screen.getByText('Station 0')).toBeInTheDocument();
    expect(screen.getByText('Station 7')).toBeInTheDocument(); // 8 cards in the 2x4 grid
    expect(screen.queryByText('Station 8')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(9999));
    expect(screen.queryByText('Station 8')).not.toBeInTheDocument(); // 11 raining stations: 2 pages of 10 s
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('Station 8')).toBeInTheDocument();
    expect(screen.getByText('Station 10')).toBeInTheDocument();
    expect(screen.queryByText('Station 0')).not.toBeInTheDocument();
  });

  it('says so when a dataset failed, and survives an answer with nothing in it', () => {
    setMedia({ duration: 30000, result: { ...result, unavailable: ['alerts'] } });
    renderMain();
    expect(screen.getByText('Partial update')).toBeInTheDocument();
    cleanup();
    setMedia({ duration: 30000 });
    renderMain();
    expect(screen.getByText('Weather monitoring')).toBeInTheDocument();
  });

  it('speaks the language the player is set to, and the dates in it', async () => {
    setMedia({ duration: 30000, result });
    vi.useRealTimers(); // i18next resolves a language change on a timer
    await i18n.changeLanguage('pt');
    renderMain();
    expect(screen.getByText('Monitoramento meteorológico')).toBeInTheDocument();
    expect(screen.getByText('Precipitação')).toBeInTheDocument();
    expect(screen.getByText(/Alerta — Capibaribe/)).toBeInTheDocument();
    expect(screen.getByText('Fonte: CEMADEN – Centro Nacional · APAC – Agência Pernambucana')).toBeInTheDocument();
  });

  it('draws a panel only for the information the answer brings: no rivers, no conditions, no climate is no empty panel', () => {
    setMedia({ duration: 30000, result: { ...result, rivers: undefined, sources: { rainfall: result.sources.rainfall } } });
    const { container } = renderMain();
    expect(screen.getByText('Rainfall')).toBeInTheDocument();
    expect(screen.queryByText('River levels')).not.toBeInTheDocument();
    expect(container.querySelector('.dashboard__right')).toBeNull(); // nothing for the right column
    expect(container.querySelector('.rain-section--alone')).not.toBeNull(); // so the rain takes the whole width
    expect(screen.queryByText('No rain right now')).not.toBeInTheDocument();
  });

  it('gives a place whose only information is warnings a panel of warnings, paged, and no banner repeating them', () => {
    const alerts = Array.from({ length: 6 }, (_, i) => ({
      id: `a${i}`, event: `Wind ${i}`, severity: 'moderate', areas: ['Houston'], areaCount: 1, description: 'Strong gusts.', expires: '2026-11-15T20:00:00.000Z',
    }));
    setMedia({ duration: 20000, result: { generatedAt: result.generatedAt, sources: {}, alerts } });
    const { container } = renderMain();
    expect(screen.getByText('Weather alerts')).toBeInTheDocument();
    expect(container.querySelector('.alert-banner')).toBeNull();
    expect(container.querySelectorAll('.alert-card')).toHaveLength(4);
    expect(screen.getByText('Wind 0')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(10000)); // 6 warnings, 4 a page: 2 pages of 10 s
    expect(screen.getByText('Wind 4')).toBeInTheDocument();
    expect(screen.queryByText('Wind 0')).not.toBeInTheDocument();
  });

  it('says there are no warnings, rather than showing nothing, when that is all the place has', () => {
    setMedia({ duration: 30000, result: { generatedAt: result.generatedAt, sources: {}, alerts: [] } });
    renderMain();
    expect(screen.getByText('No active alerts')).toBeInTheDocument();
  });

  it('puts the message of an empty panel in a panel of its own, so it fills it and sits in the middle', () => {
    setMedia({ duration: 30000, result: { generatedAt: result.generatedAt, sources: {}, alerts: [] } });
    renderMain();
    expect(screen.getByText('No active alerts').parentElement).toHaveClass('alerts-section__grid--empty');
  });

  it('says so when the answer has nothing at all', () => {
    setMedia({ duration: 30000, result: { generatedAt: result.generatedAt, sources: {} } });
    renderMain();
    expect(screen.getByText('No information for this place')).toBeInTheDocument();
  });

  it('stacks the panels on a portrait or a square screen, and keeps the rows of the landscape grid otherwise', () => {
    setMedia({ duration: 30000, result }, 'portrait');
    expect(renderMain().container.querySelector('.dashboard--stacked')).not.toBeNull();
    cleanup();
    setMedia({ duration: 30000, result }, 'square');
    const square = renderMain().container;
    expect(square.querySelector('.dashboard--stacked')).not.toBeNull();
    expect(square.querySelector('.dashboard--square')).not.toBeNull();
    cleanup();
    setMedia({ duration: 30000, result }, 'landscape');
    expect(renderMain().container.querySelector('.dashboard--stacked')).toBeNull();
  });

  it('shows the most urgent items in a strip on a horizontal banner, three at a time, and in a column on a vertical one, five', () => {
    const many = Array.from({ length: 10 }, (_, i) => station(`s${i}`, `Station ${i}`, 20 - i, 'heavy'));
    setMedia({ duration: 20000, result: { ...result, rainfall: many } }, 'h-banner');
    const strip = renderMain().container;
    expect(strip.querySelector('.banner--h')).not.toBeNull();
    expect(strip.querySelector('.dashboard')).toBeNull();
    expect(strip.querySelectorAll('.banner-item')).toHaveLength(3);
    expect(screen.getByText('Capibaribe')).toBeInTheDocument(); // the river above its alert level leads, with its level's name under it
    expect(screen.getByText('Alert')).toBeInTheDocument();
    cleanup();
    setMedia({ duration: 20000, result: { ...result, rainfall: many } }, 'v-banner');
    const column = renderMain().container;
    expect(column.querySelector('.banner--v')).not.toBeNull();
    expect(column.querySelectorAll('.banner-item')).toHaveLength(5);
  });
});
