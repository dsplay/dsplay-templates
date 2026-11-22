---
"@dsplay/react-template-utils": patch
---

The `Loader` wrapper (reveal mode and the placeholder) is anchored at the top left of the screen. It was `position: absolute` with no offset, so a page whose `body` has padding got it at its static position inside that padding: the template overflowed the screen by the padding at the right and the bottom and was cut (Instagram and Twitter templates, 2%). A template with padding on `body` now puts it on `.dsplay-reveal`.
