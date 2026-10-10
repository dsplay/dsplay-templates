import '@testing-library/jest-dom/vitest';

window.dsplay_config = {
  orientation: 'landscape',
  width: 1920,
  height: 1080,
  locale: 'en',
  osVersion: 19,
};

window.dsplay_media = {
  duration: 30000,
  result: {
    data: {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
        pic: '',
      },
      posts: [
        {
          id: '1',
          text: 'Hello world',
          created: '2020-01-01T00:00:00.000Z',
          media: [],
          link: 'https://twitter.com/testuser/status/1',
          likes: 0,
          shares: 0,
        },
      ],
    },
  },
};
