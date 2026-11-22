import { useMemo } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import Style, { perPage, PACE } from '@style';
import Empty from '../empty';
import usePlate from '../stage/use-plate';
import { readQuotes } from '../../lib/model';
import { pageCount, startPage, usePage } from '../../lib/paging';

/**
 * Reads the answer (`media.result`) and puts the quotes on screen. What fits on a screen depends on the style and the plate (`perPage`); when there are
 * more quotes the media turns the page, sharing its duration among the pages. An answer with no usable quote shows one centered message.
 */
function Main() {
  const { result, duration, iteration } = useMedia();
  const plate = usePlate();
  const quotes = useMemo(() => readQuotes(result), [result]);
  const per = quotes ? perPage(plate, quotes.items.length) : 1;
  const pages = pageCount(quotes ? quotes.items.length : 0, per);
  // a style that shows one quote at a time (`PACE.rotate`) goes on, play after play, from where the last play stopped
  const start = PACE.rotate ? startPage(pages, duration, iteration, PACE.min, PACE.max) : 0;
  const page = usePage(pages, duration, { start, min: PACE.min, max: PACE.max });

  if (!quotes) return <Empty />;
  const items = quotes.items.slice(page * per, page * per + per);
  return <Style quotes={quotes} items={items} page={page} pages={pages} />;
}

export default Main;
