# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Voice AI** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that connects to a [Vapi](https://vapi.ai/) voice assistant: it requests microphone access, shows a short audio-level test, then renders a full-screen animated visualizer synced to the assistant's Vapi widget. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

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
  utils/
    logger.js                 <-- dev-only console logger (no-ops in production builds)
  components/
    app/                      <-- top-level component (loader, i18n)
    main/                     <-- mounts Home
    home/                     <-- requests microphone permission, then mounts VoiceFX
    voicefx/                  <-- 3-second audio-level test, then mounts VapiAssistant
    vapi/                     <-- loads the Vapi widget script, renders the animated visualizer
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Non-component helpers (e.g. `src/utils/logger.js`) live outside `components/` and don't need the folder+`index.jsx` treatment — plain kebab-case files are fine.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. Doesn't apply to actual template variable content typed in by a CMS user — only to text this template's own code puts on screen.
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`). `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);` (done once, in `src/components/app/index.jsx`, since i18next's language is a global singleton shared by every `useTranslation()` call in the tree).
- **Audit `t()` call sites against `src/i18n.js`'s resources whenever either changes** — a key used but missing a required language is a bug (silent fallback); a key defined but never referenced by any `t()` call is dead and should be removed. This template previously had zero `t()` usage despite a wired-up `i18n.js` full of dead demo keys (`Title`/`Config`/`Media`/`Orientation`) — the microphone-permission message and countdown text were hardcoded in English/Portuguese.
- Avoid calling `t()` inside a `useEffect` unless the effect is genuinely meant to re-run on language change — it forces `t` into the dependency array. `src/components/home/index.jsx` stores a boolean flag from the effect and translates it at render time instead, so a language change can't accidentally re-trigger the microphone permission request.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `@dsplay/react-template-utils` exposes `useTemplateVal` (used for `assistant_id`/`api_key`/`gradiente_color_1`/`gradiente_color_2`/`background_media`/`background_image_url`).
- Component flow: `app` -> `main` -> `home` (requests microphone permission) -> `voicefx` (3-second audio-level test) -> `vapi` (loads the Vapi widget script, renders the animated visualizer synced to the microphone and to the Vapi call).
- `src/components/home`, `src/components/voicefx`, and `src/components/vapi` each independently request microphone access via `getUserMedia` for their own visualizations — this duplication predates this migration and was left alone; only structure/naming/dependency hygiene was touched, not runtime behavior.

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

`@mui/material`, `@emotion/react`, `@emotion/styled`, and `react-router-dom` were removed during the 2026 Vite/React 19 migration — none were actually used anywhere in `src/` (the only consumer, `src/components/navigation`, was itself unused dead code). `kute.js` is still used, by `src/components/vapi`.

`package.json` pins `overrides.kute.js["svg-path-commander"]` to `2.1.11`. `kute.js` declares `svg-path-commander: ^2.1.11`, but `2.2.0+` restructured `svg-path-commander`'s public exports and dropped the named utility functions (`distanceSquareRoot`, `getPointAtLength`, etc.) that `kute.js`'s ESM build imports by name — an undeclared breaking change within what semver calls a compatible range, which fails the Vite build with `MISSING_EXPORT` errors. Remove the override once a `kute.js` release re-pins or works around the newer `svg-path-commander` API.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
