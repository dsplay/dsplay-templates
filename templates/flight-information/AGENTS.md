# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Flight Information** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing a live arrivals/departures board for a given airport, fetched from the [aviation-edge.com](https://aviation-edge.com/) API. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  util/airports.json         <-- static IATA airport code -> name/details lookup table
  hooks/
    use-flights-info.js        <-- fetches/polls the aviation-edge.com timetable
    use-language.js             <-- raw region-qualified locale, for native Intl date/time formatting
    use-hour.js                 <-- 12h vs 24h clock format
  contexts/
    theme-context/                <-- static color theme (primary/secondary/line)
  components/
    app/                      <-- top-level component (loader, i18n)
    main/                     <-- the flights table itself
    intro/                    <-- loading placeholder
scripts/
  pack.mjs                   <-- zips the Vite build output into template.zip (Windows/macOS/Linux)
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Non-component helpers (e.g. `src/hooks/*.js`, `src/util/airports.json`) don't need the folder+`index.jsx` treatment — plain kebab-case files are fine.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-flight-information`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. Doesn't apply to the actual flight data content (airport names, gate numbers, etc, from `src/util/airports.json` or the API response) — only to text this template's own code puts on screen (column headers, `arrivals`/`departures` labels).
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants). This template also carries `fr` (extra, not required, kept since it predates this rule and is fully translated).
- **`i18n.changeLanguage` is centralized in `src/components/app/index.jsx`**, splitting the region-qualified `dsplay_config.locale` before calling it: `const [lng] = (locale || 'en').split('_'); i18n.changeLanguage(lng);`. Don't call `changeLanguage` anywhere else in the tree — it's a global singleton shared by every `useTranslation()` call. `src/hooks/use-language.js` returns the *unsplit* locale on purpose — it's used for native `Intl`/`toLocaleString` formatting (via `.replace('_', '-')` into a BCP-47 tag), which wants the region, unlike i18next's resource keys which don't.
- **Audit `t()` call sites against `src/i18n.js`'s resources whenever either changes** — a key used but missing a required language is a bug (silent fallback to the raw key string); a key defined but never referenced is dead. This repo previously had an `origin` key used in `main/index.jsx` but only defined in the `pt` resource — every other language silently fell back to the literal string `"origin"`. Also removed `Title`/`status`/`update`, dead demo-boilerplate keys never referenced by any `t()` call, and the entire unused `date-fns` dependency (its locale objects were stuffed into the `i18n.js` resources under a `locale` key that nothing ever read — all date/time formatting here actually goes through native `Intl`/`toLocaleString`).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `scripts/pack.mjs` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils) exposes `useMedia`/`useConfig`/`useInterval`/`LoaderContext`/`useScreenInfo` (used throughout `src/components/main`).
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This only applies to variables added from now on — never rename this template's existing keys just to match, since they're already registered/in use in production CMS configurations.
- `src/hooks/use-flights-info.js` calls the aviation-edge.com API directly with `media.apiKey` — the initial fetch happens once as a `Loader` task (see `app/index.jsx`), then `main/index.jsx` re-fetches on a 15-minute interval and re-paginates the results client-side based on `media.duration`/`media.maxPageDurationSeconds`.
- **Error handling**: `useFlightsInfoPromise`'s fetch throws (rather than swallowing failures into a sentinel value) on a network error or a non-array response body (aviation-edge.com replies `200` with `{ error, success: false }` for a bad/rate-limited key, which isn't itself a thrown error). `Loader` (`@dsplay/react-template-utils@5.2.1`+) handles a rejected task via `Promise.allSettled` internally, so this doesn't hang the intro - the initial load's failure reason shows up as `loaderContext.tasksErrors[0]`. The 15-minute refresh bypasses `Loader` entirely (it's driven by `main/index.jsx`'s own `useEffect`/`setInterval`), so `useFlightsInfoFromPromise` tracks its own `error` state as a third return value. `Main` only shows the translated `flightsError` message (`src/i18n.js`) when there's truly no data to fall back on (`allFlights === undefined` - neither the initial load nor any refresh has ever succeeded); a refresh failing while earlier data is still valid just keeps showing that stale data instead of blanking out.

## Browser/WebView compatibility (Android SDK 23 minimum)

DSPLAY's Android app supports devices back to Android 6.0 (API 23). On locked-down signage hardware that never receives WebView updates via Play Store, the actual JS engine can be stuck around the Chrome ~40-51 era that shipped with that OS generation — not a modern evergreen browser. `@vitejs/plugin-legacy` exists specifically to cover this: it builds a modern ES-module bundle plus a transpiled+polyfilled "legacy" nomodule bundle for anything the `browserslist` target in `package.json` doesn't natively support.

Two things must never regress, or the legacy bundle silently stops protecting old devices while still *looking* correctly configured:

- **`package.json`'s `browserslist` must keep `Chrome >= 45` and `Android >= 4.4`** (alongside the generic `>0.2%`/`not dead`/etc. entries) — dropping these two narrows the resolved target list to whatever's "current" (verify with `npx browserslist`), which silently stops emitting transpiled code for anything old, even though `@vitejs/plugin-legacy` stays nominally wired up.
- **`vite.config.js`'s `build.minify` must stay `'terser'`, not the default `oxc`** — `oxc`'s minifier has a known bug where it reintroduces `?.`/`??` into the legacy chunk after Babel already expanded them away, silently breaking the one guarantee the legacy build exists to provide.

After touching either of these, verify by actually running `npm run build` and grepping the emitted `build/assets/index-legacy-*.js` for untranspiled arrow functions (`=>`) or real `?.`/`??` usage — a config that looks right can still emit a broken legacy bundle if a dependency version bump reintroduces one of these, so don't assume correctness from the config file alone.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `scripts/pack.mjs`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — lints, then builds for production.
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `scripts/pack.mjs` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

`build`/`zip` chain their steps with `&&` directly in the script (`"build": "npm run linter && vite build"`, `"zip": "npm run build && ..."`) rather than `prebuild`/`prezip` lifecycle hooks — `.npmrc`'s `ignore-scripts=true` (see below) silently skips `pre*`/`post*` hooks for `npm run-script` too, not just install scripts, so a `prezip` step would never actually run and `npm run zip` would silently package a stale/missing `build/`. Keep new multi-step scripts explicit for the same reason — don't reach for `pre*`/`post*` naming in this repo.

## Supply chain hardening

- `.npmrc` sets `ignore-scripts=true` (no dependency lifecycle scripts run on install), `min-release-age=3` (npm refuses versions younger than 3 days) and `save-exact=true`.
- **Dependencies must ALWAYS be pinned to an exact version** — never `^`, `~`, `>=`, `latest` or any other range, in `dependencies` and `devDependencies` alike. When adding or bumping a package, use `npm install <pkg>@<version>` (`save-exact=true` in `.npmrc` handles it) and check `package.json` afterwards; fix any range that slips in. `src/sanity.test.js` enforces this, plus `.npmrc` and Dependabot settings and the legacy-WebView invariants above.
- `.github/dependabot.yml` uses a 3-day cooldown (7 days for majors).
- Currently no dependency needs its install script. If one ever does, add a `setup` script (`npm install && npm rebuild <pkg>`) and document it in README.md.

## Dependency management

Regular npm dependencies, not vendored files — versions are pinned, so bump explicitly (`npm outdated`, then `npm install <pkg>@<version>`) or merge Dependabot PRs. For a major bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

`react-icons` was bumped 4 -> 5 and `axios` 1.5 -> 1.19 during the 2026 migration (both non-breaking for this template's usage); `date-fns` was removed entirely (see the i18n section above).

### Fixed: `npm run zip` didn't work on Windows at all

`build.sh` (bash + the system `zip` CLI) was the only thing `npm run zip` ran after building — neither ships on Windows, not even under Git Bash (Git for Windows doesn't bundle `zip`/`unzip`). Replaced with `scripts/pack.mjs`, a plain Node script (`fs` + the `archiver` devDependency, pinned to `8.0.0` — its from-scratch ESM rewrite, `import { ZipArchive } from 'archiver'; new ZipArchive()` instead of `7.x`'s `archiver('zip')` factory, but otherwise the same `directory()`/`file()`/`pipe()`/`finalize()` streaming API) that does the exact same thing (strip `build/test-assets`, write the `dsplay-data.js` placeholder, zip `build/`'s contents flat into `template.zip`) with no OS-specific tooling at all. `npm run zip` now works identically on Windows, macOS and Linux.

### Fixed: editing `public/dsplay-data.js` didn't trigger a dev-server reload

`index.html` loads it via a plain `<script src="/dsplay-data.js">`, not an ES module import — so it never entered Vite's module graph, and Vite's dev server only reloads/HMRs files it's tracking through that graph. Editing the mock data while `npm start` was running did nothing in the browser until a manual refresh. `vite.config.js`'s `watchDsplayData()` plugin now watches that one file directly (`server.watcher.add` + `handleHotUpdate`) and forces a full page reload on change — confirmed via a raw HMR-websocket connection that editing the file sends `{"type":"full-reload"}`.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
