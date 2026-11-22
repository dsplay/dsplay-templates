// The styles this package builds. One style is bundled per build (TEMPLATE_STYLE, see vite.config.js and scripts/run.mjs); each becomes its own
// system template in the DSPLAY CMS, with the name, description and type below. The folder of a style is src/styles/<id>/.

/** The media type these templates belong to in the DSPLAY CMS. */
export const CMS_TYPE = 'Jokes';

/** What the zips are called: zips/<ZIP_PREFIX>-<id>.zip */
export const ZIP_PREFIX = 'jokes';

export const STYLES = [
  {
    id: 'speech-bubbles',
    name: 'Speech Bubbles',
    description: 'A bright yellow screen with a big speech bubble for the question; the answer pops into a second bubble on a pink and orange screen.',
  },
  {
    id: 'game-show',
    name: 'Game Show',
    description: 'A blue quiz stage: the question on a card, then the answer on a yellow card with confetti.',
  },
  {
    id: 'chat',
    name: 'Chat',
    description: 'A messaging screen: the question arrives as a message, then the answer in a green reply with a laugh reaction.',
  },
  {
    id: 'comic',
    name: 'Comic',
    description: 'A comic book page: halftone dots, a boxed question, then the answer in a burst with outlined lettering.',
  },
];

export const DEFAULT_STYLE = STYLES[0].id;

export const findStyle = (id) => STYLES.find((style) => style.id === id);
