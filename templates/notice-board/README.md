# DSPLAY - Notice board template

Shows the posts of a DSPLAY notice board (DSP-1222) in a region of the screen. One template, three layouts, chosen by the kind of post the player picked:

- `card`: a framed message in the middle of the region.
- `notice`: a heading and left-aligned text, like a paper notice.
- `ticker`: one line with every live post, scrolling right to left.

The posts come from the player gateway (the `NOTICE_BOARD` media, served as `PLAYER_GATEWAY`): the Worker answers with HTML that is already escaped and limited to bold, italic and line breaks, and the player hands the picked post over as `media.kind`, `media.title` and `media.html`. This template only picks the layout and applies the style variables.

Variables (register them in the Web Manager): `base_font_size`, `text_color`, `background_color`, `show_title`, `ticker_speed`.

No build step. `npm run zip` packs it for upload, `npm test` runs the smoke tests, `npm start` serves it with the mock data of `scripts/dsplay-data.js`.
