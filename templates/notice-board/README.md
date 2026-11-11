# DSPLAY - Notice board template

Shows the posts of a DSPLAY notice board (DSP-1222) in a region of the screen. One template, three layouts, chosen by the kind of post the player picked:

- `card`: a framed message in the middle of the region.
- `notice`: a heading and left-aligned text, like a paper notice.
- `ticker`: one line with the post of the showing, scrolling right to left (the player picks one post per showing, like the other formats).

The posts come from the player gateway (the `NOTICE_BOARD` media, served as `PLAYER_GATEWAY`): the Worker answers with each post as `blocks` (text runs with bold, italic and a named colour: red, teal, amber), never as HTML, and the player hands the picked post over as `media.kind`, `media.title` and `media.blocks` (and `media.image`, the url of the post's picture, empty when it has none). The template draws the blocks as text; in the `card` and `notice` layouts a picture goes on top of the text, or on the left in a wide, short region. This template only picks the layout and applies the style variables.

The text is sized from the region the template is rendered in (the page is as big as the region): as large as fits, so there is no font size variable. Variables (register them in the Web Manager): `text_color`, `background_color`, `show_title`, `ticker_speed`.

No build step. `npm run zip` packs it for upload, `npm test` runs the smoke tests, `npm start` serves it with the mock data of `scripts/dsplay-data.js`.
