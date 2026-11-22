// The styles this package builds. One style is bundled per build (TEMPLATE_STYLE, see vite.config.js and scripts/run.mjs); each becomes its own
// system template in the DSPLAY CMS, with the name, description and type below. The folder of a style is src/styles/<id>/.

/** The media type these templates belong to in the DSPLAY CMS. */
export const CMS_TYPE = 'Holidays';

/** What the zips are called: zips/<ZIP_PREFIX>-<id>.zip */
export const ZIP_PREFIX = 'holidays';

export const STYLES = [
  {
    id: 'next-holiday',
    name: 'Next Holiday',
    description: 'A navy screen with the days left until the next holiday in big numbers; on the day of a holiday, that holiday is big and the next one sits below it.',
  },
  {
    id: 'month-calendar',
    name: 'Month Calendar',
    description: 'The month on a calendar grid with its holidays marked, and the list of the holidays of the month beside it.',
  },
  {
    id: 'long-weekend',
    name: 'Long Weekend',
    description: 'The next long weekend as one tile per day, with the holidays and the weekend days; with none ahead, the next holiday on its own.',
  },
  {
    id: 'holiday-poster',
    name: 'Holiday Poster',
    description: 'A poster with the holiday name as big as it fits: orange on the day of a holiday, teal while it is still ahead.',
  },
  {
    id: 'upcoming-list',
    name: 'Upcoming Holidays',
    description: 'A dark list of the next holidays: icon, name, date, where it applies and how many days away it is.',
  },
];

export const DEFAULT_STYLE = STYLES[0].id;

export const findStyle = (id) => STYLES.find((style) => style.id === id);
