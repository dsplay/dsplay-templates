![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Currency Quotes Templates

Three [React](https://reactjs.org/) [HTML-based templates](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform, all for the **Currency quotes** media type. One package, one set of logic, three layouts: each style is built into its own zip and becomes its own system template in the CMS.

It fetches nothing and holds no key: DSPLAY's player gateway answers the media with the `currency-quotes/1` document, the player hands it to the template as `media.result` and the template only draws it.

> **Prototype.** The gateway service that produces `currency-quotes/1` does not exist yet (it is the next step of the Currency quotes media type); until it does, these templates run on the example data of `public/dsplay-data.js`.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+. Only players that speak the gateway protocol play this media type.

## The answer (`currency-quotes/1`)

```jsonc
{
  "schema": "currency-quotes/1",
  "base": "BRL", "baseName": "Real", "date": "2026-11-20",
  "mode": "price",      // "price": 1 unit of the item is worth `price` of the base (1 BTC = 366,334.51 BRL)
                        // "inverse": 1 unit of the base is worth `price` of the item (1 BRL = 0.0000027 BTC)
  "period": "30d",      // the chart: "none" | "7d" | "30d"
  "decimals": "auto",   // "auto" or a whole number from 0 to 8
  "items": [            // 1 to 12
    { "code": "BTC", "name": "Bitcoin", "kind": "crypto", // "fiat" | "crypto"
      "price": 366334.51, "changePct": 2.84,              // change of the day, in percent (null when unknown)
      "series": [/* the price over the period, oldest first, 7 or 30 numbers */] }
  ]
}
```

An item with no code or no positive price is dropped; more than 12 are cut. An answer with nothing usable (or no answer at all, as an old player sends) shows one centered message.

### What the colors mean

By default the color is the direction **of the price of the currency shown**: a rise is green, a fall is red (the convention of the markets: a pair that goes up is green). The template variable **`base_perspective`** (off by default) reads the colors from the **base's point of view**: when a currency falls the base gains, so a fall is green and a rise is red. The arrows never change: they always show the real direction of the price (▲ the currency costs more in the base). The `mode: "inverse"` of the answer ("1 BRL = x USD") is another thing: it states the prices the other way round.

### How a price is written

All of it is display, so it is done here (`src/lib/format.js`), not in the answer:

- **`decimals: "auto"`** gives enough decimals for 4 significant digits, never fewer than 2 and never more than 8, so a tiny price is never rounded to zero: `61,729.52`, `5.934`, `0.05744`, `0.00000375`. Under `0.00000001` it says `< 0.00000001`.
- **A number from 0 to 8** is used as it is (a price that would round to zero then shows `< 0.01` and the like).
- Separators and the date follow the screen's language; the change always has its sign (`+1.24%`, `-0.50%`, `0.00%`).
- A price is one line and shrinks to the box it has (`Price`, `fitLine`).

## How a page plays

A style shows as many quotes as its plate holds (`perPage`): for example 6 rows on the board, 4 cards on a landscape screen, 3 on a portrait one, 1 on the spotlight. With more quotes the media turns the page, sharing its duration among the pages (`pageMs`: between 4 and 15 seconds a page, 8 when the duration is unknown) and going round; dots show the page. The **Spotlight** is the other way round: its page is one quote (`perPage` is 1), for 3 to 8 seconds (`PACE`), and because a media rarely lasts long enough to show twelve, each play goes on from where the last one stopped (`startPage`, from the player's `iteration`). A **banner** of the board and the cards never pages: its quotes stand still, spread over its length, while they fit, and run in a loop (a row on a horizontal banner, a column on a vertical one) when they do not (`Marquee`: two equal groups, the track moves half its length; 60 design px a second).

## The styles

| Style (CMS name) | Zip | What it is |
|---|---|---|
| Quotes Board | `zips/currency-quotes-board.zip` | A dark board with one row per currency: badge, name, chart of the period, price and change of the day |
| Quotes Cards | `zips/currency-quotes-cards.zip` | Big white cards on a colorful screen: price large, change and chart; the cards float slowly |
| Quotes Spotlight | `zips/currency-quotes-spotlight.zip` | One currency at a time on a full screen that takes the mood of its direction (green for a rise, wine red for a fall, night blue for flat): the price huge, a big glowing chart with its highest and lowest price and a pulsing dot at "now", and every other quote in a column with the one on stage lit |

All three are CMS type **CurrencyQuotes**. The name and description of each (`src/styles.js`) are written next to its zip as `zips/currency-quotes-<style>.json` when it is built: the zip itself carries no name or type, so type those in the CMS when creating the system template.

### Screen formats and motion

Every style handles landscape (1280 x 720), portrait (720 x 1280), square (900 x 900) and horizontal and vertical **banners**, picked from `useScreenInfo().screenFormat`. Each layout is drawn on a plate in design pixels and scaled to the screen (`Stage`); a banner plate is 240 design pixels thick and as long as the screen asks (960 for 4:1, up to 3000), so any strip is filled.

**Slim banners.** A horizontal banner 14 times longer than tall or more (1920 x 137 and thinner: the 1920 x 81 footer region of a real layout, 1920 x 56 bars) cannot hold the banner layout, so its plate is `h-slim`: 72 design px thick and as long as the screen asks (up to 8000), with **one line of text**: the base on the left and a chip per quote (flag or code, price, change; no chart, no name), standing still while they fit and running in a loop when they do not (`components/slim`, one look per style). A vertical strip has no slim layout.

No loader screen: `Loader` runs in `reveal` mode and the entrance starts from `dsplay-ready` (see `docs/entrance-style.md` of the repository): the head fades in, rows or cards rise one after the other and each chart is drawn from the left, in about 600 ms. After that something keeps moving: the board's rows are crossed by a soft sheen, the cards float, the spotlight's lights drift behind it and its dot pulses, and a banner's quotes run. Opacity and transform only, on HTML boxes (never on SVG: the charts are static), with a `prefers-reduced-motion` block that turns it all off.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md); install from the repository root, then, in `templates/currency-quotes`:

```sh
npm start                    # the first style (board), http://localhost:3000
npm start -- cards           # any style by its id (board, cards, spotlight)
PORT=3100 npm start -- spotlight
```

`public/dsplay-data.js` defines the `dsplay_config`/`dsplay_media` mock used only outside the DSPLAY app, with 12 example quotes in BRL (fiat, large and tiny crypto, a flat one, a rate below a cent). Add to the address:

| Parameter | Does |
|---|---|
| `?count=3` | only the first 3 quotes (1 to 12) |
| `?period=none` | no chart (`7d`, `30d` for the week and the month) |
| `?mode=inverse` | prices as `1 BRL = x` of each item |
| `?decimals=4` | a fixed number of decimals (`auto` is the default) |
| `?locale=en` | the language (`es`, `fr`, `de`, `it`, `pt_br`) |
| `?duration=12000` | another media length (it changes how long a page stays) |
| `?long=3` | names three times longer, to check that they are cut and never overflow |
| `?empty=1` | an answer with nothing to show |
| `?iteration=1` | the spotlight goes on from where the first play stopped |
| `?flags=0` | the template variable `show_flags` off: the code in a circle instead of the flag |
| `?colors=base` | the template variable `base_perspective` on: a fall of the currency is green |

To see any screen size open `/test-assets/format.html?w=1920&h=1080` (a dev-only harness that passes the other parameters on; left out of the release build).

## Build the zips

```sh
npm run zip:all     # lint, then every style one after the other: zips/currency-quotes-<style>.zip + .json
node scripts/run.mjs zip cards    # one style's zip
node scripts/run.mjs build board  # one style into build/
```

The style is chosen at build time (`TEMPLATE_STYLE`, wired in `vite.config.js` to the `@style` alias), so each zip holds only its own code and fonts. `zips/` and `build/` are git-ignored.

## Old Android WebViews

The players run Android 4.4 WebViews (Chrome 30) in the legacy bundle, so: no CSS custom properties (Sass variables), no `display: grid` and no flex `gap`, `-webkit-` mixins for transforms and animations, the arrows of the changes are CSS triangles, and **no CSS animation on SVG elements**: the charts are static SVG inside HTML boxes, and the banners move an HTML track. `Number.toLocaleString` with options is guarded (it falls back to `toFixed`). Android 4.4 itself was not available to test.

## Fonts

Bundled, never fetched: `src/assets/font` (`woff2` + `woff`, latin subset, from the [Fontsource](https://fontsource.org/) packages of the Google Fonts families, SIL Open Font License 1.1, licenses in `src/assets/font/licenses`). Board: Inter; Cards and Spotlight: Poppins and Inter.

## For developers

| To change | Edit |
|---|---|
| What an answer becomes | `src/lib/model.js` |
| How a price, a change and a date are written | `src/lib/format.js` |
| The chart line | `src/lib/sparkline.js`, `src/components/spark` |
| Paging | `src/lib/paging.js` |
| Text and translations (every key is its English text; a test checks the six languages) | `src/i18n.js` |
| The plate sizes | `src/lib/layout.js` |
| A style | `src/styles/<id>/` (`index.jsx` exporting `default`, `FONTS` and `perPage`; `style.sass`; `fonts.sass`); the loop of the banners is `src/components/marquee`; register a new one in `src/styles.js` |

Dependencies are pinned to exact versions; see [AGENTS.md](AGENTS.md).
