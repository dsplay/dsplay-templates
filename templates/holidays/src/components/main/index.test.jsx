import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { player } from '../../test-support/mock-utils';
import { exampleResult } from '../../test-support/fixture';
import Main from '.';

const renderMain = () => render(<I18nextProvider i18n={i18n}><Main /></I18nextProvider>);
const at = (year, month, day) => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(year, month - 1, day, 12, 0, 0));
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  i18n.changeLanguage('en');
});

describe('Main', () => {
  it('on a holiday shows that holiday big and the next one small (the bundled style, Next Holiday)', () => {
    at(2026, 9, 7);
    player.media = { result: exampleResult(), duration: 15000 };
    renderMain();
    expect(screen.getByRole('heading', { name: 'Dia da Independência' })).toBeInTheDocument();
    expect(screen.getByText('Holiday today')).toBeInTheDocument();
    expect(screen.getByText('Next holiday')).toBeInTheDocument();
  });

  it('on an ordinary day shows the next holiday and the days left', () => {
    at(2026, 9, 1);
    player.media = { result: exampleResult(), duration: 15000 };
    renderMain();
    expect(screen.getByRole('heading', { name: 'Dia da Independência' })).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('Holiday today')).toBeNull();
  });

  it('writes the words around the holiday in the screen\'s language', () => {
    at(2026, 9, 1);
    i18n.changeLanguage('de');
    player.media = { result: exampleResult(), duration: 15000 };
    renderMain();
    expect(screen.getByText('Nächster Feiertag')).toBeInTheDocument();
  });

  it('shows one centered message when the answer has no holiday', () => {
    at(2026, 9, 1);
    player.media = { result: { schema: 'holidays/1', holidays: [] }, duration: 15000 };
    const { container } = renderMain();
    expect(screen.getByText('No holidays to show')).toBeInTheDocument();
    expect(container.querySelector('.empty')).not.toBeNull();
  });

  it('shows the message too when there is no answer at all', () => {
    player.media = {};
    renderMain();
    expect(screen.getByText('No holidays to show')).toBeInTheDocument();
  });
});
