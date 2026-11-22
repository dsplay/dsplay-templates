# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Environment Monitor** media type's HTML template: a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that **only displays** `media.result`, the `environment/1` document DSPLAY's player gateway answers for an `ENVIRONMENT_MONITOR` media (rain, rivers, weather warnings, current conditions and climate of a place). It calls no service: the data service is in `dsplay-web-apps` (`apps/api/src/player-gateway/providers/environment`), which owns the model (`model.ts`) and the sources. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's `.nvmrc`). See README.md for the fields it reads.

It is the cemaden template (`dsplay-template-cemaden`, Pernambuco only, three Vercel-proxied feeds fetched from the WebView) moved here: the layout is unchanged, the data calls and their parsing are gone, and the stations, thresholds and units now come from the service.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin
public/
  dsplay-data.js            <-- mock DSPLAY data for local development, including a full example media.result
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  components/
    app/                    <-- loader and fonts
    main/                   <-- the dashboard (index.jsx) and its pure helpers (model.js, tested in model.test.js)
scripts/pack.mjs           <-- zips the Vite build output into template.zip
```

## Rules of this template

- **No network code.** Everything comes from `useMedia().result`. If something is missing from the answer, change the service in `dsplay-web-apps` and its `environment/1` model, never add a fetch here.
- **A dataset the place has no source for is absent** (`result.rivers === undefined`): its section is not drawn. An empty array is "nothing to report" and shows the section's empty text.
- **A panel only for information that exists** (`panelsOf` in `model.js`): an absent dataset is no panel and an empty one says so; a place whose only information is `alerts` gets the alerts panel (paged) instead of a banner; with nothing at all, one message. When one column has no panel the other takes its room (`--alone` classes).
- **One layout per screen format**, from `useScreenInfo().screenFormat`: landscape; portrait and square are the same panels stacked (`dashboard--stacked`, plus `dashboard--square`, which shows 6 rain cards and 4 rivers because it has less height); `h-banner` and `v-banner` are a different component (`Banner`) with the most urgent items, 3 and 5 at a time. Capacity per format lives in `model.js` (`cardsPerPage`, `riversShown`, the alerts per page), never in a variable. No CSS custom properties: the WebView of Android 4.4 has none, so the banner styles use `vh`/`vw` through Sass variables.
- **Screenshots** (`docs/screenshots`, one per format) come from the example data at the real screen sizes: `npm start`, then open `/test-assets/format.html?w=1920&h=1080` (the harness, left out of the release build) and capture; re-take them when the layout changes.
- **Page time = media duration / number of pages** (`pageInterval` in `model.js`); do not add a page-time variable.
- **Rain intensity comes from the service** (`light` ... `extreme`, from the last hour); the template only maps it to the card colour classes in `style.sass`.
- Times in the answer are ISO 8601 UTC; the template draws them in the screen's own time zone.
- **Text goes through `react-i18next`** as in the boilerplate: the key is the English text, `src/i18n.js` maps every key in en, pt, es, it, de and nl (`src/i18n.test.js` checks the languages have the same keys and placeholders, and that every `t()` key is defined and every key used), and the language is `dsplay_config.locale` split at `_`, set in an effect in `App`. `nsSeparator` is off because some keys end with a colon. What the answer carries (a warning's event, stations' names) is shown as the source wrote it. The styles use `vw` units and were designed for 16:9; they are unchanged from cemaden.

## File and folder naming, Sass, components, boilerplate

This template follows `boilerplates/react` (its `AGENTS.md` is the reference): kebab-case files, `.sass` (indented) for our own styles, one folder with an `index.jsx` per component imported by folder, the same `eslint.config.js`, `vite.config.js`, `scripts/pack.mjs`, `jsconfig.json`, `src/sanity.test.js` and dependency versions. What differs on purpose: the name and version, the page title and language, and no demo content. When the boilerplate changes (a dependency bump, a config), bring the same change here.

## Browser/WebView compatibility

Same as every template: `Chrome >= 45` / `Android >= 4.4` in `browserslist` (asserted by `src/sanity.test.js`), terser as the minifier, no `console.log`.

## Commands

```sh
npm start           # dev server
npm run linter      # eslint src
npm test            # vitest
npm run zip         # build + template.zip
```

## Supply chain hardening

Dependencies are pinned to exact versions (asserted by `src/sanity.test.js`); the repository's root `.npmrc` disables install scripts and sets `min-release-age`. See the root `AGENTS.md`.

## Commit messages

Follow the repository's convention (an emoji, then the template and what changed).
