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
  i18n.changeLanguage('en');
});

describe('Main', () => {
  it('shows the question alone, then the answer after 45% of the duration, and keeps both', () => {
    vi.useFakeTimers();
    player.media = { result: exampleResult(), iteration: 0, duration: 12000 };
    renderMain();
    expect(screen.getAllByText('O que é um pontinho verde no fundo da sala?').length).toBeGreaterThan(0);
    expect(screen.queryByText('Uma ervilha de castigo!')).toBeNull();
    act(() => { vi.advanceTimersByTime(5399); });
    expect(screen.queryByText('Uma ervilha de castigo!')).toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText('Uma ervilha de castigo!')).toBeInTheDocument();
    // the question stays visible, smaller
    expect(screen.getAllByText('O que é um pontinho verde no fundo da sala?').length).toBeGreaterThan(0);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(screen.getByText('Uma ervilha de castigo!')).toBeInTheDocument();
  });

  it('keeps the question at least 3 seconds and at most 9', () => {
    vi.useFakeTimers();
    player.media = { result: exampleResult(), iteration: 0, duration: 5000 };
    renderMain();
    act(() => { vi.advanceTimersByTime(2999); });
    expect(screen.queryByText('Uma ervilha de castigo!')).toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText('Uma ervilha de castigo!')).toBeInTheDocument();
    cleanup();

    player.media = { result: exampleResult(), iteration: 0, duration: 60000 };
    renderMain();
    act(() => { vi.advanceTimersByTime(8999); });
    expect(screen.queryByText('Uma ervilha de castigo!')).toBeNull();
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByText('Uma ervilha de castigo!')).toBeInTheDocument();
  });

  it('shows the joke iteration % n', () => {
    player.media = { result: exampleResult(), iteration: 13, duration: 12000 };
    renderMain();
    expect(screen.getAllByText('Qual é o animal mais antigo do mundo?').length).toBeGreaterThan(0);
  });

  it('writes the words around the joke in the screen\'s language', () => {
    vi.useFakeTimers();
    i18n.changeLanguage('de');
    player.media = { result: exampleResult(), iteration: 0, duration: 12000 };
    renderMain();
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByText('Uma ervilha de castigo!')).toBeInTheDocument();
  });

  it('shows one centered message when the answer has no joke', () => {
    player.media = { result: { schema: 'jokes/1', jokes: [] }, iteration: 0, duration: 12000 };
    const { container } = renderMain();
    expect(screen.getByText('No joke available')).toBeInTheDocument();
    expect(container.querySelector('.empty')).not.toBeNull();
  });

  it('shows the message too when there is no answer at all', () => {
    player.media = {};
    renderMain();
    expect(screen.getByText('No joke available')).toBeInTheDocument();
  });
});
