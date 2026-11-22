import React, { useEffect, useState } from 'react';

/** Longest wait (ms) for a font that never settles, and the wait of a WebView without `document.fonts`. */
const FALLBACK_WAIT = 400;

/**
 * @typedef {string | { family: string, weight?: number | string }} FontSpec
 */

const toSpec = (font) => (typeof font === 'string' ? { family: font } : font);

/**
 * Asks the browser for the face of every family (at its weight) and resolves once they have all
 * loaded or failed. Unlike `document.fonts.ready`, which resolves at once while nothing has asked
 * for a font yet, this makes the browser fetch the face, so a bold title never renders with the
 * fallback font first. A WebView without `document.fonts` (Android 4.4) waits a short fixed time.
 * @param {FontSpec[]} families
 * @returns {Promise<void>}
 */
async function loadFonts(families) {
  if (!families.length) return;
  const { fonts } = document;
  if (!fonts || typeof fonts.load !== 'function') {
    await new Promise((resolve) => { setTimeout(resolve, FALLBACK_WAIT); });
    return;
  }
  await Promise.allSettled(families.map((font) => {
    const { family, weight = 'normal' } = toSpec(font);
    return fonts.load(`${weight} 1em "${family}"`);
  }));
  await fonts.ready;
}

/**
 * Renders hidden probe elements for the given font families and calls back once the browser
 * has finished loading them.
 * @param {object} props
 * @param {FontSpec[]} [props.families] - Font family names to preload; an entry may be
 * `{ family, weight }` when the face is not the normal weight
 * @param {() => void} props.onLoad - Called once the fonts have loaded (or failed)
 * @returns {React.ReactElement}
 */
function FontLoader({
  families = [],
  onLoad,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      (async () => {
        try {
          await loadFonts(families);
        } catch (e) {
          /* eslint-disable no-console */
          console.log(e);
        }

        setLoading(false);
        onLoad();
      })();
    }
    // `families` is read once, on the first run: a new array on every render must not restart it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, onLoad]);

  const style = {
    visibility: 'hidden',
    width: 0,
    height: 0,
  };

  return (
    <div style={style}>
      {families.map((font) => {
        const { family, weight } = toSpec(font);
        return <div key={`${family}-${weight}`} style={{ fontFamily: family, fontWeight: weight }}>-</div>;
      })}
    </div>
  );
}

export default FontLoader;
