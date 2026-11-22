# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Currency quotes** media type's HTML templates: one [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that **only displays** `media.result`, the `currency-quotes/1` document DSPLAY's player gateway answers (`dsplay-web-apps`, `apps/api/src/player-gateway`), in one of **three styles** chosen at build time (board, cards, spotlight). Each style is its own system template (own zip, name, description) of the CMS type "CurrencyQuotes". See `README.md` for the answer and the styles. The gateway service does not exist yet: the answer's shape in `README.md` and `public/dsplay-data.js` is the contract it must meet.

## Directory structure

```
vite.config.js             <-- TEMPLATE_STYLE picks the style: alias `@style` -> src/styles/<id>
scripts/run.mjs            <-- dev | build | zip <style>, zip-all (one style after the other); scripts/pack.mjs zips a build
public/dsplay-data.js      <-- mock DSPLAY data (12 quotes; ?count= ?period= ?mode= ?decimals= ?locale= ?duration= ?long= ?empty=); public/test-assets/ dev-only
src/
  styles.js                <-- the styles: id, CMS name, description; the CMS type
  i18n.js, i18n.test.js    <-- six languages, a test that they match and every key is used
  lib/                     <-- pure: model.js (the answer), format.js (price, change, date), sparkline.js (the chart line), paging.js (pages), layout.js (plates)
  components/              <-- app (loader), main (reads the answer, pages), stage (the plate), badge, change, price, spark, dots, marquee (the loop of a banner), slim (the one line of a thin banner), empty
  styles/<id>/             <-- index.jsx (default export the style; exports FONTS and perPage), style.sass, fonts.sass
  styles/_mixins.sass      <-- vendor-prefixed mixins and `u(px)` (design pixels)
  test-support/            <-- the example data as the browser evaluates it, and the @dsplay/react-template-utils mock
```

## Rules of this template

- **No network code and no key.** Everything comes from `useMedia().result`. If something is missing from the answer, change the service and its `currency-quotes/1` model, never add a fetch here (the reason this type exists: the template only displays).
- **Display is the template's job.** How many decimals a price gets (`auto` or fixed), the sign of a change, the language of the numbers and the date are decided here from the raw numbers of the answer; the service sends numbers, not text.
- **A style exports** `default` (the component, props `{ quotes, items, page, pages }`: `items` are the quotes of this page), `FONTS` (families the loader waits for), `PACE` (`{ min, max, rotate }`: how long a page stays, in ms; `rotate` makes each play go on from where the last one stopped) and `perPage(plate, count)` (how many quotes a page holds on a plate; on a banner of the board and the cards all of them: it runs in a `Marquee` instead of turning pages; the spotlight puts one quote on stage at a time). `Main` never branches on the style; `@style` is the only link. A new style is a folder plus a row in `src/styles.js`; `src/styles/styles.test.jsx` then covers it (five formats, banners of several lengths and slim ones, running or standing still, 1/2/12 quotes, no chart, decimals, languages, long names).
- **A thin horizontal banner is its own plate** (`h-slim`, 14:1 and more, `plateOf`): every style must handle it, with `components/slim` (one line, no chart). Real case: the 1920 x 81 footer region of the CVC layout. Test it at 1920 x 81 and 1920 x 56.
- **Plates, not breakpoints.** A layout is drawn on a fixed plate in design px (`u(n)` in Sass = n design px); `Stage` scales it. Per-format differences are `.<style>--portrait` / `--square` / `--h-banner` / `--v-banner` overrides. A price goes through `Price` (it shrinks to its box).
- **The 4.4 WebView constraints are rules:** no CSS custom properties, no grid, no flex `gap`, no `clamp()`; no CSS animation or transform on SVG elements (animate HTML boxes; static SVG is fine). Flex shorthands always carry a unit (`flex: 1 1 0%`): the minifier turns a unitless one into a fixed basis.
- **Entrance and idle motion** follow `docs/entrance-style.md`: start from `.dsplay-ready`, opacity and transform only, prefixed, a `prefers-reduced-motion` block. Entrance and idle never share an element's `animation` (one would replace the other): the entrance is on the outer box, the idle on an inner one.
- **Fonts are bundled** (`src/assets/font`, woff2 + woff, OFL licenses next to them). Never a Google Fonts link. Only the fonts a style declares are bundled in its zip.
- **Text goes through `react-i18next`**: the key is the English text, `src/i18n.js` has all six languages. The names of the currencies are not ours: they come in the answer.
- **The CMS name, description and type are not in the zip** (the manifest plugin only writes the variables and example data): `scripts/run.mjs` writes `zips/currency-quotes-<style>.json` next to each zip; keep `src/styles.js` as the single source.

## File and folder naming, Sass, components, boilerplate

Follows `boilerplates/react` (its `AGENTS.md` is the reference): kebab-case files, `.sass` (indented), one folder with an `index.jsx` per component, the same `eslint.config.js` (plus `import/no-unresolved` ignoring `@style`), `scripts/pack.mjs` logic, `jsconfig.json`, `src/sanity.test.js` and dependency versions. What differs on purpose: the style selection (`vite.config.js`, `scripts/run.mjs`), and the zips.

## Browser/WebView compatibility

Same as every template: `Chrome >= 45` / `Android >= 4.4` in `browserslist` (asserted by `src/sanity.test.js`), terser as the minifier, no `console.log`.

## Commands

```sh
npm start [-- <style>]   # dev server of a style (default: the first)
npm run linter           # eslint src
npm test                 # vitest
npm run zip:all          # lint + every style's zip in zips/
```

## Supply chain hardening

Dependencies are pinned to exact versions (asserted by `src/sanity.test.js`); the repository's root `.npmrc` disables install scripts and sets `min-release-age`. See the root `AGENTS.md`.

## Commit messages

Follow the repository's convention (an emoji, then the template and what changed).
