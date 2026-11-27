![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Analog Clock (Neomorphism)

A React [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for an analog clock in neomorphic style. The screen is the clock: a rounded-rectangle face (elevated) with a carved dial (well); 12/3/6/9 on the middle of the sides, 3 numerals per side, hands that point at their mark. Wide and the thin bars use a compact square face plus the digital `HH:MM`. Spec: `.team/specs/analog-clock-neo.md` (geometry: `M-007-relogio-analogico.md`).

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `theme` | `light` \| `dark` | `light` | Tema / Theme / Tema. Legacy `background_theme` is read (`sky` becomes `dark`) |
| `clock_theme` | `default` \| `aluminum` | `default` | Estilo do relógio / Clock style / Estilo del reloj. Only `aluminum` means something; old `dark`/`light` values are ignored. **`aluminum` uses the operator's colors, not `theme`**: with `theme=dark&clock_theme=aluminum` and no `color_*` set, the face is the default white with `#111111` hands and seconds hand (by design; set `color_face`, `color_hands` and `color_second_hand` for a dark aluminum) |
| `background_color` | color | `#E4E9F0` / `#23272E` | Cor da base / Base color / Color de la base (screen and face share it) |
| `color_primary` | color | `#D94A22` (light) / `#E5562D` (dark) | Cor de destaque (segundeiro e pino). Under 3:1 against the base it falls back to the text color |
| `color_face`, `color_hands`, `color_second_hand` | color | `#FFFFFF` / `#111111` / `#111111` | Only with `aluminum`: the base of screen and face, hands and numerals, seconds hand and pin |
| `relief_strength` | `normal` \| `strong` | `normal` | Intensidade do relevo / Relief strength / Intensidad del relieve |
| `show_date` | bool | `true` | Mostrar data / Show date / Mostrar fecha |
| `show_numerals` | bool | `true` | Mostrar números (as marcas ficam) / Show numerals (ticks stay) |
| `show_seconds_hand` | bool | `true` | Ponteiro dos segundos / Seconds hand / Segundero |
| `clock_label` | text | empty | Rótulo (opcional) / Label (optional) / Etiqueta (opcional) |
| `time_zone` | text (IANA) | device | Fuso horário (opcional) / Time zone (optional) |
| `animation_enabled` | bool | `true` | Animações / Animations / Animaciones |

Read and ignored (not in the manifest): `background_image`, `background_image_portrait`, `background_overlay_opacity`, legacy `background`, `color_rim`. Remember to also register the variables as Template Vars (same name and type) in the DSPLAY CMS. 12 h clock follows the locale (`en_us`).

## Loading and entrance

No loading screen (`docs/entrance-style.md`): `Loader reveal` mounts the template hidden, waits for Roboto 400, then shows it with `dsplay-ready` on a wrapper. The entrance (`src/entrance.sass`) starts from that class: face and well fade, then the dial, the hands and the pin, then the label/date and the digital text; 300 ms each, 80 ms apart, 540 ms in total. Only `opacity` (and a `scale` pop on the pin), prefixed, on HTML boxes (the `<svg>` is wrapped, never animated; the hands' own `transform` is their rotation, so they only fade). `animation_enabled=false` skips it; `prefers-reduced-motion` too.

## Old WebViews (Chrome 44)

`browserslist` keeps `Chrome >= 45` (monorepo rule). `@vitejs/plugin-legacy` emits `polyfills-legacy` after Babel runs, so it kept arrow functions that the Chrome 44 WebView (Android 6 default) cannot parse; `vite.config.js` down-levels that one chunk (`legacyPolyfillsToChrome44`), and `sanity.test.js` parses every `*-legacy` chunk as ES5 with acorn.

## Local development

`npm install && npm start` (port 5183). `public/dsplay-data.js` turns any URL parameter into a template variable (`?theme=dark&clock_theme=aluminum&color_face=%238A8F99&time_zone=Asia/Tokyo&locale=en_US`). Resize the window to try each format.

## Packing

`npm run zip` builds and zips the output to `template.zip`.
