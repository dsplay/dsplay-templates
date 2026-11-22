import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';

// the search stops when the two sizes are this close, in em
const PRECISION = 0.02;
// when to measure again, in ms, on a WebView that cannot say when a font has arrived (Android 4.4 has no `document.fonts`)
const REMEASURE_AFTER = [300, 1000, 2500];

/**
 * A text on one line that takes the space it needs and no more: the font size is the biggest, from `max` down to `min`, at which the text, measured as the browser
 * draws it, fits the width its parent gives it. It measures the real element before the first paint, so a long name never wraps over the text below it, and again
 * once the fonts are in (`Loader` mounts the template hidden while they load, and a text measured in the fallback font would be cut, or too small, when the real
 * one arrives). If even `min` is too much the text is cut with an ellipsis. A short text keeps `max`.
 *
 * The text stays invisible (it still takes its place, so it can be measured) until it is at its final size: the fonts are in and the first 300 ms have passed. Measured in the fallback font a
 * text would be drawn too big and then shrink when the real font arrives; this way that first size is never seen.
 *
 * Once it is final it is not measured again (a late measure would move the text under the eye, and whatever is laid out around it with it), except when `text`, `max`, `min` or `lines`
 * change. `onReady` is called once, when it becomes final: a parent that must not show its other elements before the text has settled (they would jump when it does) waits for it.
 *
 * With `lines` above 1 the text may wrap over that many lines instead: the size is the biggest, from `max` down to `min`, at which it fits in them, and only a text that does not
 * fit in `lines` lines even at `min` is cut, with an ellipsis on the last line (`-webkit-line-clamp`). A one-line text is never cut while it can still shrink.
 *
 * It differs from `FitText`, which fills a fixed box with no biggest or smallest size and so would blow a short text up to the whole box. The element is a block
 * as wide as its parent leaves it: give the parent the width the text may use.
 * @param {object} props
 * @param {string} props.text - The text, one line (what is measured again when it changes)
 * @param {number} props.max - Biggest font size, in em of the parent's font size (the size a short text gets)
 * @param {number} props.min - Smallest font size, in em of the parent's font size
 * @param {number} [props.lines] - How many lines the text may take, 1 by default (one line, never wrapped)
 * @param {string} [props.as] - Tag of the element, `span` by default
 * @param {string} [props.className] - Class applied to the element
 * @param {() => void} [props.onReady] - Called once, when the text is at its final size and shown
 * @param {React.ReactNode} [props.children] - What to draw instead of `text`, for a text with markup in it (a blinking colon); `text` must say the same words
 * @param {React.CSSProperties} [props.style] - Extra styles merged into the element (the size and the one-line rules always win)
 * @returns {React.ReactElement}
 */
function FittedText({
  as: Tag = 'span', text, max, min, lines = 1, className = '', style = {}, children, onReady,
}) {
  const ref = useRef(null);
  const [size, setSize] = useState(max);
  // true when the text still does not fit in `lines` lines at `min`: the last line is then cut with an ellipsis
  const [clamped, setClamped] = useState(false);
  const wraps = lines > 1;
  // false until the size is the final one (see above); once true it stays true
  const [ready, setReady] = useState(false);
  const settledRef = useRef(false);
  const readyRef = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // the text fits when nothing sticks out sideways of the box the parent gives it (and, when it may wrap, when it takes no more than `lines` lines)
    const fits = (candidate) => {
      el.style.fontSize = `${candidate}em`;
      if (el.scrollWidth > el.clientWidth) return false;
      if (!wraps) return true;
      const lineHeight = parseFloat(window.getComputedStyle(el).lineHeight) || parseFloat(window.getComputedStyle(el).fontSize) * 1.2;
      return el.scrollHeight <= lineHeight * lines + 2;
    };
    const fit = () => {
      if (wraps) {
        // measured unclamped, so the height is the whole text's
        el.style.display = 'block';
        el.style.webkitLineClamp = 'unset';
      }
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
      el.style.fontSize = `${best}em`;
      setSize(best);
      setClamped(wraps && !fits(best));
      // final only when the fonts are in and the first measures are past
      const { fonts } = document;
      if (settledRef.current && (!fonts || !fonts.status || fonts.status === 'loaded')) {
        readyRef.current = true;
        setReady(true);
      }
    };

    fit();
    let live = true;
    // once final, only a change of the text or the limits measures again (this effect runs again for those, before the paint)
    const again = () => { if (live && !readyRef.current) fit(); };
    const { fonts } = document;
    if (fonts && fonts.ready) fonts.ready.then(again, () => {});
    if (fonts && fonts.addEventListener) fonts.addEventListener('loadingdone', again);
    const timers = REMEASURE_AFTER.map((ms, index) => setTimeout(() => {
      if (index === 0) settledRef.current = true;
      again();
    }, ms));
    return () => {
      live = false;
      timers.forEach(clearTimeout);
      if (fonts && fonts.removeEventListener) fonts.removeEventListener('loadingdone', again);
    };
  }, [text, max, min, lines, wraps]);

  useEffect(() => {
    if (ready && onReady) onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- called once, when it becomes final
  }, [ready]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        display: 'block',
        fontSize: `${size}em`,
        whiteSpace: wraps ? 'normal' : 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ...(wraps && clamped ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines } : {}),
        // inherited (not `visible`) once final: a text inside a hidden slide stays hidden
        ...(ready ? {} : { visibility: 'hidden' }),
      }}
    >
      {children !== undefined ? children : text}
    </Tag>
  );
}

export default FittedText;
