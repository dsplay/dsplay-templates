![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Twitter Basic Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — cycles through a Twitter/X user's recent posts, one at a time, with a QR code linking back to each post.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`).

## Supported screen formats

| Landscape | Portrait |
|-----------|----------|
| ![Landscape](docs/screenshots/landscape.png) | ![Portrait](docs/screenshots/portrait.png) |

| Horizontal banner | Vertical banner |
|--------------------|-------------------|
| ![Horizontal Banner](docs/screenshots/h-banner.png) | ![Vertical Banner](docs/screenshots/v-banner.png) |

> Square is omitted: at a 1:1 aspect ratio the browser's `orientation: portrait` media query engages (matching whenever height >= width), but the info/QR footer box keeps its `rem`-based fixed height while the post text area above it is sized as a percentage of the (now much taller) content box — the two overlap by over 150px, confirmed via `getBoundingClientRect()` (text-wrapper bottom at y≈1660 vs. info-box top at y≈1504 in a 1920×1920 frame).

## Template variables

| Key                       | Type   | Default     | Description                                                              |
|----------------------------|--------|-------------|-----------------------------------------------------------------------------|
| `bg_horizontal`           | string |             | Background image shown in landscape orientation.                        |
| `bg_vertical`             | string |             | Background image shown in portrait orientation.                          |
| `show_twitter_icon`       | boolean | `true`     | Shows the Twitter/X logo in the top-right corner.                        |
| `twitter_icon_color`      | string | `secondary_color` | Color of the Twitter/X logo.                                       |
| `primary_color`           | string | `white`     | Main text color.                                                          |
| `secondary_color`         | string | `#B9D0FF`   | Accent color used as the fallback for several other `*_color` variables. |
| `user_full_name_color`    | string | `primary_color` | User display name color.                                             |
| `user_screen_name_color`  | string | `secondary_color` | User `@handle` color.                                              |
| `text_color`              | string | `primary_color` | Post text color.                                                     |
| `hashtag_color`           | string | `#FFFF99`   | Color applied to `#hashtag` text in post captions.                       |
| `mention_color`           | string | `#FFFF99`   | Color applied to `@mention` text in post captions.                       |
| `link_color`              | string | `#B9D0FF`   | Color applied to URLs in post captions.                                   |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npm install
npm start
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit it to try out different values — the DSPLAY Player App replaces it with real content at runtime.

## Packing (release build)

```sh
npm run zip
```

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

Regular npm dependencies, not vendored files:

```sh
npm outdated
npm update
```

For a version outside the declared range (typically a major bump), apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
