![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Holidays Templates

Five [React](https://reactjs.org/) [HTML-based templates](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform, all for the **Holidays** media type. One package, one set of logic, five looks: each style is built into its own zip and becomes its own system template in the CMS.

It fetches nothing and holds no key: DSPLAY's player gateway answers the media with the `holidays/1` document (the holidays of a country, state and city), the player hands it to the template as `media.result` and the template only draws it.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+. Only players that speak the gateway protocol play this media type.

## The answer (`holidays/1`)

```jsonc
{
  "schema": "holidays/1", "date": "2026-09-01", "country": "BR", "state": "SP", "city": "São Paulo", "stateName": "São Paulo", "cityListed": true, "lang": "pt",
  "holidays": [ // from yesterday to `daysAhead` days ahead, in date order
    { "date": "2026-09-07", "name": "Dia da Independência", "kind": "independence", "scope": "national", "type": "public" },
    { "date": "2026-02-14", "days": 5, "name": "Carnaval", "kind": "carnival", "scope": "national", "type": "optional" }
  ],
  "longWeekends": [{ "from": "2026-09-05", "to": "2026-09-07", "days": 3, "holidays": ["Dia da Independência"] }],
  "sources": [{ "text": "Holiday data: date-holidays by commenthol", "url": "https://github.com/commenthol/date-holidays", "license": "CC-BY-3.0" }]
}
```

- `kind` is what the holiday is about (new year, carnival, easter, christmas, labour, independence, election, remembrance, religious, islamic, lunar, indic, jewish, thanksgiving, city, people); a holiday the service could not classify has none and gets a star. `scope` says whose list it came from (national, state, city). `type` is `public`, `bank` or `optional` (an optional day is not a day off for everyone). `days` is how many days a long holiday lasts.
- **The template decides what is today from the screen's own clock**, not from the answer's `date` (which is the Worker's UTC day): it shows the holidays that are on today (a long one is on for each of its days) and the next one that is a day off for everyone. The answer lists yesterday too, so a screen east of UTC that is already on the next day still has the data.
- A screen with no holiday on and none ahead shows one centered message. A media set to "use each screen's own location" gets the answer for the country (and, in Brazil, the state) where the screen is; the city is never used in that mode.
- The words around the holidays (Holiday today, Next holiday, Weekend, ...) are the template's own, in the screen's language: English, Portuguese, Spanish, French, German and Italian. Month and weekday names are plain data in `src/lib/names.js` (old Android WebViews do not carry every `Intl` locale). The holiday names stay in the answer's language.

## The styles

| Style (CMS name) | Zip | What it is |
|---|---|---|
| Next Holiday | `zips/holidays-next-holiday.zip` | Navy screen, the days left until the next holiday in big numbers; on a holiday, that holiday is big and the next one is a small box below |
| Month Calendar | `zips/holidays-month-calendar.zip` | The month on a grid with its holidays marked, and the holidays beside it (a month with few is filled up with the next ones) |
| Long Weekend | `zips/holidays-long-weekend.zip` | The next long weekend as one tile per day; with none ahead, the holiday that is on or the next one |
| Holiday Poster | `zips/holidays-holiday-poster.zip` | The name as big as it fits: an orange poster on a holiday, a teal one while it is ahead |
| Upcoming Holidays | `zips/holidays-upcoming-list.zip` | Dark list of the next holidays: icon, name, date, scope and how far away it is |

All five are CMS type **Holidays**. The name and description of each (`src/styles.js`) are written next to its zip as `zips/holidays-<style>.json` when it is built: the zip itself carries no name or type, so type those in the CMS when creating the system template.

### Screen formats

Every style has a landscape (1280 x 720), a portrait (720 x 1280) and a square (900 x 900) plate, and a horizontal and a vertical **banner** (`src/components/banner`, shared: a medal, the label, the holiday and when), picked from `useScreenInfo().screenFormat`. Each layout is drawn on a plate in design pixels and scaled to the screen (`Stage`); a screen of another shape gets bars of the style's background round the plate. A banner plate is 240 design pixels thick and as long as the screen asks.

## Try it

```sh
npm start [-- <style>]     # dev server of a style (default: next-holiday)
```

`public/dsplay-data.js` is an example answer (São Paulo, Brazil's 2026 and 2027 holidays). Add `?today=2026-09-07` to the URL to pretend it is that day: `2026-09-07` is a holiday, `2026-09-01` has a long weekend ahead, `2026-02-16` is the middle of Carnival (five days), `?locale=en` (or `es`, `fr`, `de`, `it`) for another language. `public/test-assets/format.html?w=1920&h=300` frames the template in a screen of an exact size.

## Loading

There is no loader screen. `Loader` runs in `reveal` mode (`@dsplay/react-template-utils`): the template is mounted hidden while the style's fonts (every weight it uses, see `FONTS`) are fetched, then shown with the class `dsplay-ready`, and the blocks of the plate rise and fade in one after the other (`src/components/stage/style.sass`). There is no minimum time; a 4 s cap shows the template anyway.

## Commands

```sh
npm run linter           # eslint src
npm test                 # vitest
npm run zip:all          # lint + every style's zip in zips/
```

## Data

The holidays come from the open [date-holidays](https://github.com/commenthol/date-holidays) library (ISC code, data under CC-BY-3.0, so the attribution in `sources` must stay visible where the media is documented). Islamic and other lunar dates can differ by a day in some countries. The service, not this template, owns the data: see `apps/api/src/player-gateway/providers/holidays` in `dsplay-web-apps`.
