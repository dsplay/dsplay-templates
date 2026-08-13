# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Countdown** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing a countdown timer to a target date (from `dsplay_media.date`). Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point, wraps App in CountDownContextProvider
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  contexts/
    count-down-context/       <-- computes the day/hour/minute/second breakdown, ticks every second
  components/
    app/                      <-- top-level component (loader, i18n)
    count-down/               <-- title/date header + the box-timer row
    box-timer/                <-- a two-digit hours/minutes/seconds box
    box-timer-days/            <-- the (variable-width) days box
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Every component (and context provider, since it renders JSX) gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import CountDown from '../count-down'`, never `.../count-down/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-countdown`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. Doesn't apply to actual template variable content (e.g. `dsplay_media.title`) typed in by a CMS user — only to text this template's own code puts on screen (the `days`/`hours`/`minutes`/`seconds` labels).
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior. `en` previously had no `days`/`hours`/`minutes`/`seconds` entries at all and only "worked" by accidental key/value coincidence — fixed.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`) — this template also carries a bonus `fr`, which is fine. `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);` (done once, in `src/components/app/index.jsx` — this call was entirely missing before, meaning the displayed language was stuck at whatever `i18next-browser-languagedetector` guessed from the browser, ignoring `dsplay_config.locale`).
- **`src/i18n.js` also doubles as a registry of `date-fns` locale objects** (keyed the same as the translation resources, under the `locale` key) — `src/components/count-down/index.jsx` reads `i18n.t('locale', { returnObjects: true })` to format the target date. This is a deliberate, pre-existing reuse of the i18next resource bag for non-string data, not a bug — leave the mechanism as-is.
- **Audit `t()` call sites against `src/i18n.js`'s resources whenever either changes** — a key used but missing a required language is a bug (silent fallback); a key defined but never referenced by any `t()` call is dead and should be removed. A dead, unused `Title` key was removed here.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `@dsplay/react-template-utils` exposes `useMedia`/`useTemplateVal`/`useConfig` (used for `dsplay_media.date`/`.title` and `bg_image`/`bg_color_1`/`bg_color_2`/`bg_font_color`).
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- `src/contexts/count-down-context/index.jsx` is the countdown's ticking clock: it computes `days`/`hours`/`minutes`/`seconds` from `dsplay_media.date` once per second and exposes it (plus the background/font styling) via `useCountDownContext()`.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

**Known scanner bug (not fixed here, out of this repo's scope):** the scanner's image-name heuristic (`bg[_-]` among other patterns) matches before its color-name heuristic runs, so `bg_color_1`/`bg_color_2`/`bg_font_color` all currently get `subtypeGuess: "image"` instead of `"color"` in the generated `template-variables.json` — cosmetic only (doesn't block the build), but worth fixing in `@dsplay/template-manifest` itself (check color-name patterns before image-name ones) since it likely affects other templates with a `bg_color`-style variable name too.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing. `date-fns` v4's locale objects are named exports off the `date-fns/locale` barrel (`import { enUS, ptBR } from 'date-fns/locale'`), not per-locale default exports like v2 — this changed again once already going from v2/v3, keep an eye on it on the next major.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
