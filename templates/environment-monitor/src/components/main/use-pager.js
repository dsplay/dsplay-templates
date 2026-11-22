import { useEffect, useState } from 'react';
import { pageInterval } from './model';

/**
 * Pages a list: `perPage` items at a time, every page for the media's duration divided by the number of pages, so that the pages together last as long as the
 * media. A list that fits one page never turns.
 */
export default function usePager(total, perPage, duration) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(total / perPage));
  const interval = pageInterval(duration, pages);

  useEffect(() => {
    if (pages <= 1) return undefined;
    const timer = setInterval(() => setPage((p) => (p + 1) % pages), interval);
    return () => clearInterval(timer);
  }, [pages, interval]);

  const current = Math.min(page, pages - 1);
  return { page: current, pages, slice: (list) => list.slice(current * perPage, (current + 1) * perPage) };
}
