# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Menu Board (Standard)** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), showing a chalkboard-styled menu board with up to 10 products. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

This is one of four related menu-board templates in the DSPLAY template catalog ([`template-menuboard`](https://github.com/dsplay/template-menuboard), [`template-menuboard-featured-products`](https://github.com/dsplay/template-menuboard-featured-products), `template-menuboard-promo-banner`, `template-menuboard-standard` (this one)) — each a distinct visual design, not variants of the same code. Don't assume shared code with the others.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
postcss.config.js          <-- Tailwind + autoprefixer, required for Vite (unlike CRA, no auto-detection)
tailwind.config.js
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  components/
    app/                      <-- top-level component (loader, fonts, i18n, background)
    main/                     <-- lays out logo + menuitens
    menuitens/                <-- the product list itself (chalkboard banner + 10 name/price rows)
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component. For one that grows into several files, `index.jsx` becomes a barrel re-exporting the folder's public API.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-menuboard-standard`.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — never a hardcoded string in JSX. Doesn't apply to actual product name/price content typed in by a CMS user — only to text this template's own code puts on screen, which in this template is just the fallback default shown when a product slot is left empty ("Untitled", "Product `<n>`", "Price `<n>`").
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself** — never leave it sparse/empty relying on i18next's implicit key-as-fallback behavior.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`). `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);` (done once, in `src/components/app/index.jsx`).
- This repo previously had `i18next`/`react-i18next` fully installed with an `i18n.js` full of dead demo keys (`Title`/`Config`/`Media`/`Orientation`) but the `I18nextProvider` was never even wired into the component tree — the whole i18n stack was completely inert. Fixed by wiring it up properly and replacing the 10 separate "Product 01".."Product 10" (and "Price 01".."Price 10") fallback strings with two interpolated keys, `Product {{n}}` / `Price {{n}}`, instead of 20 near-duplicate keys.

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils)'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This only applies to variables added from now on — never rename this template's existing keys just to match, since they're already registered/in use in production CMS configurations.
- `background_image` falls back to a bundled default image (`src/assets/image/raw-meat-with-herbs-and-spices-space.png`) when unset — this is intentional, pre-existing behavior, not a placeholder to remove.
- `src/components/menuitens/index.jsx` imports `chalk-banner.svg` as an *asset* (a URL used in a CSS `background-image`), not as a component — there is also an unrelated, unused `SvgBanner` React component that used to live in `src/components/svgbanner/` with the exact same name; it was dead code (never imported by anything) and has been removed. Don't recreate it under that name without checking it's actually wired up.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

The CMS's own registered variables for this template (`tbl_template_var`, `template_id` 1334, "Menu Board (Multipurpose Standard)") match this repo's 22 variables exactly — `logo`, `background_image`, `menu_title`, `prod_name01..10`, `prod_price01..10`. There's also a legacy duplicate registration under the older `Message` type (`template_id` 1332, missing `menu_title`) — superseded, not relevant to this repo.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

`@material-tailwind/react`, `flowbite`, and `flowbite-react` were removed during the 2026 Vite/React 19 migration — grepping `src/` found zero actual usage of any component from either library, only plain Tailwind utility classes (which come from `tailwindcss` itself, not from these two component libraries). `tailwindcss`/`autoprefixer` were promoted from an accidental transitive install (via one of those two libraries, auto-detected by CRA's zero-config Tailwind support) to real, explicit devDependencies with their own `postcss.config.js`, since Vite has no equivalent auto-detection.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
