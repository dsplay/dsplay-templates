# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Wildfire Monitor** media type's HTML template: a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that **only displays** `media.result`, the `wildfire/1` document DSPLAY's player gateway answers for a `WILDFIRE_MONITOR` media (`dsplay-web-apps`, `apps/api/src/player-gateway/providers/wildfire`). It replaces the `sisfogo` template, which read NASA FIRMS from the WebView with an API key kept in the template variables and a sensor that has since stopped.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin
public/
  dsplay-data.js            <-- mock DSPLAY data for local development, including a full example media.result
  test-assets/              <-- dev-only assets (the format harness), excluded from the release build
src/
  index.jsx                 <-- React entry point
  components/
    app/                    <-- loader and fonts
    main/                   <-- the dashboard (index.jsx) and its pure helpers (model.js, tested in model.test.js)
    fire-map/               <-- the map, drawn as SVG from the outlines (outlines-coarse.json, outlines-fine.json)
scripts/pack.mjs           <-- zips the Vite build output into template.zip
scripts/build-outlines.mjs <-- writes the two outline files from Natural Earth
```

## Rules of this template

- **No network code and no key.** Everything comes from `useMedia().result`. If something is missing from the answer, change the service in `dsplay-web-apps` and its `wildfire/1` model, never add a fetch here.
- **No map tiles.** The tile providers that need no key (CARTO's dark basemap now answers "API KEY REQUIRED") are not ours to depend on, and a signage screen may have no connection. The map is drawn from the outlines in `fire-map`.
- **Small dots, coloured by intensity.** A map full of big orange dots reads as a world on fire. A dot is at most `dot` pixels (5, or 4 on a square screen) and, inside that, a fraction of the map's width (`WIDTH_PER_DOT_PX`) so that it grows with the screen, and its colour is the strongest fire radiative power in the cell (`intensityOf` in `model.js`: yellow under 5 MW, orange 5 to 20, deep orange 20 to 60, red from 60; by detections when the sensor gave none), with the legend in the corner. The strongest are drawn last.
- **Names on the map are chosen by zoom** (`labels.js`): a country is named when its biggest part is wider on the screen than its name, the country of a country scope is named bigger, and Brazil's states are named in a close view (`BR_STATE_CENTERS`); none is written outside the box or over another. A country scope is fitted to the country's biggest part, not to the cells.
- **Detections, never fires or hectares.** A satellite hotspot is not a confirmed fire; the footer says so, and no number is turned into an area.
- **A panel only for information that exists** (`panelsOf` in `model.js`): an empty ranking says "No detections in this area", an answer with no `summary` says "No information for this place".
- **One layout per screen format**, from `useScreenInfo().screenFormat`: landscape; portrait and square are the same panels stacked (`dashboard--stacked`, plus `dashboard--square`, which shows 5 ranking rows because it has less height); `h-banner` and `v-banner` show the headline and the top of the ranking (`Banner`).
- **Screenshots** (`docs/screenshots`, one per format) come from the example data at the real screen sizes: `npm start`, then open `/test-assets/format.html?w=1920&h=1080` and capture; re-take them when the layout changes.
- **Region names:** `Intl.DisplayNames` in the screen's language, else the English table, else the code. Brazilian states are named from `BR_STATES`; other subdivisions show their code (the service ranks only Brazil's today).
- Times in the answer are ISO 8601 UTC; the template draws them in the screen's own time zone.
- **Text goes through `react-i18next`** as in the boilerplate: the key is the English text, `src/i18n.js` maps every key in en, pt, es, it, de and nl (`src/i18n.test.js` checks the languages have the same keys and placeholders, and that every `t()` key is defined).

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
