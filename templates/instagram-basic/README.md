![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Instagram Basic Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — rotates full-screen through a user's Instagram-style posts (photo/video + caption), with a QR code and timestamp overlay.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Supported screen formats

| Landscape | Portrait | Square |
|-----------|----------|--------|
| ![Landscape](docs/screenshots/landscape.png) | ![Portrait](docs/screenshots/portrait.png) | ![Square](docs/screenshots/square.png) |

| Horizontal banner | Vertical banner |
|--------------------|-------------------|
| ![Horizontal Banner](docs/screenshots/h-banner.png) | ![Vertical Banner](docs/screenshots/v-banner.png) |

## Template variables

| Key                       | Type    | Default                    | Description                                                                 |
|----------------------------|---------|-----------------------------|------------------------------------------------------------------------------|
| `bg_horizontal`            | string  |                             | Background image shown in landscape orientation.                            |
| `bg_vertical`              | string  |                             | Background image shown in portrait orientation.                             |
| `show_instagram_icon`     | boolean | `true`                     | Shows the Instagram logo.                                                    |
| `show_info`                | boolean | `true`                     | Shows the QR code + timestamp overlay and the top-corner logo placement.    |
| `primary_color`            | string  | `white`                    | Main text/background accent color.                                          |
| `secondary_color`          | string  | `rgb(240, 197, 231)`       | Accent color used as the fallback for several other `*_color` variables.    |
| `border_color`             | string  | `secondary_color`          | Border color around post media.                                             |
| `overlay`                  | string  |                             | Image overlaid on top of post media (e.g. a logo watermark).                |
| `overlay_position`         | string  | `top-left`                 | `top-left` / `top-right` / `bottom-left` / `bottom-right` / `center`.       |
| `hashtag_color`            | string  | `secondary_color`          | Color applied to `#hashtag` text in captions.                               |
| `link_color`               | string  | `#B9D0FF`                  | Color applied to URLs in captions.                                          |
| `mention_color`            | string  | `secondary_color`          | Color applied to `@mention` text in captions.                               |
| `phone_color`              | string  | `secondary_color`          | Color applied to phone numbers detected in captions.                        |
| `text_color`               | string  | `primary_color`            | Caption text color.                                                         |
| `user_full_name_color`     | string  | `primary_color`            | User display name color.                                                    |
| `user_screen_name_color`   | string  | `secondary_color`          | User `@handle` color.                                                       |
| `profile_picture`          | string  |                             | Overrides the account's Instagram profile picture when set.                 |
| `user_screen_name`         | string  |                             | Overrides the account's Instagram name when set.                            |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.
> New variable names should use `snake_case` (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's label from its key, and snake_case reads more naturally there.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**. The dev server builds the shared `@dsplay/*` libraries first, which a bare `npm start` inside this folder does not, and `npm install` run inside this folder only installs this template's own packages, not the repository tooling (Turborepo) that does that build.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-instagram-basic
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit it to try out different posts/users/colors — the DSPLAY Player App replaces it with real content at runtime.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/instagram-basic   # from the repository root
```

`template.zip` is written to this folder (`templates/instagram-basic/template.zip`). The **Package templates** GitHub workflow builds it too (Actions tab, then download the artifact), so you can get it without a local build.

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

**Dependencies must always be pinned to an exact version** (never `^`, `~` or any other range). The repository's root [`.npmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.npmrc) sets `save-exact=true`, so `npm install <pkg>@<version>` pins automatically. It also disables dependency install scripts (`ignore-scripts=true`) and only accepts package versions published at least 3 days ago (`min-release-age=3`), to reduce supply chain risk. None of the current dependencies need a post-install build step; if one ever does, add a `setup` script to `package.json` (`npm install && npm rebuild <package>`) and document it here.

[Dependabot](https://github.com/dsplay/dsplay-templates/blob/main/.github/dependabot.yml) proposes updates weekly, waiting 3 days after a release (7 days for major versions) before opening a PR.

```sh
npm outdated                  # from the repository root: what has newer versions available
npm install <dependency>@<version> -w dsplay-template-instagram-basic   # bump a dependency of this template (stays pinned)
```

Since versions are pinned, `npm update` does nothing; bump each package explicitly (or merge Dependabot's PRs). For a major bump, verify `npm start -- --filter=dsplay-template-instagram-basic` and `npx turbo run build test --filter=dsplay-template-instagram-basic` (from the repository root) still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates

To work on this template together with the others (shared libraries, creating a new template from an existing one, releases), see the [repository README](https://github.com/dsplay/dsplay-templates/blob/main/README.md).
