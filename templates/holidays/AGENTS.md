# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Holidays** media type's HTML templates: one [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that **only displays** `media.result`, the `holidays/1` document DSPLAY's player gateway answers (`dsplay-web-apps`, `apps/api/src/player-gateway/providers/holidays`), in one of **five styles** chosen at build time. Each style is its own system template (own zip, name, description) of the CMS type "Holidays". See `README.md` for the answer and the styles.

## Directory structure

```
vite.config.js             <-- TEMPLATE_STYLE picks the style: alias `@style` -> src/styles/<id>
scripts/run.mjs            <-- dev | build | zip <style>, zip-all (one style after the other); scripts/pack.mjs zips a build
public/dsplay-data.js      <-- mock DSPLAY data (Brazil/São Paulo 2026-2027; ?today=YYYY-MM-DD ?locale=); public/test-assets/ dev-only
src/
  styles.js                <-- the styles: id, CMS name, description; the CMS type
  i18n.js, i18n.test.js    <-- six languages, a test that they match and every key is used
  lib/                     <-- pure: model.js (dates, the answer, the view of a day), names.js (months and weekdays), format.js, layout.js (plates, text fitting), use-labels.js
  components/              <-- app (loader in reveal mode), main (builds the view of today), stage (the plate), banner (the strip formats, shared), icon, medal, fitted-text, empty
  styles/<id>/             <-- index.jsx (default export the style, props `{ view }`; exports FONTS), style.sass, fonts.sass
  styles/_mixins.sass      <-- vendor-prefixed mixins and `u(px)` (design pixels)
  test-support/            <-- the example data as the browser evaluates it, and the @dsplay/react-template-utils mock
```

## Rules of this template

- **No network code and no key.** Everything comes from `useMedia().result`. If something is missing from the answer, change the service and its `holidays/1` model, never add a fetch here.
- **Today is the screen's clock** (`isoOf(new Date())` in `Main`), never the answer's `date`. The pure `viewOf(result, today)` decides what is current and what is next; tests pass the day in.
- **A style exports** `default` (the component, props `{ view }` from `viewOf`), `FONTS` (`{ family, weight }` of every face it uses, which the loader fetches before the template is shown). `Main` never branches on the style; `@style` is the only link. A new style is a folder plus a row in `src/styles.js`; `src/styles/styles.test.jsx` then covers it (three plates, banners, ordinary day, holiday, Carnival, long weekend, long names, every kind of icon, six languages).
- **Plates, not breakpoints.** A layout is drawn on a fixed plate in design px (`u(n)` in Sass = n design px); `Stage` scales it. Per-format differences are `.<prefix>--landscape` / `--portrait` / `--square` modifiers. A text that varies in length goes through `FittedText` with the real width of its box, and with `wholeWords` (a word is never cut: the estimate must not let a long word run past the box, which clips it).
- **The banners are shared** (`components/banner`): a style only sets their colours under its own prefix (`.nh .banner__medal`). Headless Chrome cannot make a window narrower than 500 px: to look at a vertical banner, frame the build in an iframe of 300 x 1920.
- **The 4.4 WebView constraints are rules:** no CSS custom properties, no grid, no flex `gap`, no `clamp()`, no `paint-order`; no CSS animation or transform on SVG elements (the holiday icons are still SVG; the entrance animates HTML boxes). Month and weekday names are data, not `Intl`.
- **Fonts are bundled** (`src/assets/font`, woff2 + woff, OFL licenses next to them). Never a Google Fonts link. Only the fonts a style declares are bundled in its zip.
- **Text goes through `react-i18next`**: the key is the English text, `src/i18n.js` has all six languages. The holiday names are not ours: they come in the answer's language.
- **No loader screen:** the template is revealed, not covered (`reveal` in `Loader`): mounted hidden, shown with `dsplay-ready` once the fonts are in, and the entrance (`stage-enter`) starts from that class, never before. Never start an animation from mount: it would run while the template is still hidden.
- **The CMS name, description and type are not in the zip**: `scripts/run.mjs` writes `zips/holidays-<style>.json` next to each zip; keep `src/styles.js` as the single source.

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
