# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Meeting Room** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing an event's name, schedule, location, and host/event branding, split into a landscape/portrait layout. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

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
    use-language.js           <-- derives an Intl-compatible locale from dsplay_config.locale
  components/
    app/                      <-- top-level component (loader, fonts)
    main/                     <-- lays out event name/dates/location/logos
    intro/                    <-- loading placeholder
    beautyloader/             <-- animated dots shown inside the loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-meeting-room`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

This template has **no static, developer-authored UI text at all** — every visible string comes from `tbl_media` (event name, location, start/end dates, formatted via native `Date.prototype.toLocaleString` and `src/hooks/use-language.js`, which derives a locale from `dsplay_config.locale`) or from `dsplay_template` image/color variables. There is nothing to run through `react-i18next`'s `t()`, so — unlike every other migrated template — this repo has **no `i18n.js`, no `I18nextProvider`, and no `i18next`/`react-i18next`/`i18next-browser-languagedetector` dependencies**. This was removed during the 2026 migration after confirming zero `t()`/`useTranslation()` usage anywhere in the pre-migration code (the wiring was present but entirely inert — `src/i18n.js` only had dead demo keys). If a future change adds real static UI text, reintroduce the same i18n stack used by every other template (see `template-alerts`' AGENTS.md for the pattern) rather than hand-rolling something new.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `@dsplay/react-template-utils` exposes `useTemplateVal` (used for `eventLogo`/`hostLogo`/`mainColor`/`rightColorTop`/`rightColorBottom`) and `useMedia` (used for `eventName`/`location`/`startDate`/`endDate`).
- `src/components/main/index.jsx` lays out the event info; `color-thief-react` extracts a dominant color from `eventLogo`/`hostLogo` to use as their card background (so logos with transparent backgrounds don't show a jarring white box).

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

### Known accepted risk: `npm audit` flags `color-thief-react`'s transitive `colorthief` dependency

`npm audit` reports 8 vulnerabilities (2 critical) in `request`/`form-data`/`qs`/`tough-cookie`/`uuid`, all pulled in transitively via `color-thief-react` -> `colorthief@2.3.2` -> `get-pixels` -> `request`. This is `colorthief`'s **Node.js-only** pixel-reading fallback — `color-thief-react` actually imports the pre-built browser bundle `colorthief/dist/color-thief.umd.js` (confirmed by grepping it: zero references to `get-pixels`/`request`/`form-data`), which uses `<canvas>` instead. None of the vulnerable code is reachable from this template's Vite build. Newer `colorthief` majors aren't a safe drop-in fix: `2.6.0+` switched to the native `sharp` binary (wrong runtime for a browser bundle), and `3.x` is a WASM/worker rewrite with a different file layout and likely a different (async) API — either would need `color-thief-react` itself to update its `colorthief` dependency and be verified working, not just an `overrides` pin. Revisit if `color-thief-react` ships a release compatible with a non-vulnerable `colorthief`.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
