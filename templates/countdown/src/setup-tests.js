import '@testing-library/jest-dom/vitest';

// @dsplay/template-utils reads window.dsplay_media/config/template once at module
// evaluation time, mirroring the real dsplay-data.js script tag that runs before the
// app bundle in production - date-fns@4's parseISO throws (rather than coercing) on
// the undefined date this template would otherwise read.
window.dsplay_media = {
  title: 'Countdown to the new year',
  date: '2030-01-01T00:00',
};
window.dsplay_config = {
  locale: 'en',
};
