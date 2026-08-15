# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Analog Clock** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing an animated analog clock face plus the current local date/time. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

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
  hooks/
    use-language.js           <-- derives the base ISO language code from dsplay_config.locale
  components/
    app/                      <-- top-level component (loader, fonts, i18n)
    main/                     <-- reads background/theme template variables, ticks the clock
    city/                     <-- lays out one clock + formatted date/time
    clock/                    <-- the animated analog clock face (SVG + rotated hand divs)
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Non-component helpers (e.g. `src/hooks/use-language.js`) live outside `components/` and don't need the folder+`index.jsx` treatment — plain kebab-case files are fine.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention. Prior to this migration, every component here was a loose `<name>.jsx` file directly inside its folder (`main/main.jsx`, `clock/clock.jsx`, etc.) instead of `index.jsx`, and the top-level `app` component wasn't in its own folder at all (`src/app.jsx`) — both fixed.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-analog-clock`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. This template only has one: the "Local Time" label in `src/components/main/index.jsx`.
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`) — this template's `i18n.js` already did, plus an extra `fr`. `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);`. This was previously done in `src/components/main/index.jsx` via a `useEffect` + the `useLanguage` hook; moved to `src/components/app/index.jsx` (called once, directly in the render body — matching every other migrated template, since i18next's language is a global singleton). `src/hooks/use-language.js` is still used separately, by `src/components/city/index.jsx`, to format the date/time string in the current locale via `Date.prototype.toLocaleString`.
- **Audit `t()` call sites against `src/i18n.js`'s resources whenever either changes** — a key used but missing a required language is a bug; a key defined but never referenced is dead and should be removed.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `@dsplay/react-template-utils` exposes `useTemplateVal` (`background`/`background_theme`/`clock_theme`) and `useInterval` (ticks the clock once per second).
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- Component flow: `app` -> `main` (reads template variables, owns the 1-second tick) -> `city` (formats the date/time, also accepts an optional `utcOffset` prop unused by this template but kept for reuse) -> `clock` (the animated SVG face).

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

`axios` was removed during the 2026 Vite/React 19 migration — declared but never imported anywhere in `src/`.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Styling

### Fixed: build-time Sass warnings from broken multi-selector rules, and dead `.city`/`.brand`/`.brand-box` CSS

`npm run build` used to print a dozen `WARNING: This selector doesn't have any properties and won't be rendered.` warnings from `main/style.sass` and `clock/style.sass`. Root cause: Sass's **indented syntax** doesn't support SCSS-style multi-line comma-free selector lists — `.city\n.date\n.brand\n  color: red` does NOT apply `color: red` to all three; only the *last* bare selector in the chain gets the indented block below it, and every selector before it is silently empty. This file had several of these, apparently intended to share properties across `.city`/`.date`/`.brand`/`.clock-container`.

Investigating which of those classes are actually real turned up a second, bigger fact: `.city`, `.brand`, and `.brand-box` are **not rendered by this template at all** — `src/components/city/index.jsx` only ever renders `.ds-grid-item`/`.clock-box`/`.date` (confirmed unchanged since before the Vite migration, and confirmed via `grep -rn "\bcity\b\|\bbrand\b\|brand-box" src --include=*.jsx"` finding zero matching elements). This template is a single-city derivative of `template-world-clocks-analog` (which *does* render `.city`... actually renders a `.brand-box`/`.brand` grid item and multiple `.city`-classed `<City>` grid items) — the shared multi-city-grid CSS was carried over wholesale but never trimmed for the single-city case.

Fixed by removing all `.city`/`.brand`/`.brand-box` rules (base + every viewport/theme variant) and fixing the remaining broken merges to target only the classes that are actually real (`.date`, `.clock-container`) with proper comma-separated selectors.

Separately, `clock/style.sass`'s three `&.transition-effect` blocks (meant to smooth the hour/minute/second hands' `rotateZ` sweep, toggled by `clock/index.jsx`) were also completely empty — same warning, different cause: the property was simply never filled in. Added `+transition(transform 0.3s ease-out)` (using the existing `_mixins.sass` mixin) to each. This exposed a **second, related bug**: the JS toggled the class via `date.hours === 0` / `date.minutes === 0` / `date.seconds === 0` — `date` is a `moment()` instance, which has `.hour()`/`.minute()`/`.second()` *methods*, not `.hours`/`.minutes`/`.seconds` properties, so these comparisons were always `undefined === 0` (always false), meaning `transition-effect` was *always* applied, including across the wrap-around moment (e.g. 59s → 0s) it was meant to skip. Fixing only the CSS half without this would have introduced a visible sweep-back glitch that didn't exist before (since the empty CSS made the class a no-op either way). Fixed to `date.hour() === 0` etc. in `clock/index.jsx`.

### Known bug (not yet fixed): `.clock-container` renders wildly oversized and off-screen

While visually verifying the fix above, found `.clock-container` rendering at ~2781×2809px against a 1854×927 viewport (`rect.left` around -463px, `rect.top` around -929px) — the clock face is enormous and mostly off-screen. Confirmed via `git stash` that this pre-dates every fix in this session (identical in the last-committed state before any of today's edits).

Root cause traced to `_mixins.sass`'s `=dsGridItem` mixin: `flex: 1 1 25` — the flex-basis `25` has **no unit** (should almost certainly be `25%`, matching the 4-per-row grid `template-world-clocks-analog` uses this same mixin for). With only one grid item in this single-city template, `flex-grow: 1` stretches `.ds-grid-item` to the full container width regardless of this bug, so fixing the missing `%` alone won't change anything here — the real problem is downstream: `.clock-box { width: 150% }` is an intentional overflow-crop trick tuned for `.ds-grid-item` being a *quarter*-width cell (as in the multi-city template), and now computes 150% of the *full* viewport width instead, blowing the clock face up ~4x past where it should be.

Not fixed yet — the right fix depends on what `.clock-box`'s sizing should actually be for a single, full-screen clock (this template's actual use case), which is a design call, not a mechanical one. Re-check `template-world-clocks-analog` (the sibling multi-city template these mixins are shared with) before touching `_mixins.sass` directly, since that one may depend on the current values working correctly for its 4-per-row grid.

### Example data uses a real web-hosted background image, not a local file

`public/dsplay-data.js`'s `background` example used to point at a commented-out `../test-assets/back-black.jpg` — a local file that only exists in this dev checkout and gets stripped from the release build (see "Test assets" in README.md). Replaced with a real, public-domain, web-hosted image (`https://upload.wikimedia.org/wikipedia/commons/1/1f/White_stone_brick_wall.jpg`) set as the active (uncommented) default, matching every other already-migrated template's convention, and deleted the now-unused local files (`back.jpg`, `back-black.jpg`, `dsplay-logo.png` — the last one wasn't referenced anywhere at all, `logo-01.png` — also unreferenced, a leftover from the shared `template-world-clocks-analog` codebase this template was derived from).

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
- Version bumps (`package.json`'s `version` field) get their own commit, titled with just the version number and no emoji (e.g. `4.1.0`), separate from the commit(s) that made the actual change.
