![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - RSS (v2, neumorphism)

Shows one news item of an RSS feed per showing: a full-width cover photo with the headline, and white cards with the description and a QR code to read more. New version of the RSS template, flat (no shadows; cards are separated by a thin border), light and dark themes. It does not replace `templates/rss`.

## Features

- **`hero`** (default): the item's photo covers the whole top, bleeding to the edges, under a 55% veil with the headline over it; two opaque white cards rise 6 rem over it: description and QR code.
- **`cards`**: the same cover plus up to 3 cards (current item and the next ones, with thumbnails). Needs the DSPLAY gateway body (`media.result.data.items`); without it the template falls back to `hero`.
- Date and time from the device clock (our own pt/en/es day and month tables, no `Intl`).
- Plain-text rendering of feed text (HTML entities and tags are removed, never injected).
- Old UOLIndoor apps (< 40100, no `platform`) keep the title/description swap.

## Supported screen formats

Each format has a design screen in rem (1 rem = 10 px on it); the root `font-size` follows the window.

| Format | Design screen | Notes |
|---|---|---|
| Landscape | 192 × 108 rem (1920×1080) | `hero` and `cards` |
| Portrait | 108 × 192 rem (1080×1920) | `hero` and `cards` (cards stacked) |
| Square | 108 × 108 rem (1080×1080) | `hero` without description; `cards` with 2 cards |
| Wide | 192 × 48 rem (1920×480) | always `hero`, photo on the left |
| Horizontal bar | 12 rem tall, scaled by height: 1 rem = height / 12 (1920×52 → 4.33 px, 1920×120 → 10 px) | one flat line: feed circle, category, headline, company logo tile at the far right; no photo |
| Vertical bar | 20 rem wide, scaled by width (200 px = 20 rem) | column: logo, category, headline, QR code |

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `layout_variant` | `hero` \| `cards` | `hero` | Layout. |
| `show_clock` | boolean | `true` | Date and time of the device. |
| `clock_format` | `24h` \| `12h` | `24h` | Time format. |
| `show_category` | boolean | `true` | First category (or the media title) as a pill. |
| `show_description` | boolean | `true` | Description in the card. |
| `show_qr_code` | boolean | `true` | QR code with the item link. |
| `logo` | image | empty | Company logo (upload; wins over `logo_url`). Legacy: `sponsor_logo`. Without logo or link (or if both fail) the tile shows the standard DSPLAY logo bundled with the template. |
| `logo_url` | text | empty | Company logo by public image link (`http(s)` only, no credentials, 8 s timeout, tried when the upload is absent or fails). Prefer the upload: it works offline. |
| `show_logo` | boolean | `true` | Show the company logo tile. |
| `rss_logo` | image | empty | Logo of the feed (source of the news): a small circle next to the category (hero) or at the left of the bar. Wins over `rss_logo_url`. No default: without logo the circle is not shown. |
| `rss_logo_url` | text | empty | Feed logo by public image link (same rules as `logo_url`). |
| `theme` | `light` \| `dark` \| `custom` | empty = `light` (or `custom` when any color below is set) | Color preset. Colors below only apply with `custom`. |
| `color_primary` | color | empty (`#1F5FA3` light, `#6DB3F2` dark) | Accent. Legacy: `title_bg_color`. |
| `color_logo_background` | color | `#FFFFFF` | Background tile of the logo over the photo. Legacy: `logo_bg_color`. |
| `color_text` | color | empty | Text color; falls back to black/white when it has less than 4.5:1 against the surface. Legacy: `text_color`. |
| `background_color` | color | empty (`#EEF1F5` light, `#15181D` dark) | Base color (behind the cards). Legacy: `bg_color`, `text_bg_color`. |
| `background_image` | image | empty | Default photo of the cover, used when the item has none. Legacy: `bg`. |
| `background_image_portrait` | image | empty | Same, for portrait and square. |
| `background_overlay_opacity` | integer 0–100 | `55` | Veil over the photo. Below 54, white text on a pure white photo drops under 4.5:1. |
| `photo_fit` | `auto` \| `cover` \| `contain` | `auto` | CMS label: **Enquadramento da foto / Photo framing / Encuadre de la foto**; options: Automático / Preencher / Inteira com fundo desfocado (`auto` / `cover` / `contain`). Help: "Use 'Inteira com fundo desfocado' em feeds que publicam colagens de fotos; no modo Automático, fotos 3:2, inclusive colagens, saem cortadas." / "Use 'Whole photo with blurred background' for feeds that publish photo collages; in Automatic mode, 3:2 photos, collages included, are cropped." / "Use 'Entera con fondo desenfocado' en feeds que publican collages de fotos; en modo Automático, las fotos 3:2, incluidos los collages, se recortan." |
| `rounded_corners` | boolean | `true` | Rounded corners. |
| `next_label` | text | empty (`Up next`, translated) | Label of the next cards. |
| `animation_enabled` | boolean | `true` | Entry animations (opacity/transform only). |
| `debug` | boolean | `false` | Reserved. |

Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npm install
npm start
```

`public/dsplay-data.js` is the mock for local development only. Try scenarios by URL, e.g. `http://localhost:3000/?layout=cards&theme=dark&headline=140&items=4` (the keys are listed at the top of that file). Test photos and logo are in `public/test-assets` (local files, not shipped).

> This folder is standalone: `npm install` needs a recent npm (the one bundled with older Node 22 can crash without a lockfile; `npx npm@11 install` works). The `.npmrc` (`ignore-scripts`, `min-release-age`) must not be weakened.

## For developers

- Theme: `src/util/theme.js` (palettes and contrast checks).
- Layout rectangles per format: `src/util/geometry.js`.
- Which item(s) a showing displays: `src/util/news.js`, `src/util/rss-item.js`.
- Translations: `src/i18n.js`.

## Packing (release build)

```sh
npm run zip
```

## Maintaining dependencies

See `AGENTS.md`.
