import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Badge from '../../components/badge';
import Change from '../../components/change';
import Dots from '../../components/dots';
import Marquee from '../../components/marquee';
import Slim from '../../components/slim';
import Price from '../../components/price';
import Spark from '../../components/spark';
import { formatDate, trendOf } from '../../lib/format';
import { rem } from '../../lib/layout';
import { periodTrend } from '../../lib/sparkline';
import useTone from '../../lib/use-tone';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }];

// What a plate holds, in design px: rows per page and the boxes of a row. A banner is laid out in columns (horizontal) or short rows (vertical).
const GRID = {
  landscape: { rows: 6, badge: 56, price: { w: 270, max: 40, min: 20 }, spark: { w: 230, h: 56 } },
  portrait: { rows: 8, badge: 64, price: { w: 230, max: 38, min: 18 }, spark: { w: 150, h: 56 } },
  square: { rows: 6, badge: 56, price: { w: 210, max: 36, min: 18 }, spark: { w: 170, h: 56 } },
};
const H_LEAD = 210;
const H_COLUMN = 236;
const V_LEAD = 96;
const V_ROW = 112;

/** How long a page stays at least and at most (ms); this style shows many quotes at once, so it does not go on from play to play. */
export const PACE = { min: 4000, max: 15000, rotate: false };

/** How many quotes a page holds on `plate`: rows on a screen. A banner never turns pages: its quotes stand still when they fit and run in a loop when they do not. */
export function perPage(plate, count) {
  if (plate.kind === 'h-banner' || plate.kind === 'v-banner' || plate.kind === 'h-slim') return Math.max(1, count);
  return GRID[plate.kind].rows;
}

const sparkOf = (item, period) => (period !== 'none' && item.series.length ? item.series : null);
const trendFor = (item, series) => (series ? periodTrend(series) : trendOf(item.changePct));

function Row({ item, quotes, grid, locale, index }) {
  const tone = useTone();
  const series = sparkOf(item, quotes.period);
  return (
    <div className={`board__row board__row--${tone(trendOf(item.changePct))}`} style={{ zIndex: 20 - index }}>
      <Badge code={item.code} kind={item.kind} size={grid.badge} />
      <div className="board__info">
        <span className="board__name">{item.name || item.code}</span>
        <span className="board__code">{item.code}</span>
      </div>
      {series && (
        <div className="board__spark">
          <Spark series={series} width={grid.spark.w} height={grid.spark.h} trend={trendFor(item, series)} />
        </div>
      )}
      <div className="board__figures" style={{ width: rem(grid.price.w) }}>
        <Price value={item.price} decimals={quotes.decimals} locale={locale} width={grid.price.w} max={grid.price.max} min={grid.price.min} className="board__price" />
        <Change changePct={item.changePct} locale={locale} className="board__change" />
      </div>
    </div>
  );
}

function Column({ item, quotes, locale }) {
  const tone = useTone();
  const series = sparkOf(item, quotes.period);
  return (
    <div className={`board__col board__col--${tone(trendOf(item.changePct))}`}>
      <div className="board__colhead">
        <Badge code={item.code} kind={item.kind} size={40} />
        <span className="board__code">{item.code}</span>
      </div>
      <Price value={item.price} decimals={quotes.decimals} locale={locale} width={H_COLUMN - 36} max={46} min={20} className="board__price" />
      <Change changePct={item.changePct} locale={locale} className="board__change" />
      {series && <div className="board__spark"><Spark series={series} width={120} height={32} trend={trendFor(item, series)} /></div>}
    </div>
  );
}

function ShortRow({ item, quotes, locale }) {
  const tone = useTone();
  return (
    <div className={`board__short board__short--${tone(trendOf(item.changePct))}`}>
      <div className="board__shorthead">
        <span className="board__code">{item.code}</span>
        <Change changePct={item.changePct} locale={locale} className="board__change" />
      </div>
      <Price value={item.price} decimals={quotes.decimals} locale={locale} width={208} max={40} min={18} className="board__price" />
    </div>
  );
}

/** A dark board: the base currency on top, then one row per quote (badge, name, chart of the period, price and change of the day), in the colors of their direction. */
function Board({
  quotes, items, page, pages,
}) {
  const { t, i18n } = useTranslation();
  const plate = usePlate();
  const locale = i18n.language;
  const title = quotes.mode === 'inverse' ? t('1 {{code}} is worth', { code: quotes.base }) : t('Price in {{code}}', { code: quotes.base });
  const period = quotes.period === 'none' ? '' : t(quotes.period === '7d' ? 'Last 7 days' : 'Last 30 days');

  if (plate.kind === 'h-slim') {
    return (
      <Stage className="board board--h-slim">
        <Slim quotes={quotes} items={items} plate={plate} variant="board" />
      </Stage>
    );
  }
  if (plate.kind === 'h-banner') {
    return (
      <Stage className="board board--h-banner">
        <div className="board__lead">
          <Badge code={quotes.base} kind="fiat" size={44} onlyFlag className="board__basebadge" />
          <span className="board__base">{quotes.base}</span>
          <span className="board__title">{title}</span>
        </div>
        <div className="board__list">
          <Marquee items={items} chip={H_COLUMN} line={plate.w - H_LEAD} render={(item) => <Column item={item} quotes={quotes} locale={locale} />} />
        </div>
      </Stage>
    );
  }
  if (plate.kind === 'v-banner') {
    return (
      <Stage className="board board--v-banner">
        <div className="board__lead">
          <Badge code={quotes.base} kind="fiat" size={40} onlyFlag className="board__basebadge" />
          <span className="board__base">{quotes.base}</span>
        </div>
        <div className="board__list">
          <Marquee items={items} chip={V_ROW} line={plate.h - V_LEAD} vertical render={(item) => <ShortRow item={item} quotes={quotes} locale={locale} />} />
        </div>
      </Stage>
    );
  }
  const grid = GRID[plate.kind];
  return (
    <Stage className={`board board--${plate.kind}`}>
      <div className="board__head">
        <div className="board__headmain">
          <Badge code={quotes.base} kind="fiat" size={56} onlyFlag className="board__basebadge" />
          <span className="board__base">{quotes.base}</span>
          <span className="board__title">{quotes.baseName ? `${title} · ${quotes.baseName}` : title}</span>
        </div>
        <span className="board__period">{period}</span>
      </div>
      <div className="board__list" key={page}>
        {items.map((item, i) => <Row key={item.code} item={item} quotes={quotes} grid={grid} locale={locale} index={i} />)}
      </div>
      <div className="board__foot">
        <span className="board__updated">{quotes.date ? t('Updated {{date}}', { date: formatDate(quotes.date, locale) }) : ''}</span>
        <Dots pages={pages} page={page} />
      </div>
    </Stage>
  );
}

export default Board;
