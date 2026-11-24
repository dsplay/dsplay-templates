const DEFAULT_END_MARGIN_MS = 2000;

/**
 * How long each page stays, from the media's duration: the same share for every page, and the last one keeps
 * the margin on top, so the loop does not restart on the page's last frame. Mirrors the CMS's own preview.
 * @param {number} durationMs - The media's duration
 * @param {number} pages - How many pages the document has
 * @param {number} [endMarginMs] - Extra time the last page stays
 * @returns {number[]} Milliseconds per page
 */
export default function pageTimes(durationMs, pages, endMarginMs = DEFAULT_END_MARGIN_MS) {
  const count = Math.max(1, Math.floor(pages));
  const margin = Math.min(Math.max(0, endMarginMs), Math.max(0, durationMs - count));
  const share = Math.max(1, Math.floor((durationMs - margin) / count));
  const times = Array.from({ length: count }, () => share);
  times[count - 1] = Math.max(1, durationMs - share * (count - 1));
  return times;
}
