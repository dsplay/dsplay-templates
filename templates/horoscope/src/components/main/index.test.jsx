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

afterEach(() => {
  cleanup();
  i18n.changeLanguage('en');
});

describe('Main', () => {
  it('shows the sign iteration % 12 of the answer', () => {
    i18n.changeLanguage('pt');
    player.media = { result: exampleResult(), iteration: 4 };
    renderMain();
    expect(screen.getByRole('heading', { name: 'Leão' })).toBeInTheDocument();
    expect(screen.getByText(/Seu entusiasmo contagia/)).toBeInTheDocument();
  });

  it('goes back to the first sign after the twelfth', () => {
    player.media = { result: exampleResult(), iteration: 12 };
    renderMain();
    expect(screen.getByRole('heading', { name: 'Aries' })).toBeInTheDocument();
  });

  it('writes the template\'s own words in the screen\'s language and the text as the answer brought it', () => {
    i18n.changeLanguage('de');
    player.media = { result: exampleResult(), iteration: 4 };
    renderMain();
    expect(screen.getByRole('heading', { name: 'Löwe' })).toBeInTheDocument();
    expect(screen.getByText('Glückszahl')).toBeInTheDocument();
    expect(screen.getByText(/Seu entusiasmo contagia/)).toBeInTheDocument();
  });

  it('shows one centered message when the answer has no sign', () => {
    player.media = { result: { schema: 'horoscope/1', signs: [] }, iteration: 0 };
    const { container } = renderMain();
    expect(screen.getByText('No horoscope available')).toBeInTheDocument();
    expect(container.querySelector('.empty')).not.toBeNull();
  });

  it('shows the message too when there is no answer at all', () => {
    player.media = {};
    renderMain();
    expect(screen.getByText('No horoscope available')).toBeInTheDocument();
  });
});
