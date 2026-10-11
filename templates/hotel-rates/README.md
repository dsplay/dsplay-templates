![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Hotel Rates Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — a hotel lobby/reception board showing room rates, photos, local weather, and currency exchange rates.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Supported screen formats

| Landscape | Square |
|-----------|--------|
| ![Landscape](docs/screenshots/landscape.png) | ![Square](docs/screenshots/square.png) |

## Template variables

| Key                        | Type   | Description                                                                                     |
|-----------------------------|--------|---------------------------------------------------------------------------------------------------|
| `logo`                      | string | Hotel logo, shown in a circular badge and preloaded before the intro dismisses.                  |
| `background_color`          | string | Background color behind the whole layout.                                                        |
| `image_01`, `image_02`, `image_03` | string | Photos shown in the three image cards.                                                    |
| `primary_card_color` / `primary_card_font_color`     | string | Background/text color for the primary-styled cards.                          |
| `secondary_card_color` / `secondary_card_font_color` | string | Background/text color for the secondary-styled cards.                        |
| `counter_title`             | string | Title shown below the hotel logo.                                                                 |
| `arrow_direction`           | string | Direction of the arrow icon shown under `counter_title` — `up` / `down` / `left` / `right`.      |
| `room_01`..`room_05`        | string | Room name, e.g. "Master Room".                                                                    |
| `room_01_price`..`room_05_price` | string | Room price, e.g. "R$ 650,00".                                                              |
| `room_01_desc`..`room_05_desc`  | string | Room's highlighted amenity, e.g. "Wi-fi".                                                    |
| `exchange_card_title`       | string | Title of the currency exchange card.                                                              |
| `exchange_rate_usd`         | string | Displayed USD exchange rate value.                                                                |
| `exchange_rate_eur`         | string | Displayed EUR exchange rate value.                                                                |
| `city`                      | string | City name shown above the weather widget.                                                        |
| `latitude`, `longitude`     | string | Coordinates used to fetch the local weather. The weather widget is hidden entirely if either is unset. |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.
> New variable names should use `snake_case` (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's label from its key, and snake_case reads more naturally there.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**. The dev server builds the shared `@dsplay/*` libraries first, which a bare `npm start` inside this folder does not, and `npm install` run inside this folder only installs this template's own packages, not the repository tooling (Turborepo) that does that build.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-hotel-rates
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit it to try out different values — the DSPLAY Player App replaces it with real content at runtime.

## For developers

- The weather widget calls `https://api.dsplay.tv/weather/current` directly from the browser and caches the response in `localStorage` (see `src/components/weather/index.jsx`) — it isn't a `dsplay_template` variable.
- Layout is built with [Tailwind CSS](https://tailwindcss.com/) utility classes (`tailwind.config.js` / `postcss.config.js`), alongside this project's usual Sass files for the app-level shell (fade-in, screen-format classes).

## Packing (release build)

```sh
npm run zip -- --filter=./templates/hotel-rates   # from the repository root
```

`template.zip` is written to this folder (`templates/hotel-rates/template.zip`). The **Package templates** GitHub workflow builds it too (Actions tab, then download the artifact), so you can get it without a local build.

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

**Dependencies must always be pinned to an exact version** (never `^`, `~` or any other range). The repository's root [`.npmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.npmrc) sets `save-exact=true`, so `npm install <pkg>@<version>` pins automatically. It also disables dependency install scripts (`ignore-scripts=true`) and only accepts package versions published at least 3 days ago (`min-release-age=3`), to reduce supply chain risk. None of the current dependencies need a post-install build step; if one ever does, add a `setup` script to `package.json` (`npm install && npm rebuild <package>`) and document it here.

[Dependabot](https://github.com/dsplay/dsplay-templates/blob/main/.github/dependabot.yml) proposes updates weekly, waiting 3 days after a release (7 days for major versions) before opening a PR.

```sh
npm outdated                  # from the repository root: what has newer versions available
npm install <dependency>@<version> -w dsplay-template-hotel-rates   # bump a dependency of this template (stays pinned)
```

Since versions are pinned, `npm update` does nothing; bump each package explicitly (or merge Dependabot's PRs). For a major bump, verify `npm start -- --filter=dsplay-template-hotel-rates` and `npx turbo run build test --filter=dsplay-template-hotel-rates` (from the repository root) still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates

To work on this template together with the others (shared libraries, creating a new template from an existing one, releases), see the [repository README](https://github.com/dsplay/dsplay-templates/blob/main/README.md).
