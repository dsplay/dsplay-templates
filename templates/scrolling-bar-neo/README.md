![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Scrolling Bar (v2, neumorphism)

A thin bar with a line of text rolling from right to left (RSS headlines, fixed texts, or both), plus the time, the weather, the feed's logo and the company logo. Same look and layout as the information bar without scrolling (`info-bar-v2`, M-014 v2): the only difference is the middle, where a single recessed capsule (the same box as the information bar's quotes) holds the rolling text.

## Features

- Rolling text in one recessed capsule; a copy of the content is repeated until it fills the box, and the loop has no jump. New content only enters at the end of a loop.
- Time (with the date from 70 px of height) and weather: same components as the information bar. The weather disappears with no coordinates or no answer.
- When the capsule would get under 56 rem these go, in this order: weather, time, feed circle, company logo (they come back at 60 rem). Never the capsule.
- Alternating mode (one item at a time, 8 s, crossfade) with `animation_enabled=false`, with no CSS animation support, and in the vertical bar.
- Plain-text rendering of feed text (never markup). No label chip.

## Supported screen formats

| Format | Design screen | Notes |
|---|---|---|
| Horizontal bar | 1920×52 (set A, 1 rem ≈ 4.33 px) and 1920×120 (set B) | one line, the screen is the surface |
| Wide, landscape, 4:3, 16:9 | 192 rem wide | 12 rem elevated panel, `layout_position` top/center/bottom (no photo) |
| Portrait, square | 108 rem wide | panel of 30 rem, two rows: time and weather, then the rolling capsule and the company logo |
| Vertical bar | 200×1920 | column, no horizontal rolling: one item at a time (up to 12 lines) |

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `ticker_source` | `text` \| `rss` \| `both` | `both` | Where the text comes from (text first when `both`). |
| `ticker_text` | text | empty | Fixed texts, separated by `\|`. |
| `rss_url` | text | empty | Feed address (read through the DSPLAY gateway `rss/last-news`, every 10 min; the last answer, up to 6 h old, is kept when the network fails). |
| `ticker_item_limit` | integer 1–30 | `8` | Maximum number of items (a headline over 100 characters is cut at a word; one copy never passes 600 characters). |
| `ticker_separator` | `dot` \| `bar` \| `diamond` | `dot` | Separator between items. |
| `logo` | image | empty | **Company logo** (legacy `sponsor_logo`): the tile at the right. Upload wins over `logo_url`; with neither, the standard DSPLAY logo (bundled, shows offline) on a white tile. |
| `logo_url` | text | empty | Company logo by public `http(s)` link (8 s timeout; a bad or slow link falls back to the DSPLAY logo, same size). Uploads work offline; links do not. |
| `show_logo` | boolean | `true` | Show the company logo block. |
| `rss_logo`, `rss_logo_url` | image, text | empty | Logo of the news feed: a small circle at the left of the rolling box. No default: without it the circle is not drawn. |
| `show_clock` | boolean | `true` | Time of the device. |
| `show_date` | boolean | `true` | Date (`dd/MM`, `MM/dd` for `en`), not shown on the thin bar. |
| `time_format` | `24h` \| `12h` | empty (`12h` only for `en_us`) | Time format. |
| `latitude`, `longitude` | text | empty | Coordinates for the weather (no coordinates: no weather). |
| `weather_unit` | `celsius` \| `fahrenheit` | `celsius` | Temperature unit. |
| `color_logo_background` | color | `#FFFFFF` | Background of the company logo tile (the DSPLAY default always stays on white). |
| `layout_position` | `top` \| `center` \| `bottom` | `center` | Panel position on full screens. |
| `widgets_order` | text | `clock,weather,ticker,company` | Order of the blocks (`news` is an alias of `ticker`, `sponsor` of `company`). |
| `theme` | `light` \| `dark` \| `custom` | `light` | Color preset; the two colors below only apply with `custom`. |
| `relief_strength` | `normal` \| `strong` | `normal` | Stronger relief for very bright TVs. |
| `color_text` | color | empty | Text color; replaced by black/white when it has less than 4.5:1 on the surface and on the shadow peaks. |
| `background_color` | color | empty | Surface color. |
| `rounded_corners` | boolean | `true` | Rounded corners. |
| `animation_enabled` | boolean | `true` | Rolling and entry animations (off: alternating mode). |
| `animation_speed` | `slow` \| `normal` \| `fast` | `normal` | 6 / 8 / 10 rem per second of the design screen (60/80/100 px/s on a 1920×120). |
| `debug` | boolean | `false` | Shows the set and the scale. |

Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npx npm@11.6.2 install
npm start        # http://localhost:5182
```

`public/dsplay-data.js` is the mock for local development only. Try scenarios by URL, e.g. `http://localhost:5182/?theme=dark&source=text&speed=fast` (the keys are listed at the top of that file). The window size picks the format.

> This folder is standalone: the `.npmrc` (`ignore-scripts`, `min-release-age`) must not be weakened.

## For developers

- Rolling text: `src/components/ticker` (DOM, measure, swap at the end of the loop), `src/util/ticker.js` (items, duration), `src/util/feed.js` (gateway).
- The capsule and the drop rule: `src/components/news`, `src/util/layout.js`.
- Time, weather, company logo, stage and theme: copied from `info-bar-v2` (`src/components/{clock,weather,company}`, `src/util/{stage,theme,weather,clock}.js`).
- Translations: `src/i18n.js`.

## Packing (release build)

```sh
npm run zip
```

## Maintaining dependencies

See `AGENTS.md`.
