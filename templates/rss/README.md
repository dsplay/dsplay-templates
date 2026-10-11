![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - RSS Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — shows a single news/RSS item with a title, description, optional image, and an optional QR code linking back to the source.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Supported screen formats

| Landscape | Portrait | Square | Horizontal banner |
|-----------|----------|--------|--------------------|
| ![Landscape](docs/screenshots/landscape.png) | ![Portrait](docs/screenshots/portrait.png) | ![Square](docs/screenshots/square.png) | ![H-Banner](docs/screenshots/h-banner.png) |

## Template variables

| Key              | Type    | Description                                                          |
|-------------------|---------|-------------------------------------------------------------------------|
| `show_qr_code`    | boolean | Shows a QR code linking to `media.link`, next to the text. Defaults to `true`. |
| `bg_color`        | string  | Background color of the whole item. Defaults to `black`.             |
| `logo`            | string  | Logo image shown next to the title. Falls back to a bundled RSS icon. |
| `logo_bg_color`   | string  | Background color behind the logo. Defaults to `white`.               |
| `title_color`     | string  | Title text color. Defaults to `white`.                                |
| `title_bg_color`  | string  | Background color behind the title. Defaults to `darkorange`.         |
| `text_color`      | string  | Description text color. Defaults to `white`.                          |
| `text_bg_color`   | string  | Background color behind the description and the item image. Defaults to `black`. |
| `debug`           | boolean | Shows a debug overlay dumping the current `media`/`template`/`config`/screen-info objects. |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

> New variable names should use `snake_case` (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's label from its key, and snake_case reads more naturally there.

## Expected media data (`media.*`)

Unlike a generic custom template, each item shown here is populated by DSPLAY from a JSON-service-backed feed, not typed in through Template Vars. `src/util/defaults.js` and the components under `src/components/` read the following `media` fields (see `useMedia()` call sites):

- `source` — an internal marker for which feed produced this item (e.g. `'UOLIndoor'`). It flips which field is treated as the main text: for `UOLIndoor` sources the title comes from `itemDescription` and the description from `itemTitle`; for every other source it's the reverse (`title`/`itemTitle`).
- `title`, `itemTitle`, `itemDescription`, `itemContent` — text fields, see the `source`-dependent swap above.
- `hasImage`, `imageUrl` — when `hasImage` is falsy, `src/components/image` falls back to a bundled placeholder image (and hides entirely on banner screen formats).
- `link` — the item's URL. `src/components/qr-code` only renders when this is set.
- `qrCode` — when falsy, hides the QR code regardless of `show_qr_code`.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**. The dev server builds the shared `@dsplay/*` libraries first, which a bare `npm start` inside this folder does not, and `npm install` run inside this folder only installs this template's own packages, not the repository tooling (Turborepo) that does that build.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-rss
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit it to try out different variable values and media data — the DSPLAY Player App replaces it with real content at runtime.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/rss   # from the repository root
```

`template.zip` is written to this folder (`templates/rss/template.zip`). The **Package templates** GitHub workflow builds it too (Actions tab, then download the artifact), so you can get it without a local build.

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

**Dependencies must always be pinned to an exact version** (never `^`, `~` or any other range). The repository's root [`.npmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.npmrc) sets `save-exact=true`, so `npm install <pkg>@<version>` pins automatically. It also disables dependency install scripts (`ignore-scripts=true`) and only accepts package versions published at least 3 days ago (`min-release-age=3`), to reduce supply chain risk. None of the current dependencies need a post-install build step; if one ever does, add a `setup` script to `package.json` (`npm install && npm rebuild <package>`) and document it here.

[Dependabot](https://github.com/dsplay/dsplay-templates/blob/main/.github/dependabot.yml) proposes updates weekly, waiting 3 days after a release (7 days for major versions) before opening a PR.

```sh
npm outdated                  # from the repository root: what has newer versions available
npm install <dependency>@<version> -w dsplay-template-rss   # bump a dependency of this template (stays pinned)
```

Since versions are pinned, `npm update` does nothing; bump each package explicitly (or merge Dependabot's PRs). For a major bump, verify `npm start -- --filter=dsplay-template-rss` and `npx turbo run build test --filter=dsplay-template-rss` (from the repository root) still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates

To work on this template together with the others (shared libraries, creating a new template from an existing one, releases), see the [repository README](https://github.com/dsplay/dsplay-templates/blob/main/README.md).
