# Menu Board (two products)

A menu with **two promoted products** (a round picture, name and price each) and a list of up to **ten products**. It is the CMS template **1331** "Menu Board Vertical (two products)", rebuilt: the original (July 2024, Tailwind with fixed pixel sizes) let a product picture burst out of its circle and only worked in portrait.

## Variables

The same names as the original, so every existing media keeps working.

| Variable | Type | |
|---|---|---|
| `theme` | selection `dark` / `light` | background and text colour |
| `title` | string | the yellow tab on top |
| `promo_img_01`, `promo_img_02` | image | the round pictures |
| `promo_product_01`, `promo_product_02` | string | names under the pictures |
| `promo_price_01`, `promo_price_02` | string | prices under the pictures |
| `prod_name01` … `prod_name10`, `prod_price01` … `prod_price10` | string | the menu lines (an empty line is left out) |

## Layouts

Every size is a share of the screen (`vw`, `vh`, `vmin`), never pixels, so it draws the same on any resolution.

| Screen | Layout |
|---|---|
| landscape (16:9, 16:10, 4:3, 21:9, …) | promotions on the left, menu on the right |
| portrait | promotions side by side on top, menu under them |
| square | promotions on top, menu in two columns |
| horizontal banner | **one item at a time**: the promotions, then each line; every item stays the media's duration divided by the number of items (at least 0.8 s) |
| vertical banner | one column, each line on two rows (name over price) |

The entrance (see [`docs/entrance-style.md`](../../docs/entrance-style.md)): the title tab slides in, the pictures pop in, the lines rise one after the other. It starts from `dsplay-ready`; there is no loader screen.

## Develop

```
npm start        # http://localhost:5173 — public/dsplay-data.js has the mock data:
                 #   ?theme=light  ?n=4 (lines)  ?locale=en_US  ?duration=20000  ?noimg=1
npm run linter
npm test
npm run zip      # template.zip, ready for the CMS
```

Not tested on Android 4.4 itself (no device in CI).
