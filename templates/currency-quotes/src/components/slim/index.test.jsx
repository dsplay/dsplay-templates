import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../../test-support/mock-utils')).mockUtils());

import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { exampleResult } from '../../test-support/fixture';
import { readQuotes } from '../../lib/model';
import { plateOf } from '../../lib/layout';
import Slim from '.';

afterEach(() => { cleanup(); i18n.changeLanguage('en'); });

const draw = (search) => {
  const quotes = readQuotes(exampleResult(search));
  const plate = plateOf('h-banner', 1920, 56);
  return render(<I18nextProvider i18n={i18n}><Slim quotes={quotes} items={quotes.items} plate={plate} variant="board" /></I18nextProvider>);
};

describe('Slim', () => {
  it('shows the base, then a chip per quote with its flag or code, its price and its change, and no chart', () => {
    const { container } = draw('?count=3');
    expect(container.querySelector('.slim__base').textContent).toBe('BRL');
    expect(container.querySelectorAll('.slim__chip')).toHaveLength(3);
    expect(container.textContent).toContain('5.934');
    expect(container.textContent).toContain('+0.89%');
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.marquee--static')).toBeTruthy();
  });

  it('runs the quotes in a loop when they do not fit the line', () => {
    const { container } = draw('?count=12');
    expect(container.querySelector('.marquee__track')).toBeTruthy();
  });
});

describe('Slim, quotes that fit', () => {
  it('keeps each chip at its own width instead of stretching it', () => {
    const { container } = draw('?count=2');
    const items = container.querySelectorAll('.marquee__item');
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(item.style.width).toBe('49rem'));
  });
});
