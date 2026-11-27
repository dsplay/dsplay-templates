![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - World Clocks Analog (Neomorphism)

A React [HTML-based template](https://developers.dsplay.tv/docs/html-templates) with up to 8 analog clocks for cities around the world, in neomorphic style: round elevated discs on one base color, a carved well under the dial (only when the disc is big enough), the world map flat on the base (black on the light theme, a quiet lighter tone on the dark one; no frame, no shadow), the company logo on an elevated tile. Up to 4 clocks per page; with more cities the pages turn by themselves with a cross-fade. Specs: `.team/specs/world-clocks-analog-neo.md` (base: `M-011-horario-mundial-analogico.md`).

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `city_01` … `city_08` | text | `city_01` = `Local` | Cidade 1…8 / City 1…8 / Ciudad 1…8. The first empty slot is `Local` (the device time); an unknown name shows the local time with the typed name. Legacy `city_1` … `city_8` are read. **Read dynamically: the manifest scanner does not list them** |
| `time_format` | `24h` \| `12h` | `24h` (`12h` with locale `en_us`) | Formato da hora / Time format / Formato de hora |
| `show_day_offset` | bool | `true` | Indicar outro dia / Show other-day marker (`+1 dia`, `-1 dia`) |
| `theme` | `light` \| `dark` | `light` | Tema / Theme / Tema. `sky` (removed) is read as `dark` |
| `background_color` | color | `#E4E9F0` / `#23272E` | Cor da base / Base color / Color de la base: the screen, the discs and the wells share it; shadows are derived from it |
| `color_primary` | color | `#D94A22` (light) / `#E5562D` (dark) | Cor de destaque (seconds hand, pin). Under 3:1 against the base it falls back to the text color |
| `relief_strength` | `normal` \| `strong` | `normal` | Intensidade do relevo / Relief strength / Intensidad del relieve |
| `logo`, `logo_url`, `color_logo_background`, `show_logo` | image / text / color / bool | DSPLAY logo / empty / `#FFFFFF` / `true` | Company logo: upload, then public `http(s)` link, then the bundled DSPLAY logo (always on a light tile). Legacy `brand` is read |
| `zones_per_page` | int 1–4 | `4` | Fusos por página (anything else: 4) |
| `page_interval` | int 10–120 (s) | `30` | Intervalo da troca (below 10: 10; above 120: 120; not a number: 30) |
| `show_page_indicator` | bool | `true` | Mostrar indicador de página (only with more than one page) |
| `show_map` | bool | `true` | Mapa-múndi / World map (never on the bars) |
| `animation_enabled` | bool | `true` | Animações / Animations / Animaciones (off: instant page turn, no entrance) |

Read and ignored (not in the manifest): `background_image`, `background_image_portrait`, `background_overlay_opacity`, legacy `background`, `clock_theme` (the theme decides the surface). Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Layout

Landscape / portrait / square: logo on top, world map in the middle, clocks at the bottom. The dial well (D ≥ 36 rem) exists for landscape 1–2 clocks, portrait 1–4 and square 1; the map is flat on the base (no well) at up to 70%, behind the clocks when it would be under 40% or on the wide format. Wide 1920×480: one row of discs over a flat map, no logo. Bar H 1920×52: flat cells, no relief. Bar V 200×1920: up to 4 elevated discs. During the 800 ms cross-fade the page that is leaving loses its shadows, so the screen never has more than 10 shadowed elements (the map has none: at most 9 in portrait n=4).

## Loading and entrance

No loading screen (`docs/entrance-style.md`): `Loader reveal` mounts the template hidden, waits for Roboto 400, then shows it with `dsplay-ready` on a wrapper. The entrance (`src/entrance.sass`) plays once on the first page: logo and map, then discs and wells, then dials and hands, then names and hours; 300 ms each, 540 ms in total; only `opacity` (and a `scale` pop on the pin), prefixed, never on the `<svg>` nor on the hands' `transform`. `animation_enabled=false` skips it; `prefers-reduced-motion` too.

## Old WebViews (Chrome 44)

`browserslist` keeps `Chrome >= 45` (monorepo rule). `@vitejs/plugin-legacy` emits `polyfills-legacy` after Babel runs, so it kept arrow functions that the Chrome 44 WebView cannot parse; `vite.config.js` down-levels that one chunk (`legacyPolyfillsToChrome44`) and `sanity.test.js` parses every `*-legacy` chunk as ES5 with acorn.

## Local development

`npm install && npm start` (port 5183). `public/dsplay-data.js` turns any URL parameter into a template variable: `?n=4` (first n cities of the default list), `?zones_per_page=2&page_interval=10`, `?theme=dark`, `?show_map=false`, `?city_03=Tokyo`, `?locale=en_US`. Resize the window to try each format.

## Map

The world map is the single-path SVG `mapa-mundi-vetor-leve-20261110.svg` (19 KB, no `<image>`/filter) supplied by DSPLAY; origin and licence confirmed by the product owner on 2026-11-10; Antarctica is not drawn.

## Packing

`npm run zip` builds and zips the output to `template.zip`.
