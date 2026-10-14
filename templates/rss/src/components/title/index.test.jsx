import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

const state = { media: {}, config: {} };

vi.mock('@dsplay/react-template-utils', () => ({
  useMedia: () => state.media,
  useConfig: () => state.config,
  useTemplateVal: (_name, fallback) => fallback,
  useTemplateBoolVal: (_name, fallback) => fallback,
}));

import Title from '.';

afterEach(cleanup);

const uolMedia = { source: 'UOLIndoor', title: 'Section', itemTitle: 'The headline', itemDescription: 'Longer text' };

describe('Title', () => {
  it('swaps for UOLIndoor on an old app that sends no platform', () => {
    state.media = uolMedia;
    state.config = { appVersion: 40000 };
    const { container } = render(<Title />);
    expect(container.querySelector('.text .content').textContent).toBe('The headline');
  });

  it('does not swap for a player that sends a platform, even with a low version code', () => {
    state.media = uolMedia;
    state.config = { appVersion: 100, platform: 'WEB' };
    const { container } = render(<Title />);
    expect(container.querySelector('.text .content').textContent).toBe('Section');
  });

  it('shows the media title for a player that gets the item from the gateway body', () => {
    state.media = {
      iteration: 0,
      title: 'Latest news',
      result: { data: { title: 'Feed', items: [{ title: 'Item', description: 'Text', images: [] }] } },
    };
    state.config = { platform: 'ANDROID' };
    const { container } = render(<Title />);
    expect(container.querySelector('.text .content').textContent).toBe('Latest news');
  });
});
