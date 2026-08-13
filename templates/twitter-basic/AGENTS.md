# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Twitter Basic** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that cycles through a Twitter/X user's recent posts. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

Unlike the more recently authored templates in this ecosystem, this one predates `@dsplay/react-template-utils`'s hooks-based API — it reads `dsplay_template`/`dsplay_config`/`dsplay_media` directly via `@dsplay/template-utils`'s `tval`/`tbval`/`config`/`media` exports, and uses class components. This was kept as-is during the Vite/React 19 migration rather than rewritten to hooks — same precedent as `template-horizontal-info-bar` and `template-instagram-basic`.

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
  font/                       <-- vendored Flaticon icon font + Google Fonts (Oswald, Roboto)
  components/
    app/                      <-- top-level component (reads media.result.data, cycles posts)
    posts/                    <-- advances through the post list on a timer
    post/                     <-- renders one post's text/media/hashtags/mentions/links
    info/                     <-- per-post QR code + timestamp/likes/shares footer
    user-profile/             <-- user avatar/name/handle header
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of (e.g. `src/font/Flaticon.*`, `src/font/google/*_400_normal.*` — downloaded as-is from Flaticon/Google Fonts).
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Post from '../post'`, never `.../post/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-twitter-basic`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

This template has **no static, developer-authored UI text** — every visible string comes from the tweeted post data or from `dsplay_template` variables (colors, etc). `react-i18next` was not added; if a future change introduces real UI copy, wire it up then, following the convention documented in `template-boilerplate-react`'s AGENTS.md (key = English text, `en` self-mapped, minimum `en`/`pt`/`es`/`it`/`de`/`nl`).

`moment` locale imports (`pt-br`, `pt`, `es`, `de`, `fr`, `it`, `nl`) are a separate concern from i18n — they only affect date/time *formatting* in `src/components/info/index.jsx`, not translated UI copy. Keep this set in sync with the minimum language list above when adding new locales elsewhere.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`). `src/components/app/index.jsx`, `src/components/post/index.jsx`, and `src/components/info/index.jsx` used to read `config`/`media`/`isVertical`/`tval`/`tbval` directly at module scope (`App` was even a class component, reading values imperatively in `componentDidMount`) — migrated to hooks; `App` is now a function component with the same DOM-mutation side effects moved into `useEffect`.
- `media.result.data.user`/`media.result.data.posts` (the tweeted content) drive `UserProfile` and the post cycling in `Posts`; `media.duration` and post count together determine how long each post is shown.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`tbval`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

Cross-checked against the CMS's actual registered variables for this template (local `tbl_template_var` dump, `template_id` 695, "Twitter Basic") — **none of this template's 12 variables are currently registered there**. The code and README are correct regardless (the DB reflects what's been manually registered in the CMS admin at some past snapshot, not what the code supports) — worth registering them in the CMS at some point.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
