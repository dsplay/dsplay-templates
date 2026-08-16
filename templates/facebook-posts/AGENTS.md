# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Facebook Posts** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), cycling through a Facebook page's recent posts (text, reactions, photos/videos) with a QR code linking back to each post. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

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
  hooks/
    use-style.js                <-- reads every color/style template variable in one place
    use-highlight.js             <-- wraps hashtags/links/mentions/phone numbers in colored spans
  util/defaults.js            <-- default color/style constants
  components/
    app/                        <-- top-level component (loader, fonts, background)
    main/                       <-- reads media, paginates posts, optional logo overlay
    posts/                      <-- cycles through the selected posts on a timer
    post/                       <-- lays out one post (user, media, text, info)
    user-profile/                <-- avatar + name
    media-slider/                <-- slides through a post's photos/videos
    info/                        <-- QR code, timestamp, reaction counts
    intro/                       <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Non-component helpers (`src/hooks/`, `src/util/`) live outside `components/` and don't need the folder+`index.jsx` treatment.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-facebook-posts`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization

This template has **no static, developer-authored UI text at all** — every visible string comes from the Facebook post data itself (user name, post text, dates). There's therefore no `react-i18next` setup here, unlike most other templates; don't add one unless a real static string is introduced. The one form of localization that does apply is date formatting via `moment` — see below.

- `src/index.jsx` imports `moment/locale/{fr,es,it,de,nl,pt,pt-br}` so `moment(...).format(...)` (used in `src/components/info/index.jsx`) renders dates in the viewer's language.
- `src/components/main/index.jsx` sets `moment.locale(...)` from `dsplay_config.locale` (split on `_` first, since it arrives region-qualified like `pt_br`) once per render — this used to be immediately overwritten by a stray `moment.locale('en');` a few lines later (leftover debug code), which silently forced every date to render in English regardless of the viewer's locale. That line was removed during the 2026 migration; if you see it reintroduced, it's a regression.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils)'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- `dsplay_media.result.data` holds `{ user: {name, pic}, posts: [...] }` — the actual Facebook data, refreshed by whatever backend service populates this template's media. `postCount`/`duration` control how many posts are shown and how long each is on screen.
- `src/components/main/index.jsx` slices `posts` to `postCount` (or a duration-derived default) and hands them to `src/components/posts/index.jsx`, which cycles through them on a timer.
- `src/hooks/use-style.js` centralizes every color/style `dsplay_template` variable read — add new style variables there, not inline in a component.

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

`qrcode.react` was bumped from `1.x` to `4.x` during the 2026 migration — that major replaced the default export with named `QRCodeCanvas`/`QRCodeSVG` exports and dropped the `renderAs` prop (`QRCodeSVG` always renders SVG); `size` must now be a pixel number, so `src/components/info/index.jsx` also passes `style={{width: '100%', height: '100%'}}` to let it scale to its container like the old `size="100%"` did.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
