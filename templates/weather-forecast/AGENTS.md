# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Weather Forecast** media type's HTML template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), rendering current conditions plus a multi-day forecast. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`) — raised from 20.19+/22.12+ to satisfy `jsdom@30`'s engine requirement. See README.md for the template's variables and the expected `media.result` weather data shape.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development, including a full example media.result
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  hooks/
    use-temperature.js       <-- reads the `unit` template var, converts celsius -> fahrenheit
    use-background.js        <-- maps weather condition code -> background CSS class
    night-interval.js        <-- day/night detection from sunrise/sunset
  components/
    app/                      <-- top-level component (loader, fonts, i18n)
    main/                     <-- destructures media.result into city/current/forecast
    forecast-item/            <-- one row per forecast day
    icon/                     <-- weather condition code -> icon/animation
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of (e.g. `src/images/icons/*.gif`, downloaded as-is from an icon pack — ESLint never lints these anyway, it only processes JS/JSX).
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule (see below) for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs. `dsplay_media.result` here is the JSON-service payload for this media type (see README.md for its shape) — keep it in sync with reality, since it also feeds `template-example-data.json` (see below).
- `@dsplay/react-template-utils` exposes `useTemplateVal` (used for the `unit` variable) and `useMedia()`/`useConfig()` for the raw objects.
- `src/components/main/index.jsx` is the entry point for reading `media.result` — any change to the expected weather data shape starts there.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects — note it only covers the `dsplay_template` namespace (the `unit` variable here); `media.result`'s shape is captured purely by mirroring `dsplay-data.js`, not by scanning `main.jsx`'s destructuring.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import` (`^9` max), `eslint-plugin-jsx-a11y` (`^9` max), and `eslint-plugin-react` (`^9.7` max) haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it (`^10.0.0`). `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
- Version bumps (`package.json`'s `version` field) get their own commit, titled `🔖 bump version to <version>` — see the git log for examples.
