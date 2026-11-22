![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Information Panel

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform: one responsive panel that shows a clock, the weather, two currency quotes, the news, the next holiday, countdowns and count ups, a joke of the day and a logo, at any resolution, from a thin 1920x56 strip to a full portrait screen.

It is the template of the **Information panel** media (`HORIZONTAL_INFO_BAR`), published as **two templates from this one source**: *Information panel* (the panel family) and *Information panel: spotlight* (the spotlight family), so each CMS template offers only its own styles. The media holds the data (which widgets, in which order, which city, which currencies, which feed); this template holds only the looks.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Features

- **One layout for every format.** The format is read from the size of the screen, and the sizes are `em`, so a format only sets its type size:

  | Format | Looks |
  |---|---|
  | Slim, 14:1 or longer (1920x120, 1920x81, 1920x56) | one row; clock, weather and quotes keep their size, the rotating area takes what is left; no tag, one line |
  | Banner, 4:1 to 14:1 (1920x240) | one row, with the tag and a sub line |
  | Landscape, square, portrait | the widgets as translucent tiles, the rotating text large |
  | Tall banner, 3:1 or taller (320x1080) | one column; a long text wraps over several lines |

- **Two families, eleven styles.** The **panel** shows every widget at once (`classic`, `terminal`, `glass`, `newsroom`, `paper`, `neon`). The **spotlight** shows one widget at a time, with its detail (`poster`, `cards`, `split`, `night`, `minimal`): a photo for the news, the forecast and the facts for the weather, both currencies with their 30-day charts, the next three holidays, the counters, the joke, the horoscope sign. The rotation starts when the template is shown (while the fonts and images load it is hidden and nothing moves), and the time of each page is what is left of the media's duration (less the time since the page began to load, measured, and 0.5 s of margin) shared equally among the pages, with no minimum, so the whole turn is shown in one showing and the last page is never shorter than the first; a joke is two pages (the question, then the answer). A long media is shared in a whole number of turns, as few as keep a page under its maximum (8 s in the panel, 12 s in the spotlight), so no page stays longer or shows more often than another; after the last page of the last turn it stays on that page until the media ends, and goes back to the first only when there was time for another whole turn (`lib/rotation.js`). The media form tells the customer how long the media should be to read every page. The dots at the foot tell which slide it is. On a strip 14:1 or longer a spotlight is too thin for detail and shows one line.
- **Fitted text.** A headline, a joke or a holiday name takes the biggest size, down to a minimum, at which it fits one line (`FittedText`); on the tall banner it wraps instead.
- **The customer's order.** The widgets come in the order the media sets; the rotating widgets (news, holidays, counters, jokes) share one area that sits where the first of them was put, each taking a turn (4 s, a joke takes two).
- **Weather alerts** (the `alerts` widget, from the Environment monitor's service): one slide per active alert, moderate or worse, the most severe first; the tag and the icon wear the severity color (yellow, orange, red). With no alert active the widget is left out and takes no room.
- **A widget that failed is left out**; the panel plays with the rest.
- **Charts need a series.** The spotlight draws a currency's chart, minimum and maximum only when its `items[].series` is in the answer, and only in the formats with room (landscape, square, portrait, tall; not the banners). The media's quotes widget carries the 30-day series (the panel ignores it, and shows the two prices and changes).

## Template variables

Only looks. What the panel shows is in the media.

| Key | Type | Description |
|---|---|---|
| `style` | selection | Register it as a **selection** (a list, not text) with these options in `extra`: panel template `classic` (default), `terminal`, `glass`, `newsroom`, `paper`, `neon`; spotlight template `poster` (default), `cards`, `split`, `night`, `minimal`. A value from the other family falls back to the default. |
| `pin` | selection | Spotlight template only (do not register it on the panel). Register it as a **selection** with `slide` (default: the clock and the logo are slides of the loop) and `both` (they stay on the top bar instead). Any other value counts as `slide`. |
| `bg_color` | color | Background color of the whole panel (replaces the style's own background). |
| `bg_image` | image | Background image of the whole panel (wins over `bg_color`). |
| `text_color` | color | Text color of the whole panel. |
| `currency_box_color` | color | Background color behind each currency value. |
| `currency_text_color` | color | Text color of each currency value. |
| `rss_logo_box_color` | color | Background color behind the news icon (the "N"). The feed's own logo has no box, unless this is set. |
| `sponsor_logo_box_color` | color | Background color behind the logo (white by default). |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

The temperature unit is not a variable: it is the weather widget's own setting in the media (`C` or `F`), which the answer carries as `widgets.weather.data.unit` (`C` when absent), and the panel writes it with its letter, `28°C` or `82°F`.

## The answer the media sends

The player puts the gateway's answer in `dsplay_media.result`:

```js
{
  order: ['clock', 'weather', 'quotes', 'news', 'holidays', 'countdown', 'jokes', 'logo'], // play order (optional)
  fixed: ['clock', 'weather', 'quotes', 'logo'],
  rotating: ['news', 'holidays', 'countdown', 'jokes'],
  widgets: { clock: { type: 'clock', status: 'ok', data: { hour12: false } }, /* ... by id */ },
}
```

`public/dsplay-data.js` has a full example. There is no fallback that calls the services itself: the media type is served by the gateway only, so a player that cannot use the gateway cannot play it (the old `HORIZONTAL_BAR` media keeps its own template, `horizontal-info-bar`).

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-info-panel
```

`public/dsplay-data.js` defines the mock `dsplay_config`/`dsplay_media`/`dsplay_template` globals used only outside the DSPLAY app. The dev server takes `?style=newsroom` (or `poster`...), `?pin=both`, `?only=weather` (one widget), `?locale=en`, `?iteration=1` (the next headline or joke) and `?few=1` (only a clock and the news); resize the window to try a format.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/info-panel   # from the repository root: template-panel.zip and template-spotlight.zip
# one family only: npm run zip:panel  or  npm run zip:spotlight (vite build --mode panel|spotlight)
```

## Maintaining dependencies

See [AGENTS.md](AGENTS.md).
