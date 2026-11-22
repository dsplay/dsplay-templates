---
"@dsplay/react-template-utils": minor
---

New `FittedText` component: a text on one line that takes the space it needs and no more. The font size is the biggest, from `max` down to `min` (em of the parent's font size), at which the text fits the width its parent gives it, measured as the browser draws it before the first paint and again once the fonts are in (also at 0.3, 1 and 2.5 s, for a WebView without `document.fonts`). Below `min` the text is cut with an ellipsis; a short text keeps `max`. `FitText` fills a fixed box with no biggest size, so it cannot do this. The Instagram Basic, Instagram Image Only and Twitter Basic templates use it for the account name.
