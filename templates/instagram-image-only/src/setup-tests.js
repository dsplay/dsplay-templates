import '@testing-library/jest-dom/vitest';

// @dsplay/template-utils reads these globals at module-load time, so they
// must exist before any test file imports a component that uses it.
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
