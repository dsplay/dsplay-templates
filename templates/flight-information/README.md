![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Flight Information Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — shows a live arrivals/departures board for a given airport, fetched from the [aviation-edge.com](https://aviation-edge.com/) API.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Supported screen formats

| Landscape | Portrait | Square |
|-----------|----------|--------|
| ![Landscape](docs/screenshots/landscape.png) | ![Portrait](docs/screenshots/portrait.png) | ![Square](docs/screenshots/square.png) |

| Horizontal banner |
|--------------------|
| ![Horizontal Banner](docs/screenshots/h-banner.png) |

## Template variables

This template has no `dsplay_template` variables — instead, it's configured entirely through **custom `dsplay_media` parameters** (`src/hooks/use-flights-info.js`/`src/components/main/index.jsx` read them via `useMedia()`), since it's meant to be set up in the DSPLAY CMS as a JSON-service-backed media rather than a plain template:

| Key                      | Type   | Description                                                                              |
|--------------------------|--------|-------------------------------------------------------------------------------------------|
| `apiKey`                 | string | API key for [aviation-edge.com](https://aviation-edge.com/)'s flight timetable endpoint.  |
| `iataCode`               | string | IATA code of the airport to display (e.g. `GRU`, `JFK`).                                  |
| `arrivalDeparture`       | string | `"arrival"` or `"departure"` — which flight list to show.                                 |
| `offsetTimeMinutes`      | int    | Minutes in the past a flight can still be shown (filters out older flights).               |
| `maxPageDurationSeconds` | int    | Upper bound, in seconds, on how long each page of flights is displayed while paginating.   |

`duration` (the standard `dsplay_media` field) is also used, to split the total media duration evenly across pages of flights.

> Since these aren't `dsplay_template` variables, they aren't auto-detected by the CMS's template-variable manifest — configure them as custom media parameters when setting up this media source in the DSPLAY CMS instead.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**. The dev server builds the shared `@dsplay/*` libraries first, which a bare `npm start` inside this folder does not, and `npm install` run inside this folder only installs this template's own packages, not the repository tooling (Turborepo) that does that build.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-flight-information
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit `dsplay_media` to try out a different airport/API key — the DSPLAY Player App replaces it with real content at runtime.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/flight-information   # from the repository root
```

`template.zip` is written to this folder (`templates/flight-information/template.zip`). The **Package templates** GitHub workflow builds it too (Actions tab, then download the artifact), so you can get it without a local build.

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

**Dependencies must always be pinned to an exact version** (never `^`, `~` or any other range). The repository's root [`.npmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.npmrc) sets `save-exact=true`, so `npm install <pkg>@<version>` pins automatically. It also disables dependency install scripts (`ignore-scripts=true`) and only accepts package versions published at least 3 days ago (`min-release-age=3`), to reduce supply chain risk. None of the current dependencies need a post-install build step; if one ever does, add a `setup` script to `package.json` (`npm install && npm rebuild <package>`) and document it here.

[Dependabot](https://github.com/dsplay/dsplay-templates/blob/main/.github/dependabot.yml) proposes updates weekly, waiting 3 days after a release (7 days for major versions) before opening a PR.

```sh
npm outdated                  # from the repository root: what has newer versions available
npm install <dependency>@<version> -w dsplay-template-flight-information   # bump a dependency of this template (stays pinned)
```

Since versions are pinned, `npm update` does nothing; bump each package explicitly (or merge Dependabot's PRs). For a major bump, verify `npm start -- --filter=dsplay-template-flight-information` and `npx turbo run build test --filter=dsplay-template-flight-information` (from the repository root) still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates

To work on this template together with the others (shared libraries, creating a new template from an existing one, releases), see the [repository README](https://github.com/dsplay/dsplay-templates/blob/main/README.md).
