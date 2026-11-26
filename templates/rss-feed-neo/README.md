![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - RSS Feed (3 news, different hierarchies)

Shows three news of an RSS feed at once, with different weight: the lead (large photo, title, description and a QR code), a secondary one (medium photo) and a tertiary one (text only), with the company logo, the date and the time in a footer. Flat design (no shadows), light and dark themes. It is a separate template from the RSS v2 (one news per showing).

## Features

- Roles rotate on every showing: lead = item `i`, secondary = `i+1`, tertiary = `i+2` (circular); every item is the lead once per cycle.
- Photos fill their frame with `cover`; when the photo does not look like the frame, the whole photo is shown over a blurred copy of itself (`photo_fit`).
- With 2 or 1 items, without photo, description, link or category, the layout drops pieces in the order of the spec (M-001b section 3).
- Feed texts are plain text; credits and captions glued at the start of a description are removed, and a description that repeats the headline is dropped.

## Supported screen formats

| Format | Design screen | Notes |
|---|---|---|
| Landscape (and any window wider/taller than 16:9) | 192 × 108 rem | lead + right column, footer; the extra width/height goes to the photos |
| Portrait | 108 × 192 rem | stacked; the room left is spread between the blocks |
| Square | 108 × 108 rem | the lead reduced (no QR), the other two as short lines |
| Wide | 192 × 48 rem | only the lead; QR and company logo at the right |
| Horizontal bar | 12 rem tall (1920×52, 1920×120) | minimum layout: feed circle, category chip, headline, company tile |
| Vertical bar | 20 × 192 rem | minimum layout: circle, chip, headline, QR, company tile |

## Template variables

| Key | Type | Default | Description |
|---|---|---|---|
| `show_clock` | boolean | `true` | Date and time of the device (footer). |
| `clock_format` | `24h` \| `12h` | `24h` | Time format. |
| `show_category` | boolean | `true` | Category chip/label (hidden when it is the feed name or the same in every item). |
| `show_description` | boolean | `true` | Descriptions. |
| `show_qr_code` | boolean | `true` | QR code of the lead (not in the square). |
| `logo` | image | empty | **Company logo** (legacy `sponsor_logo`), tile of the footer. Upload wins over `logo_url`; with neither, the standard DSPLAY logo (bundled, shows offline) on white. |
| `logo_url` | text | empty | Company logo by public `http(s)` link (8 s; a bad link falls back to the DSPLAY logo). Uploads work offline; links do not. |
| `show_logo` | boolean | `true` | Show the company logo tile. |
| `rss_logo`, `rss_logo_url` | image, text | empty | Logo of the feed: a small circle before the lead's category. No default: without it the circle is not drawn. |
| `photo_fit` | `auto` \| `cover` \| `contain` | `auto` | Photo framing: Automatic / Fill / Whole photo over a blurred background (use it for feeds that publish collages). |
| `theme` | `light` \| `dark` \| `custom` | empty = `light` (or `custom` when a color below is set) | Color preset. |
| `color_primary` | color | empty | Accent (chip, marker). Legacy: `title_bg_color`. |
| `color_text` | color | empty | Text color (replaced by black/white below 4.5:1). Legacy: `text_color`. |
| `background_color` | color | empty | Base color. Legacy: `bg_color`, `text_bg_color`. |
| `color_logo_background` | color | `#FFFFFF` | Background of the company logo tile (the DSPLAY logo always stays on white). |
| `background_image` | image | empty | Default photo for a lead without image. Legacy: `bg`. |
| `background_image_portrait` | image | empty | Same, for portrait and square. |
| `rounded_corners` | boolean | `true` | Rounded corners. |
| `animation_enabled` | boolean | `true` | Fades (opacity only). |
| `debug` | boolean | `false` | Reserved. |

Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npx npm@11.6.2 install
npm start        # http://localhost:5184
```

`public/dsplay-data.js` is the mock for local development only (the keys are listed at its top): `?feed=real&iteration=3` uses a real feed saved by `npm run feed` (G1 by default; `npm run feed -- <url> 40 <file>` saves another one), `items=`, `image=`, `logo=1` (test upload), `logourl=`, `rsslogo=1`, `fit=cover|contain`, `theme=dark`. The window size picks the format.

> This folder is standalone: the `.npmrc` (`ignore-scripts`, `min-release-age`) must not be weakened.

## For developers

- Layouts per format: `src/components/{landscape,portrait,square,wide,bar-h,bar-v}`; the stories and their rotation: `src/util/feed.js`.
- Text fitting (never below the floor of each level): `src/util/fit.js`, `src/util/headline-size.js`.
- Description/category cleaning: `src/util/description.js`, `src/util/story-text.js`, `src/util/news.js`.
- Photo framing and blur: `src/components/photo`, `src/util/photo-fit.js`; logos: `src/hooks/use-logo.js`, `src/components/{company-tile,feed-logo}`.
- Translations: `src/i18n.js`.

## Packing (release build)

```sh
npm run zip
```

## Maintaining dependencies

See `AGENTS.md`.
