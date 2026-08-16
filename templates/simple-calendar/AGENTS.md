# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Simple Calendar** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing the current date/time next to a month calendar. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md — this template currently has no configurable Template Vars at all (colors/layout are hardcoded), confirmed against the DSPLAY CMS's registered variables for this template (empty).

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                  <-- React entry point
  setup-tests.js              <-- Vitest setup (referenced by vite.config.js)
  i18n.js                     <-- react-i18next setup
  translate-settings/
    language-settings.js        <-- i18next resources, plus a date-fns Locale object per language (see below)
  components/
    app/                        <-- top-level component (loader, fonts, i18n)
    main/                       <-- ticks the clock, lays out today-calendar + calendar
    today-calendar/              <-- current date/time panel
    calendar/                    <-- month grid, with a compact single-week layout for short/banner screens
    loader-calendar/              <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-simple-calendar` (was already correct before this migration).

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. This template has exactly one such string: the "Today" button in `src/components/calendar/index.jsx`.
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself**.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes). This template also carries `fr` as a bonus. `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: done once, in `src/components/app/index.jsx`, via `useConfig()` (this repo previously had no such call at all — language was left entirely to `i18next-browser-languagedetector`'s browser-locale guess, ignoring `dsplay_config.locale`).
- **Quirk specific to this template**: `src/translate-settings/language-settings.js` stashes a `date-fns` `Locale` object under the `locale` key of each language's resource bundle, alongside the real translatable `Today` key. This isn't translatable UI text — components read it directly via `i18n.t('locale', { returnObjects: true })` to get the right `Locale` object for `date-fns`'s `format()`, keyed off whatever language i18next is currently set to. Keep this working the same way if you touch either file.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils)'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- This template reads no `dsplay_template` variables at all — everything (colors, layout) is hardcoded in each component's Sass file. `src/components/calendar/index.jsx` switches to a compact single-week layout when `window.innerHeight` is small (horizontal banner screens).
- The DSPLAY CMS's `tbl_template_var` table has a *separate*, richer registration named "Custom Simple Calendar" with 14 color/logo variables (`primaryColor`, `logoBgColor`, etc.) that this codebase doesn't implement — that's a distinct, client-specific customization, not something this open-source repo currently supports. Don't assume it's a gap in this migration; flag it to a human if a themeable version is ever wanted here.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip`. For this template, `template-variables.json` legitimately comes out empty (see above). See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

`phosphor-react` (deprecated, last released years ago) was replaced with its actively-maintained successor `@phosphor-icons/react` during the 2026 Vite/React 19 migration — same icon names (`CaretLeft`/`CaretRight`), drop-in swap. `date-fns` was bumped 2 -> 4; v3+ moved locale imports from one-file-per-locale default exports (`date-fns/locale/pt-BR`) to named exports off a single `date-fns/locale` barrel (`import { ptBR } from 'date-fns/locale'`) — already updated in `src/translate-settings/language-settings.js`.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
