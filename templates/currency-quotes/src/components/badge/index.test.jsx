import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../../test-support/mock-utils')).mockUtils());

import { player } from '../../test-support/mock-utils';
import Badge from '.';

afterEach(() => {
  cleanup();
  player.template = {};
});

describe('Badge', () => {
  it('shows the flag of the country of a fiat currency', () => {
    const { container } = render(<Badge code="USD" kind="fiat" size={56} />);
    const badge = container.querySelector('.badge--flag');
    expect(badge).toBeTruthy();
    expect(badge.style.backgroundImage).toMatch(/us.*\.svg/);
    expect(badge.getAttribute('aria-label')).toBe('USD');
    expect(badge.textContent).toBe('');
  });

  it('shows the code in a circle when the currency has no flag, or is a crypto, whatever its code', () => {
    const none = render(<Badge code="XOF" kind="fiat" size={56} />);
    expect(none.container.querySelector('.badge--fiat').textContent).toBe('XOF');
    cleanup();
    const crypto = render(<Badge code="BTC" kind="crypto" size={56} />);
    expect(crypto.container.querySelector('.badge--crypto').textContent).toBe('BTC');
    cleanup();
    // a crypto whose code is also a country's currency code is still a crypto
    const lookalike = render(<Badge code="USD" kind="crypto" size={56} />);
    expect(lookalike.container.querySelector('.badge--flag')).toBeNull();
  });

  it('goes back to the code when the template variable show_flags is off', () => {
    player.template = { show_flags: false };
    const { container } = render(<Badge code="USD" kind="fiat" size={56} />);
    expect(container.querySelector('.badge--flag')).toBeNull();
    expect(container.querySelector('.badge--fiat').textContent).toBe('USD');
  });

  it('draws nothing for a base without flag when only the flag is wanted', () => {
    const { container } = render(<Badge code="XOF" kind="fiat" size={44} onlyFlag />);
    expect(container.firstChild).toBeNull();
    cleanup();
    const flag = render(<Badge code="BRL" kind="fiat" size={44} onlyFlag />);
    expect(flag.container.querySelector('.badge--flag')).toBeTruthy();
  });
});
