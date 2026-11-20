import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

const state = { media: {}, logoVar: '' };

vi.mock('@dsplay/react-template-utils', async (importOriginal) => ({
  ...(await importOriginal()),
  useMedia: () => state.media,
  useTemplateVal: (name, fallback) => (name === 'logo' ? state.logoVar || fallback : fallback),
}));

import Logo from '.';

afterEach(cleanup);

const withChannelLogo = (logo) => ({ result: { data: { logo, items: [] } } });
const picture = (container) => container.querySelector('.content').style.backgroundImage;

describe('Logo', () => {
  it('shows the channel logo of a player that sends the gateway body, ahead of the template variable', () => {
    state.media = withChannelLogo('https://feed.example/logo.png');
    state.logoVar = 'https://template.example/logo.png';
    const { container } = render(<Logo />);
    expect(picture(container)).toContain('https://feed.example/logo.png');
  });

  it('uses the template variable when the channel declares no logo, and for an old player', () => {
    state.logoVar = 'https://template.example/logo.png';
    state.media = withChannelLogo(null);
    expect(picture(render(<Logo />).container)).toContain('https://template.example/logo.png');
    cleanup();
    state.media = { itemTitle: 'Old player' };
    expect(picture(render(<Logo />).container)).toContain('https://template.example/logo.png');
  });

  it('draws the default animated RSS icon when there is neither', () => {
    state.media = {};
    state.logoVar = '';
    const { container } = render(<Logo />);
    expect(container.querySelector('.rss-icon')).not.toBeNull();
    expect(container.querySelector('.probe')).toBeNull();
  });

  it('hands a logo that fails to load over to the next one, then to the icon', () => {
    state.media = withChannelLogo('https://feed.example/broken.png');
    state.logoVar = 'https://template.example/logo.png';
    const { container } = render(<Logo />);
    fireEvent.error(container.querySelector('.probe'));
    expect(picture(container)).toContain('https://template.example/logo.png');
    fireEvent.error(container.querySelector('.probe'));
    expect(container.querySelector('.rss-icon')).not.toBeNull();
  });
});
