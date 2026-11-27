![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Wi-Fi Access (Neomorphism)

A React [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) **Wi-Fi access** media type, in neomorphic style: one smooth base color, an elevated card, a notched Wi-Fi "visor", the network name and the password in notched wells, a white elevated QR tile and the company logo tile. Spec: `.team/specs/qrcode-wifi-neo.md`.

## Supported screen formats

| Format | Screenshot |
|---|---|
| Landscape 1920x1080 (also 16:9, 4:3, 4K) | `docs/screenshots/landscape.png` |
| Portrait 1080x1920 | `docs/screenshots/portrait.png` |
| Square 1080x1080 | `docs/screenshots/square.png` |
| Wide 1920x480 | `docs/screenshots/wide.png` |
| H bar 1920x52 (flat, no QR: it cannot be scanned) | `docs/screenshots/h-bar.png` |
| V bar 200x1920 (QR of 140 px: scan from up close) | `docs/screenshots/v-bar.png` |

Other sizes fall into the layout of the closest ratio and scale with `min(W/refW, H/refH)`. States (no network, open, hidden, long text, dark theme, custom bases): `docs/states/`.

## Media data (unchanged)

`ssid`, `auth_type` (`none` \| `wpa` \| `wpa2` \| `sae` \| `wep`), `password`, `hidden`. The QR holds the standard `WIFI:T:<auth>;S:<ssid>;P:<password>;H:true;;` string, with `\ ; , : "` escaped.

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `theme` | `light` \| `dark` | `light` | Tema / Theme / Tema |
| `background_color` | color | `#E4E9F0` (`light`) / `#23272E` (`dark`) | Cor da base / Base color / Color de la base. Every surface has this color; the shadows are derived from it |
| `color_primary` | color | `#1F5FA3` / `#6DB3F2` | Cor de destaque / Accent color / Color de acento (marker and badge icon; the icon uses the text color when the accent has less than 4.5:1 on the base) |
| `relief_strength` | `normal` \| `strong` | `normal` | Intensidade do relevo / Relief strength / Intensidad del relieve |
| `show_network_name` | bool | `true` | Mostrar nome da rede |
| `show_password` | bool | `true` | Mostrar senha |
| `show_wifi_badge` | bool | `true` | Mostrar selo do Wi-Fi |
| `logo`, `logo_url`, `color_logo_background`, `show_logo` | image / text / bool / color | DSPLAY logo on a white tile | Company logo: upload, then public `http(s)` link (8 s limit), then the bundled DSPLAY logo. `show_logo=false` hides the tile. Legacy `sponsor_logo` is read |
| `qr_code_logo`, `qr_code_logo_background_transparent`, `qr_code_foreground_color`, `qr_code_background_color`, `qr_code_quiet_zone_color`, `qr_code_dot_scale`, `qr_code_dot_scale_timing` | as before | as before | QR appearance (names unchanged) |
| `animation_enabled` | bool | `true` | Animations: only a 600 ms fade of the content (never the shadows) |

### Read and ignored (legacy)

`color_top` and `color_bottom` are still sent by existing media but **ignored**: the two-block design is gone (use `background_color` and `color_primary`). `background_image*` and `background_overlay_*` are not offered: neomorphism needs a smooth surface.

Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

`npm install && npm start` (port 5181). `public/dsplay-data.js` builds the mock media from URL parameters: `?auth=none`, `?hidden=1`, `?empty=1` (no ssid), `?long=1`, `?special=1` (`; , : \ "` in the name and password), `?locale=en_US`, plus any template variable (`theme=dark`, `background_color=%23777777`, `relief_strength=strong`, `show_logo=false`, `logo_url=...`).

## For developers

- Geometry of every format (rem of the design screen): `src/util/layout.js`; format detection and scale: `src/util/stage.js`; text fitting: `src/util/fit.js`.
- Colors, shadows and contrast: `src/util/theme.js` (tokens in `.team/specs/tokens-neomorfismo.md`).
- Translations: `src/i18n.js`. Loading: no loader screen. `Loader reveal` (fonts and images listed in `src/components/app`) shows the template when ready, and the blocks rise in from `.dsplay-ready` (`src/style.sass`, up to ~580 ms, off under reduced motion). `npm run zip` builds `template.zip`. The legacy polyfills chunk is lowered to ES5 by `es5PolyfillsChunk` in `vite.config.js` (Chrome 44).

## Packing

`npm run zip` builds and zips the output to `template.zip`.
