// The styles this package builds. One style is bundled per build (TEMPLATE_STYLE, see vite.config.js and scripts/run.mjs); each becomes its own
// system template in the DSPLAY CMS, with the name, description and type below. The folder of a style is src/styles/<id>/.

/** The media type these templates belong to in the DSPLAY CMS. */
export const CMS_TYPE = 'CurrencyQuotes';

/** What the zips are called: zips/<ZIP_PREFIX>-<id>.zip */
export const ZIP_PREFIX = 'currency-quotes';

export const STYLES = [
  {
    id: 'board',
    name: 'Quotes Board',
    description: 'A dark board with one row per currency: price, change of the day and a small chart; long lists turn the page, and a banner runs them in a loop.',
  },
  {
    id: 'cards',
    name: 'Quotes Cards',
    description: 'A few currencies as big cards: the price large, the change and a chart of the period; long lists turn the page, and a banner runs them in a loop.',
  },
  {
    id: 'spotlight',
    name: 'Quotes Spotlight',
    description: 'One currency at a time on a full screen that takes the mood of its direction: the price huge, a big glowing chart, and every other quote in a column.',
  },
];

export const DEFAULT_STYLE = STYLES[0].id;

export const findStyle = (id) => STYLES.find((style) => style.id === id);
