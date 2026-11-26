![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Weather (Neomorphism)

A React [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) **Weather Forecast** media type, in neomorphic style: one surface whose tint follows the weather, an elevated `now` card, a notched icon "visor", notched detail wells and one elevated forecast card (always 5 days where the format holds them). Specs: `.team/specs/weather-base.md` and `weather-neo.md`.

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `unit` | `celsius` \| `fahrenheit` | `celsius` | Temperature unit. Unidade de temperatura / Temperature unit / Unidad de temperatura |
| `wind_unit` | `kmh` \| `ms` | `kmh` | Wind unit, independent of `unit`: km/h = m/s × 3.6 (integer); m/s with one decimal. Unidade do vento / Wind unit / Unidad del viento |
| `show_city`, `show_description`, `show_min_max`, `show_details` | bool | `true` | What the `now` card shows. Mostrar cidade, descrição, mínima e máxima, umidade/vento/sol |
| `theme` | `light` \| `dark` \| `custom` | `light` | Tema / Theme / Tema |
| `relief_strength` | `normal` \| `strong` | `normal` | Intensidade do relevo / Relief strength / Intensidad del relieve |
| `color_primary`, `color_text`, `background_color` | color | by theme | Only used with theme `custom` |
| `weather_background` | `auto` \| `solid` | `auto` | `auto`: tint of the base color per weather family, day/night by the sun; `solid`: `background_color` |
| `logo`, `logo_url`, `show_logo`, `color_logo_background` | image / text / bool / color | DSPLAY logo | Company logo: upload, then public `http(s)` link, then the bundled DSPLAY logo (always on a white tile). Legacy `sponsor_logo` is read |
| `animation_enabled` | bool | `true` | Animations / Animações |
| `debug` | bool | `false` | Advanced |

`background_image`, `background_image_portrait` and `background_overlay_opacity` are ignored (no photo in neomorphism). Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

`npx npm@11.6.2 install && npm start` (port 5185). `public/dsplay-data.js` builds the mock media from URL parameters:
`?code=500&night=1&days=5&empty=1&outdated=1&locale=en_US&city=...` plus any template variable (`theme=dark`, `unit=fahrenheit`, `wind_unit=ms`, `show_logo=false`, `logo_url=...`).

## Packing

`npm run zip` builds and zips the output to `template.zip`.
