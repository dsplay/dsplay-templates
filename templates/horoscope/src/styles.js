// The styles this package builds. One style is bundled per build (TEMPLATE_STYLE, see vite.config.js and scripts/run.mjs); each becomes its own
// system template in the DSPLAY CMS, with the name, description and type below. The folder of a style is src/styles/<id>/.

/** The media type these templates belong to in the DSPLAY CMS. */
export const CMS_TYPE = 'Daily Horoscope';

/** What the zips are called: zips/<ZIP_PREFIX>-<id>.zip */
export const ZIP_PREFIX = 'horoscope';

export const STYLES = [
  {
    id: 'starry-sky',
    name: 'Starry Sky',
    description: 'One sign per screen on a night sky, with its constellation, the love, work and health scores, the lucky number, colour and match. Landscape, portrait and square layouts.',
  },
  {
    id: 'duo',
    name: 'Duo',
    description: 'Two signs side by side (stacked on a portrait or square screen), so the twelve signs go by in six screens.',
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'A light, warm theme with a gradient tile for the sign, the scores in a card and the twelve signs as tiles.',
  },
  {
    id: 'golden-age',
    name: 'Golden Age',
    description: 'A gold-on-black art deco frame, the constellation inside a gold ring and the scores as stars.',
  },
  {
    id: 'candy',
    name: 'Candy',
    description: 'Soft pastel colours by element, a big rounded glyph and the scores as pills.',
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    description: 'A synthwave night with a glowing sign name, neon constellation and the scores as light bars.',
  },
  {
    id: 'gazette',
    name: 'Gazette',
    description: 'A newspaper page: serif type on paper, a big glyph in ink with a red constellation stamp and the scores as rules.',
  },
  {
    id: 'spectrum',
    name: 'Spectrum',
    description: 'A bold full-colour screen by element with a huge sign name and the scores as bars.',
  },
];

export const DEFAULT_STYLE = STYLES[0].id;

export const findStyle = (id) => STYLES.find((style) => style.id === id);
