# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Menu Board (Featured Products)** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/): a two-column chalkboard-style menu board (promo carousel + logo on the left, up to 10 product rows on the right). Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

This is one of four sibling menu-board templates in the DSPLAY catalog (`template-menuboard`, `template-menuboard-featured-products` (this one), `template-menuboard-promo-banner`, `template-menuboard-standard`) — each a distinct fixed layout, not variants of shared code. Don't assume changes here apply to the others.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
tailwind.config.js         <-- Tailwind + flowbite-react's plugin (this template uses Tailwind utility classes directly in JSX)
postcss.config.js
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  components/
    app/                      <-- top-level component (loader, fonts, i18n)
    main/                     <-- lays out the promo column + menu column
    menucarousel/             <-- scrolling promo image carousel (flowbite-react's Carousel)
    menuitens/                <-- up to 10 product name/price rows
    intro/                    <-- loading placeholder
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, `tailwind.config.js`, etc.).
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Main from '../main'`, never `.../main/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-menuboard-featured-products`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Internationalization (i18n)

- **Every static, developer-authored piece of UI text must go through `react-i18next`'s `t()`** — this includes default-fallback values shown when a required template variable is left unset (e.g. `t('Untitled')`, `t('Product 01')`) since those can genuinely reach a real viewer's screen, not just the actual CMS-user-authored `dsplay_template` variable content itself.
- **The i18n key is the English text itself** (`keySeparator: false`), and **the `en` resource entry must explicitly map every key to itself**.
- **Every template must provide translations for at least: `en`, `pt`, `es`, `it`, `de`, `nl`** (bare ISO codes, not region variants like `pt_br`). `dsplay_config.locale` comes in region-qualified — split it before calling `changeLanguage`: `const [lng] = locale.split('_'); i18n.changeLanguage(lng);` (done once, in `src/components/app/index.jsx`).
- `src/i18n.js` generates the repetitive `Product 01`..`10` / `Price 01`..`10` keys programmatically (a `numbered()` helper) rather than hand-writing 120 near-identical resource entries — keep that pattern if you add more numbered slots.
- **Do not call `useTemplateVal` (or any other hook) inside `.map()`/a loop** — `src/components/menuitens/index.jsx` looks like a natural candidate to loop over `prod_name01..10`, but hooks must be called unconditionally at the top level in a fixed order; the 20 slots are called out individually as separate `useTemplateVal` calls for this reason, then assembled into an array afterwards purely for the *rendering* loop (which is fine, since rendering isn't a hook).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `@dsplay/react-template-utils` exposes `useTemplateVal` (used for every variable in this template) and `FitText` (auto-scales text to fill its container — used for every text element here, all styled via the `.chalk-writed`/`.promo-title` classes which apply the Chalkboard/Vtkschalk fonts only once `FitText` signals it's ready).
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- `src/components/app/index.jsx` previously read a `background_blackboard` template variable that was never actually rendered anywhere (its only use was in a broken `useMemo(fn, dep1, dep2, ...)` call — `useMemo` only ever reads its second argument, so extra array arguments were silently ignored, meaning only `logo` was ever actually preloaded) — removed the dead variable and fixed the preload call to include every real image dependency in one array.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip`. The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## CMS variable registration cross-check

This template's variables (`logo`, `logo_banner`, `promo_title`, `menu_title`, `promo_img_01..03`, `prod_name01..10`, `prod_price01..10` — 24 total) match **exactly** the CMS's `tbl_template` id `1333` ("MenuBoard" type, name "Menu Board (two columns with promotions scroll)") — every variable name, no gaps in either direction. Don't confuse this with the *other* MenuBoard-typed CMS rows (id `1331` "Menu Board Vertical (two products)", id `1334` "Menu Board (Multipurpose Standard)") or the legacy `Message`-typed duplicates (id `1324`/`1332`) — those belong to the sibling repos, not this one.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. `@material-tailwind/react` and the bare `flowbite` package were removed during the 2026 migration — neither was actually imported anywhere in `src/`, only `flowbite-react`'s `Carousel` component is used. `flowbite-react` is pinned to `^0.10.2` rather than the current latest (`0.12.x`) because 0.11+ dropped the `flowbite-react/tailwind` plugin export this template's `tailwind.config.js` depends on, in favor of a different (CSS-based, Tailwind v4-oriented) integration approach — bumping past 0.10.x is a real integration migration, not a drop-in version bump, and was left out of scope here.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason. Don't force this with `--legacy-peer-deps`.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrade deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
