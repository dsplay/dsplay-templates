![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Meeting Room (Neomorphism)

A React [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) **meeting room / event** media type, in neomorphic style: one smooth base color, a place card and two logo tiles in relief, a status chip (the only color outside the base is the green "in progress") and a thin accent marker beside the event name and date. Spec: `.team/specs/meeting-room-neo.md`.

## Supported screen formats

| Format | Screenshot |
|---|---|
| Landscape 1920x1080 (also 16:9, 4:3, 4K) | `docs/screenshots/landscape.png` |
| Portrait 1080x1920 | `docs/screenshots/portrait.png` |
| Square 1080x1080 | `docs/screenshots/square.png` |
| Wide 1920x480 | `docs/screenshots/wide.png` |
| H bar 1920x52 / 1920x120 (one line, no logos) | `docs/screenshots/h-bar.png`, `docs/states/h120.png` |
| V bar 200x1920 | `docs/screenshots/v-bar.png` |

Other sizes use the closest ratio. More states (dark, ended, long names, no logos, legacy colors, 12 h) are in `docs/states/`.

## Media data

`eventName`, `location`, `startDate`, `endDate` come from the media. The status chip: more than 24 h before the start there is none; up to 24 h "Today / Tomorrow, hh:mm"; during the event "In progress · until hh:mm" (green); afterwards "Ended" (and the name at 70%).

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `event_logo` | image | empty | Event logo (tile; omitted when empty or when the image fails). Legacy: `eventLogo`. |
| `host_logo` | image | empty | Host logo (tile; omitted when empty or broken). Legacy: `hostLogo`. |
| `theme` | `light` \| `dark` | `light` | Preset: base `#E4E9F0` / `#23272E`. |
| `background_color` | color | preset base | Base color of the whole screen (relief is derived from it). |
| `color_primary` | color | `#1F5FA3` / `#6DB3F2` | Accent: the marker and the chip ring. Used only if it has 4.5:1 on the base, otherwise the text color. Legacy: `mainColor`. |
| `color_text` | color | `#151618` / `#F2F4F8` | Text color (kept only if readable on the base). |
| `color_logo_card` | color | `#FFFFFF` | Background of the logo tiles. Legacy: `rightColorTop`. |
| `relief_strength` | `normal` \| `strong` | `normal` | Size of the relief. |
| `show_status` | boolean | `true` | Show the status chip. |
| `time_format` | `24h` \| `12h` | `24h` (`12h` for `en_us`) | Time format. |
| `animation_enabled` | boolean | `true` | Entrance animation and chip crossfade. |

### Migrating from `meeting-room`

- **`mainColor` is now the accent, not the background.** A customer with a blue background sees a light screen with a blue marker. To keep a colored screen set `background_color` (the relief then follows that color).
- `rightColorTop` (host panel color) becomes the background of the logo tiles. Old keys are read when the new one is empty (new > legacy > default).
- Read and ignored (no error): `rightColorBottom` / `color_location_panel`, `color_host_panel`, `background_image*`, `background_overlay_*`.

Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

`npm install && npm start` (port 5181). Mock data in `public/dsplay-data.js`, scenarios by URL: `?when=live|soon|tomorrow|ended|future&days=3&end=0&name=long|xl&place=long|none&logos=none|event|host&badlogo=1&locale=en_US&theme=dark&background_color=%23777777`, plus any template variable.

## For developers

- Layout of every format (rects in rem): `src/util/layout.js`; scale: `src/util/stage.js`; text fitting without DOM measuring: `src/util/fit.js`.
- Date, status and chip text: `src/utils/` (no `Intl`: months and weekdays go through `t()`).
- Translations: `src/i18n.js` (en, pt, es, it, de, nl).
- Loading: no loader screen. `Loader reveal` (fonts and logos listed in `src/components/app`) shows the template when ready; the blocks rise in from `.dsplay-ready` (`src/style.sass`, about 580 ms, off under reduced motion).
- The legacy `polyfills-legacy` chunk is lowered to ES5 by `es5PolyfillsChunk` in `vite.config.js` (Chrome 44); `src/sanity.test.js` parses the legacy chunks as ES5 after a build.

## Packing (release build)

`npm run zip` builds and writes `template.zip` for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Maintaining dependencies

See `AGENTS.md`.
