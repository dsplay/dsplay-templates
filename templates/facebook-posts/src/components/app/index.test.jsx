import {
  describe, it, afterEach, beforeAll,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';
import App from '.';

beforeAll(() => {
  window.dsplay_config = {
    locale: 'en_US',
    orientation: 'landscape',
    osVersion: 19,
    appVersion: 99,
  };
  window.dsplay_media = {
    duration: 20000,
    postCount: 10,
    result: {
      validity: '2099-01-01T00:00:00.000Z',
      showOutdated: true,
      data: {
        user: { id: '1', name: 'Test User', pic: 'https://example.com/pic.jpg' },
        posts: [
          { id: '1', text: 'Test post', created: '2099-01-01T00:00:00+0000', shares: 0, comments: 0 },
        ],
      },
    },
  };
  window.dsplay_template = {};
});

afterEach(cleanup);

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
