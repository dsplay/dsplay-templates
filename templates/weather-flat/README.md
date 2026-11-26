![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Weather (flat)

Weather forecast for old devices (Android 6 / Chrome 45): flat colors, thin borders, no shadows, no filters, no photo. Only the `now` card (and the bars) takes the color of the weather family (clear, clouds, rain, snow, mist; day or night by the sun); the rest is neutral. The forecast is always five days. Standalone folder: `npm install` needs a recent npm (`npx npm@11 install`).

## Supported screen formats

| Format | Design screen | Notes |
|---|---|---|
| Landscape | 192 × 108 rem | `now`, 3 detail cards, 5 forecast rows |
| Portrait | 108 × 192 rem | `now`, 3 detail cards, 5 forecast columns |
| Square | 108 × 108 rem | `now` (with a humidity/wind line), 5 columns |
| Wide | 192 × 48 rem | `now` on the left, 5 columns, logo on the right |
| Horizontal bar | 12 rem tall, scaled by height (1 rem = height / 12) | one line, 5 days inline (compact in a 120 px bar) |
| Vertical bar | 20 rem wide, scaled by width | column with 5 stacked days |

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `unit` | `celsius` \| `fahrenheit` | `celsius` | Temperature unit (**Unidade de temperatura / Temperature unit / Unidad de temperatura**). |
| `wind_unit` | `kmh` \| `ms` | `kmh` | Wind unit (**Unidade do vento / Wind unit / Unidad del viento**; options km/h \| m/s). The service sends m/s: `kmh` = m/s × 3.6, integer; `ms` = m/s with one decimal. Independent of `unit`; no mph. |
| `show_city` | boolean | `true` | Show the city. |
| `show_description` | boolean | `true` | Show the condition text. |
| `show_min_max` | boolean | `true` | Show today's min and max. |
| `show_details` | boolean | `true` | Show humidity, wind and sun. |
| `theme` | `light` \| `dark` \| `custom` | empty = `light` (`custom` if a color below is set) | Color preset. |
| `color_primary` | color | `#1F5FA3` / `#6DB3F2` | Accent (today's pill, `weather_background=solid`). |
| `color_text` | color | theme | Text color (only `custom`). |
| `background_color` | color | `#EEF1F5` / `#15181D` | Base color. |
| `weather_background` | `auto` \| `solid` | `auto` | `auto`: `now` and bars take the weather family color; `solid`: `color_primary`. |
| `logo` | image | empty | Company logo (upload; wins over `logo_url`; legacy `sponsor_logo`). Without logo or link the standard DSPLAY logo shows. |
| `logo_url` | text | empty | Company logo by public image link (`http(s)` only, 8 s timeout). Prefer the upload: it works offline. |
| `show_logo` | boolean | `true` | Show the company logo tile. |
| `color_logo_background` | color | `#FFFFFF` | Tile of the logo (the DSPLAY logo always sits on white). |
| `rounded_corners` | boolean | `true` | Rounded corners. |
| `animation_enabled` | boolean | `true` | Fade-in (opacity only). |
| `debug` | boolean | `false` | Reserved. |

`background_image`, `background_image_portrait` and `background_overlay_opacity` do not exist in this flat style. Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npm install
npm start      # http://localhost:5187
```

`public/dsplay-data.js` is the dev mock; scenarios by URL (keys listed at its top): `?code=500&night=1&unit=fahrenheit&wind=ms&days=3&theme=dark`, `?result=none`, `?outdated=1`, `?logo=1`, `?showlogo=0`...

## Packing (release build)

```sh
npm run zip
```
