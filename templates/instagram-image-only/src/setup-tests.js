import '@testing-library/jest-dom/vitest';

// @dsplay/react-template-utils's hooks read these globals lazily at render time,
// but they must still exist before a component mounts in a test.
window.dsplay_media = {
  duration: 30000,
  postCount: 1,
  result: {
    data: {
      user: {
        id: '1', name: 'Test User', username: 'testuser', pic: '',
      },
      posts: [{
        id: '1', text: '', created: new Date(0).toISOString(), media: [],
      }],
    },
  },
};
window.dsplay_config = {
  orientation: 'landscape', width: 1920, height: 1080, locale: 'en',
};
window.dsplay_template = {};
