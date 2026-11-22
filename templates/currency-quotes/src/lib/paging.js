// When there are more quotes than a screen holds, the media shows them a page at a time. Pure functions plus one hook, tested in paging.test.jsx.
import { useEffect, useState } from 'react';

export const MIN_PAGE_MS = 4000;
export const MAX_PAGE_MS = 15000;

/** How many pages `count` items make at `perPage` per page (at least 1). */
export const pageCount = (count, perPage) => Math.max(1, Math.ceil(count / Math.max(1, perPage)));

/** How long a page stays: the media's duration shared among the pages, between `min` and `max` (4 and 15 seconds by default; 8 s when the duration is unknown). */
export function pageMs(duration, pages, min = MIN_PAGE_MS, max = MAX_PAGE_MS) {
  const ms = Math.round(Number(duration) / pages);
  if (!Number.isFinite(ms) || ms <= 0) return Math.min(max, Math.max(min, 8000));
  return Math.min(max, Math.max(min, ms));
}

/**
 * Where a play starts when the style shows one quote at a time and the media is too short to show them all: each play of the media goes on from where the
 * last one stopped (`iteration` is the player's count of plays), so every quote gets its turn over the plays.
 */
export function startPage(pages, duration, iteration, min, max) {
  const n = Math.floor(Number(iteration));
  if (pages < 2 || !Number.isFinite(n) || n < 1) return 0;
  const perPlay = Math.max(1, Math.floor(Number(duration) / pageMs(duration, pages, min, max)) || 1);
  return (n * perPlay) % pages;
}

/** The page on screen now (0-based): it starts at `start`, moves on every `pageMs(duration, pages, min, max)` and goes round; one page never moves. */
export function usePage(pages, duration, { start = 0, min, max } = {}) {
  const [page, setPage] = useState(start);
  useEffect(() => {
    if (pages < 2) return undefined;
    const timer = setInterval(() => setPage((current) => (current + 1) % pages), pageMs(duration, pages, min, max));
    return () => clearInterval(timer);
  }, [pages, duration, min, max]);
  return pages < 2 ? 0 : page % pages;
}
