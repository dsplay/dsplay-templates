import { useLayoutEffect, useRef, useState } from 'react';
import { rem } from '../../lib/layout';

// the search stops when the two sizes are this close, in design px
const PRECISION = 0.5;
// when to measure again, in ms, on a WebView that cannot say when a font has arrived (Android 4.4 has no `document.fonts`)
const REMEASURE_AFTER = [300, 1000, 2500];

/**
 * A text that always fits its box: the font size is the biggest (from `max` down to `min`, in design px) at which the text, measured as the browser draws it,
 * fits `width` x `height` (either may be left out: the parent's width or the text's own height is then the limit). It measures the real element before the first
 * paint, so a long name in a heavy font never gets clipped, and again once the fonts are in: the loader only probes a family at its normal weight, so a bold face
 * starts to load when the text first uses it, and a text measured in the fallback font would be cut when the real one arrives. It plays the part of the shared
 * `FitText`, which fills a fixed box with no biggest or smallest size and re-measures whenever its own size changes (here the box follows the text, so it would
 * never settle). `nowrap` keeps the text on one line and shrinks it to the width; `wholeWords` never breaks a word across lines (a long word shrinks the text
 * instead). If even `min` is too much, the box clips instead of letting the text run over its neighbours.
 */
function FittedText({
  as: Tag = 'p', text, width, height, max, min, lineHeight = 1.4, wholeWords = false, nowrap = false, className = '',
}) {
  const ref = useRef(null);
  const [size, setSize] = useState(max);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // The text fits when its block is no taller than the box and nothing sticks out sideways. The block's own height (its lines times the line height) is
    // read with the limit off: `scrollHeight` also counts the glyphs that hang out of a tight line box (about 0.2em in a heavy font), which would look like a cut.
    const fits = (candidate) => {
      el.style.fontSize = rem(candidate);
      el.style.maxHeight = 'none';
      const blockHeight = el.offsetHeight;
      el.style.maxHeight = height ? rem(height) : '';
      const limit = height ? (parseFloat(window.getComputedStyle(document.documentElement).fontSize) * height) / 10 : Infinity;
      return blockHeight <= limit + 1 && el.scrollWidth <= el.clientWidth + 1;
    };
    const fit = () => {
      // in a flex column the element would shrink to the room it is given, hiding how tall the text really is
      el.style.flexShrink = '0';
      let best = min;
      if (fits(max)) best = max;
      else {
        let low = min;
        let high = max;
        while (high - low > PRECISION) {
          const middle = (low + high) / 2;
          if (fits(middle)) { best = middle; low = middle; } else high = middle;
        }
      }
      el.style.fontSize = rem(best);
      el.style.flexShrink = '';
      setSize(best);
    };

    fit();
    let live = true;
    const again = () => { if (live) fit(); };
    // measuring has just made the browser start loading the fonts the text uses, so `ready` is pending until they are all there
    const { fonts } = document;
    if (fonts && fonts.ready) fonts.ready.then(again, () => {});
    if (fonts && fonts.addEventListener) fonts.addEventListener('loadingdone', again);
    const timers = REMEASURE_AFTER.map((ms) => setTimeout(again, ms));
    return () => {
      live = false;
      timers.forEach(clearTimeout);
      if (fonts && fonts.removeEventListener) fonts.removeEventListener('loadingdone', again);
    };
  }, [text, width, height, max, min, lineHeight, wholeWords, nowrap]);

  const style = {
    display: 'block',
    fontSize: rem(size),
    lineHeight,
    overflow: 'hidden',
    overflowWrap: wholeWords || nowrap ? 'normal' : 'break-word',
  };
  if (width) style.maxWidth = rem(width);
  if (height) style.maxHeight = rem(height);
  if (nowrap) style.whiteSpace = 'nowrap';
  return <Tag ref={ref} className={className} style={style}>{text}</Tag>;
}

export default FittedText;
