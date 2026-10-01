# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Loterias Caixa** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing the latest results and next estimated prize for Brazil's federal lottery games. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for how the media data is shaped.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
src/
  index.jsx                  <-- React entry point
  setup-tests.js               <-- Vitest setup (referenced by vite.config.js), mocks window.dsplay_media
  utils/screen.js               <-- computes the current screen format (landscape/portrait/square/banner)
  utils/moment.js                <-- moment configured for pt-br; always import moment from here, never from 'moment' directly
  images/                        <-- per-game logo images + shared background
  fonts/_fonts.scss                <-- @font-face declarations (remote Google Fonts URLs)
  components/
    app/                            <-- top-level component, picks which game to show from media.iteration
    ball/                           <-- renders one lottery number
    logo/                           <-- SVG clover logo, recolored per game (used by super-sete and loteca; the older games use PNG logos in images/)
    match/                          <-- one Loteca match row (teams, score, winning column 1/X/2)
    games/
      mega-sena/ dupla-sena/ quina/ loto-facil/ loto-mania/ time-mania/ dia-de-sorte/ federal/ super-sete/ loteca/
                                     <-- one component per game, each with its own index.jsx + per-screen-format .sass files
scripts/
  pack.mjs                   <-- zips the Vite build output into template.zip (Windows/macOS/Linux)
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** Each game folder is a partial exception: `index.jsx` is the component, but it's accompanied by up to 6 per-screen-format `.sass` files (base + `-h`/`-v`/`-banner-h`/`-banner-v`/`-squared`) rather than a single `style.sass` — that split predates this migration and wasn't worth the risk of merging by hand across the games, so it was left as-is. New games should follow the same pattern for consistency.
- **Always import a component by its folder, never by reaching into `index`** — `import Federal from '../games/federal'`, never `.../federal/index`.
- Non-component helpers (`src/utils/screen.js`) live outside `components/` and don't need the folder+`index.jsx` treatment.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.
- `src/util.js/` (a directory literally named `util.js`, containing `screen.js`) was renamed to `src/utils/` during the 2026 migration — the old name was a naming footgun (looks like a file, is a directory) inherited from an early version of this repo.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-lottery-br-caixa-economica-federal` (already correct, no fix needed here).

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty. This template has no Template Vars at all (confirmed against the CMS's registered variables for this template — zero rows), so that section is replaced with a one-line explanation instead of an empty table.

## Internationalization

**Deliberately no `react-i18next` here, unlike most other templates.** This template's entire purpose is displaying official Brazilian federal lottery results (Mega-Sena, Quina, etc. are proper nouns) to a Brazilian audience — every on-screen label ("Próximo Prêmio", "Último Resultado", "Concurso nº", "ganhador(es)", "Acumulou", the month names in `dia-de-sorte`) is Brazilian Portuguese by design, not generic UI chrome that should support `en`/`es`/`it`/`de`/`nl`. Don't add i18n scaffolding here; don't translate the game/label text either — both would be wrong for this template's actual audience. Date formatting already respects locale via `moment`/`moment/locale/pt-br`, which is the only localization concern that applies.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development** (renamed from legacy unprefixed `media`/`config`/`template` globals during the 2026 migration — `@dsplay/template-utils` supports both, but the prefixed names match every other template). `scripts/pack.mjs` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- This template reads `@dsplay/react-template-utils`'s `useMedia()` hook, called inside each component that needs it (`app`, and each of the 8 game components). It used to read `@dsplay/template-utils`'s `media` export directly instead — that predated the hooks library and was originally left as-is, then migrated later at the maintainer's request (same as [`template-horizontal-info-bar`](https://github.com/dsplay/template-horizontal-info-bar)). `@dsplay/template-utils` is no longer a direct dependency (still pulled in transitively via `@dsplay/react-template-utils`).
- **Always read template data through these hooks, called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant.**
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This template has zero `dsplay_template` variables today, but this applies to any added from now on — never rename this template's existing keys just to match, since they're already registered/in use in production CMS configurations.
- `src/components/app/index.jsx` picks a game to render via `media.iteration % <count of games with data present>` — so only games whose `media.result.data` key actually has a value are ever shown, cycling by iteration.
- Each game component destructures its own slice of `media.result.data.<game>.round`/`.next` — see `public/dsplay-data.js` for the full expected shape per game.

### Fixed: `react-countup`'s default import resolved to the wrong thing, crashing every game

`react-countup` ships a UMD build; Vite/esbuild's CJS-interop can't statically see its `Object.defineProperty(exports, '__esModule', ...)` marker (it's nested inside the UMD factory function, not at the top level), so it falls back to treating the *entire* `module.exports` object (`{ default: <component>, useCountUp: <hook> }`) as the default export. Every game component did `import CountUp from 'react-countup'`, so `CountUp` was that whole object, not the component — React threw "Element type is invalid... got: object" the instant any game with a `<CountUp>` tried to render (every game has at least one). Confirmed via `git stash` that this predates the entire 2026 migration (it's present back to the original `react-countup@^4.4.0` → `^6.5.3` bump), not something introduced by any recent change here.

Worse, the correct fix differs by environment: the browser dev/prod bundle needs `ReactCountUp.default`, but Vitest's SSR transform interops it correctly already, so there `ReactCountUp.default` is `undefined` and `ReactCountUp` itself is the real component. Every game component now does:
```js
import ReactCountUp from 'react-countup';
const CountUp = ReactCountUp.default || ReactCountUp;
```
right after its imports. Don't simplify this to a plain default import or to `{ default: CountUp }` named-import syntax — both are semantically identical to the plain default import and reintroduce the crash in the browser.

### Fixed: `loto-facil`'s mock data was missing `accumulatedIndependenceDaySpecialPrize`

Once the import bug above was fixed, `loto-facil` (specifically) still crashed — with a *different* error, thrown from inside `countup.js`'s own constructor (`Cannot read properties of null (reading 'innerHTML')`). Its "Sorteio Especial da Independência" `<CountUp end={nextSpecialPrizeAccumulated} />` had `end={undefined}` because `public/dsplay-data.js`'s `lotofacil` entry never had an `accumulatedIndependenceDaySpecialPrize` field (unlike `dupla-sena`'s `accumulatedEasterSpecialPrize` and `quina`'s `accumulatedSaintJohnSpecialPrize`, which do have real mock values and rendered fine). `countup.js`'s constructor only touches `this.el.innerHTML` when `end` is `null`/`undefined` (to infer a start value from existing DOM text) — combined with `el` legitimately being `null` on `CountUp`'s very first synchronous render (before its ref attaches; this is normal library behavior and self-corrects once the mount effect re-creates the instance with a real `el`), a missing `end` value is fatal. Fixed by adding a mock `accumulatedIndependenceDaySpecialPrize` value to `lotofacil` in `public/dsplay-data.js`. If a similar crash ever recurs on another game, check for a `<CountUp end={...} />` whose value can be `undefined` given the current mock/real data shape.

## Game screenshots

`docs/screenshots/games/<game>/<format>.png` (10 games x landscape/portrait/square/banner-h/banner-v) are shown in README.md's "Supported games" section. Regenerate them whenever a game's layout or the mock payload changes: run `npm start`, and for each game set `iteration` in `public/dsplay-data.js` to its index in `gameMap` (`src/components/app/index.jsx`), then capture at 1920x1080 (landscape), 1080x1920 (portrait), 1080x1080 (square), 1920x360 (banner-h) and 360x1920 (banner-v) with a device scale factor of 0.5 (keeps the images small). Wait ~6s before capturing: the prize values animate with `react-countup` and screenshots taken earlier show half-counted numbers. Do not use headless Chrome's `--window-size` for the narrow banner: it enforces a minimum window width, so the page renders in the wrong format.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `scripts/pack.mjs`, which zips the whole build output). For this template, `template-variables.json` is legitimately an empty list — see "Runtime model" above.

## Browser/WebView compatibility (Android SDK 23 minimum)

DSPLAY's Android app supports devices back to Android 6.0 (API 23). On locked-down signage hardware that never receives WebView updates via Play Store, the actual JS engine can be stuck around the Chrome ~40-51 era that shipped with that OS generation — not a modern evergreen browser. `@vitejs/plugin-legacy` exists specifically to cover this: it builds a modern ES-module bundle plus a transpiled+polyfilled "legacy" nomodule bundle for anything the `browserslist` target in `package.json` doesn't natively support.

Two things must never regress, or the legacy bundle silently stops protecting old devices while still *looking* correctly configured:

- **`package.json`'s `browserslist` must keep `Chrome >= 45` and `Android >= 4.4`** (alongside the generic `>0.2%`/`not dead`/etc. entries) — dropping these two narrows the resolved target list to whatever's "current" (verify with `npx browserslist`), which silently stops emitting transpiled code for anything old, even though `@vitejs/plugin-legacy` stays nominally wired up.
- **`vite.config.js`'s `build.minify` must stay `'terser'`, not the default `oxc`** — `oxc`'s minifier has a known bug where it reintroduces `?.`/`??` into the legacy chunk after Babel already expanded them away, silently breaking the one guarantee the legacy build exists to provide.

After touching either of these, verify by actually running `npm run build` and grepping the emitted `build/assets/index-legacy-*.js` for untranspiled arrow functions (`=>`) or real `?.`/`??` usage — a config that looks right can still emit a broken legacy bundle if a dependency version bump reintroduces one of these, so don't assume correctness from the config file alone.

### Fixed: `browserslist` had drifted too narrow, silently defeating the legacy build's old-Android coverage

This repo's `browserslist` was `[">0.2%", "not dead", "not ie <= 11", "not op_mini all"]` — missing the `Chrome >= 45`/`Android >= 4.4` entries present in the reference boilerplate. `npx browserslist` showed this resolved only down to modern Chrome (and modern Android/Firefox/Safari), nowhere near the Android 6.0/API 23 WebView DSPLAY's Android app must support. `vite.config.js`'s `build.minify: 'terser'` (with its explanatory comment) was already correctly in place here — only the `browserslist` entry had drifted. Found during a full fleet audit and fixed by restoring the two missing browserslist entries; after the fix, the emitted `build/assets/index-legacy-*.js` had zero untranspiled arrow functions and no real `?.`/`??` (only false-positive matches inside a regex string literal and CSS `unicode-range` values).

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

`react-countup` was bumped from `4.x` to `6.x` and `core-js`/`node-sass`/`react-scripts` were dropped entirely during the 2026 migration (Vite + `@vitejs/plugin-legacy` now handles the polyfill/legacy-browser story that `core-js` used to). `react-countup`'s core props (`start`/`end`/`duration`/`decimals`/`decimal`/`separator`) are unchanged across that range, so no call sites needed updating.

### Fixed: `npm run zip` didn't work on Windows at all

`build.sh` (bash + the system `zip` CLI) was the only thing `npm run zip` ran after building — neither ships on Windows, not even under Git Bash (Git for Windows doesn't bundle `zip`/`unzip`). Replaced with `scripts/pack.mjs`, a plain Node script (`fs` + the `archiver` devDependency, pinned to `7.0.1` — the long-established CJS-style `archiver('zip', opts)` API, not `8.x`'s from-scratch ESM rewrite with a very different class-based API and far less real-world mileage) that does the exact same thing (strip `build/test-assets`, write the `dsplay-data.js` placeholder, zip `build/`'s contents flat into `template.zip`) with no OS-specific tooling at all. `npm run zip` now works identically on Windows, macOS and Linux.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
