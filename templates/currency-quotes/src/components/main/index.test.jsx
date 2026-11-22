import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { player } from '../../test-support/mock-utils';
import { exampleResult } from '../../test-support/fixture';
import Main from '.';

const renderMain = () => render(<I18nextProvider i18n={i18n}><Main /></I18nextProvider>);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  player.media = {};
  player.format = 'landscape';
  player.w = 1280;
  player.h = 720;
  i18n.changeLanguage('en');
});

describe('Main', () => {
  it('shows the quotes of the answer', () => {
    player.media = { result: exampleResult(), duration: 30000 };
    renderMain();
    expect(screen.getAllByText('US Dollar').length).toBeGreaterThan(0);
  });

  it('turns the page when there are more quotes than a screen holds, sharing the duration, and goes round', () => {
    vi.useFakeTimers();
    player.media = { result: exampleResult(), duration: 20000 };
    renderMain();
    expect(screen.queryByText('Swiss Franc')).toBeNull();
    // 12 quotes at 6 per page: 2 pages of 10 s
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByText('Swiss Franc')).toBeInTheDocument();
    expect(screen.queryByText('US Dollar')).toBeNull();
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByText('US Dollar')).toBeInTheDocument();
  });

  it('shows one centered message when the answer has no usable quote', () => {
    player.media = { result: { schema: 'currency-quotes/1', items: [] }, duration: 30000 };
    renderMain();
    expect(screen.getByText('Quotes unavailable')).toBeInTheDocument();
  });

  it('shows the message too when there is no answer at all (an old player)', () => {
    player.media = {};
    renderMain();
    expect(screen.getByText('Quotes unavailable')).toBeInTheDocument();
  });
});
