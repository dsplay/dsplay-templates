# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Jokes** media type's HTML templates: one [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that **only displays** `media.result`, the `jokes/1` document DSPLAY's player gateway answers (`dsplay-web-apps`, `apps/api/src/player-gateway`), in one of **four styles** chosen at build time. Each style is its own system template (own zip, name, description) of the CMS type "Jokes". See `README.md` for the answer and the styles.

## Directory structure

```
vite.config.js             <-- TEMPLATE_STYLE picks the style: alias `@style` -> src/styles/<id>
scripts/run.mjs            <-- dev | build | zip <style>, zip-all (one style after the other); scripts/pack.mjs zips a build
public/dsplay-data.js      <-- mock DSPLAY data (12 jokes, ?iteration= ?duration= ?locale= ?long=); public/test-assets/ dev-only
src/
  styles.js                <-- the styles: id, CMS name, description; the CMS type
  i18n.js, i18n.test.js    <-- six languages, a test that they match and every key is used
  lib/                     <-- pure: model.js (the answer, the question time), layout.js (plates, text fitting), use-reveal.js (question, then answer)
  components/              <-- app (loader), intro (loader art), main (picks the joke), stage (the plate), fitted-text, empty
  styles/<id>/             <-- index.jsx (default export the style; exports PER_SCREEN and FONTS), style.sass, fonts.sass
  styles/_mixins.sass      <-- vendor-prefixed mixins and `u(px)` (design pixels)
  test-support/            <-- the example data as the browser evaluates it, and the @dsplay/react-template-utils mock
```

## Rules of this template

- **No network code and no key.** Everything comes from `useMedia().result`. If something is missing from the answer, change the service and its `jokes/1` model, never add a fetch here.
- **A style exports** `default` (the component, props `{ joke: { setup, punchline }, revealed }`: it draws the question, and the answer too once `revealed`) and `FONTS` (families the loader waits for). `Main` never branches on the style; `@style` is the only link. A new style is a folder plus a row in `src/styles.js`; `src/styles/styles.test.jsx` then covers it (three plates, both states, long text, six languages).
- **Plates, not breakpoints.** A layout is drawn on a fixed plate in design px (`u(n)` in Sass = n design px); `Stage` scales it. Per-format differences are `.stage--portrait` / `.stage--square` overrides. A text that varies in length goes through `FittedText` with a box that matches the layout (calibrate by looking at `?long=3`).
- **The 4.4 WebView constraints are rules:** no CSS custom properties, no grid, no flex `gap`, no `clamp()`, no `paint-order`; no CSS animation or transform on SVG elements (animate HTML boxes; static SVG is fine; `src/components/intro/index.test.jsx` guards the loader).
- **Fonts are bundled** (`src/assets/font`, woff2 + woff, OFL licenses next to them). Never a Google Fonts link. Only the fonts a style declares are bundled in its zip.
- **Text goes through `react-i18next`**: the key is the English text, `src/i18n.js` has all six languages. The joke is not ours: it comes in the answer's language.
- **The reveal is HTML/CSS only:** `useReveal(questionMs(duration), joke)` flips `revealed` once; the answer is mounted then, so its CSS keyframes (opacity + transform on divs, `pop`/`fade-up` mixins) run on mount. Never animate SVG.
- Drawings are in `m(px)` (a pixel of the 660 x 371 mockup stage on the landscape plate) or `u(px)` (design px) in the portrait and square overrides.
- **The CMS name, description and type are not in the zip** (the manifest plugin only writes the variables and example data): `scripts/run.mjs` writes `zips/jokes-<style>.json` next to each zip; keep `src/styles.js` as the single source.

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
