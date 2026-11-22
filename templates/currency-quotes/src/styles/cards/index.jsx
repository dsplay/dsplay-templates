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
import { periodTrend } from '../../lib/sparkline';
import './fonts.sass';
import './style.sass';

export const FONTS = [
  { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }, { family: 'Poppins', weight: 700 }, { family: 'Poppins', weight: 800 },
];

// What a plate holds, in design px. Screens: cards per page and the box of a card (a card never grows past `max`, the cards of a short page stay centered).
const GRID = {
  landscape: { per: 4, max: 420, gap: 24, side: 40, price: { max: 74, min: 24 }, spark: { h: 120 }, badge: 64 },
  portrait: { per: 3, max: 656, gap: 24, side: 32, price: { max: 90, min: 28 }, spark: { h: 96 }, badge: 72 },
  square: { per: 4, max: 402, gap: 24, side: 36, price: { max: 66, min: 24 }, spark: { h: 64 }, badge: 56 },
};
const H_CARD = 360;
const V_CARD = 138;
const H_LEAD = 210;
const V_LEAD = 96;

/** How long a page stays at least and at most (ms); this style shows many quotes at once, so it does not go on from play to play. */
export const PACE = { min: 4000, max: 15000, rotate: false };

/** How many cards a page holds on `plate`: a few big ones on a screen. A banner never turns pages: its cards stand still when they fit and run in a loop when they do not. */
export function perPage(plate, count) {
  if (plate.kind === 'h-banner' || plate.kind === 'v-banner' || plate.kind === 'h-slim') return Math.max(1, count);
  return GRID[plate.kind].per;
}

const seriesOf = (item, period) => (period !== 'none' && item.series.length ? item.series : null);
const trendFor = (item, series) => (series ? periodTrend(series) : trendOf(item.changePct));

function Card({
  item, quotes, locale, grid, width,
}) {
  const series = seriesOf(item, quotes.period);
  const inner = width - 56;
  return (
    <div className="cards__card" style={{ width: `${width / 10}rem` }}>
      <div className={`cards__inner cards__inner--${trendOf(item.changePct)}`}>
        <div className="cards__head">
          <Badge code={item.code} kind={item.kind} size={grid.badge} />
          <div className="cards__who">
            <span className="cards__name">{item.name || item.code}</span>
            <span className="cards__code">{item.code}</span>
          </div>
        </div>
        <div className="cards__figures">
          <Price value={item.price} decimals={quotes.decimals} locale={locale} width={inner} max={grid.price.max} min={grid.price.min} className="cards__price" />
          <Change changePct={item.changePct} locale={locale} className="cards__change" />
        </div>
        <div className="cards__spark">
          {series && <Spark series={series} width={inner} height={grid.spark.h} trend={trendFor(item, series)} />}
        </div>
      </div>
    </div>
  );
}

function BannerCard({ item, quotes, locale, vertical }) {
  const series = seriesOf(item, quotes.period);
  return (
    <div className={`cards__card cards__card--${vertical ? 'short' : 'wide'}`}>
      <div className={`cards__inner cards__inner--${trendOf(item.changePct)}`}>
        <div className="cards__head">
          <Badge code={item.code} kind={item.kind} size={vertical ? 40 : 46} />
          <span className="cards__code cards__code--strong">{item.code}</span>
          <Change changePct={item.changePct} locale={locale} className="cards__change" />
        </div>
        <div className="cards__priceline">
          <Price value={item.price} decimals={quotes.decimals} locale={locale} width={vertical ? 130 : 240} max={vertical ? 40 : 58} min={18} className="cards__price" />
          <span className="cards__unit">{quotes.mode === 'inverse' ? item.code : quotes.base}</span>
        </div>
        {!vertical && series && <div className="cards__spark"><Spark series={series} width={300} height={40} trend={trendFor(item, series)} /></div>}
      </div>
    </div>
  );
}

/** Big cards on a colorful screen: each currency a white card with its price large, the change of the day and the chart of the period; cards float slowly. */
function Cards({
  quotes, items, page, pages,
}) {
  const { t, i18n } = useTranslation();
  const plate = usePlate();
  const locale = i18n.language;
  const title = quotes.mode === 'inverse' ? t('1 {{code}} is worth', { code: quotes.base }) : t('Price in {{code}}', { code: quotes.base });
  const period = quotes.period === 'none' ? '' : t(quotes.period === '7d' ? 'Last 7 days' : 'Last 30 days');

  if (plate.kind === 'h-slim') {
    return (
      <Stage className="cards cards--h-slim">
        <Slim quotes={quotes} items={items} plate={plate} variant="cards" />
      </Stage>
    );
  }
  if (plate.kind === 'h-banner' || plate.kind === 'v-banner') {
    const vertical = plate.kind === 'v-banner';
    return (
      <Stage className={`cards cards--${plate.kind}`}>
        <div className="cards__lead">
          <Badge code={quotes.base} kind="fiat" size={vertical ? 40 : 44} onlyFlag className="cards__basebadge" />
          <span className="cards__base">{quotes.base}</span>
          {!vertical && <span className="cards__title">{title}</span>}
        </div>
        <div className="cards__list">
          <Marquee
            items={items}
            chip={vertical ? V_CARD : H_CARD}
            line={vertical ? plate.h - V_LEAD : plate.w - H_LEAD}
            vertical={vertical}
            render={(item) => <BannerCard item={item} quotes={quotes} locale={locale} vertical={vertical} />}
          />
        </div>
      </Stage>
    );
  }
  const grid = GRID[plate.kind];
  const inner = plate.w - grid.side * 2;
  const columns = plate.kind === 'landscape' ? items.length : 2;
  const width = Math.min(grid.max, Math.floor((inner - grid.gap * (columns - 1)) / columns));
  return (
    <Stage className={`cards cards--${plate.kind}`}>
      <div className="cards__top">
        <div className="cards__topmain">
          <Badge code={quotes.base} kind="fiat" size={58} onlyFlag className="cards__basebadge" />
          <span className="cards__base">{quotes.base}</span>
          <span className="cards__title">{quotes.baseName ? `${title} · ${quotes.baseName}` : title}</span>
        </div>
        <span className="cards__period">{period}</span>
      </div>
      <div className="cards__list" key={page}>
        {items.map((item) => <Card key={item.code} item={item} quotes={quotes} locale={locale} grid={grid} width={width} />)}
      </div>
      <div className="cards__foot">
        <span className="cards__updated">{quotes.date ? t('Updated {{date}}', { date: formatDate(quotes.date, locale) }) : ''}</span>
        <Dots pages={pages} page={page} />
      </div>
    </Stage>
  );
}

export default Cards;
