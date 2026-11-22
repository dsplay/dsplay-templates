import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Badge from '../../components/badge';
import Change from '../../components/change';
import Price from '../../components/price';
import Spark from '../../components/spark';
import Reveal from '../../components/reveal';
import { formatDate, formatPrice, trendOf } from '../../lib/format';
import { rem } from '../../lib/layout';
import { lastPoint, periodTrend, sparkArea, sparkPoints } from '../../lib/sparkline';
import useTone from '../../lib/use-tone';
import './fonts.sass';
import './style.sass';

export const FONTS = [
  { family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }, { family: 'Poppins', weight: 700 }, { family: 'Poppins', weight: 800 },
];

/** One quote is the hero at a time, for 3 to 8 seconds, and each play of the media goes on from where the last one stopped. */
export const PACE = { min: 3000, max: 8000, rotate: true };

/** The hero is one quote, so a page holds one (on every screen, the thin banner included). */
export const perPage = () => 1;

// What a plate holds, in design px: the box of the price, of the chart and the size of the flag.
const SIZES = {
  landscape: { price: { w: 700, max: 138, min: 56 }, chart: { w: 700, h: 176 }, flag: 88, rail: { w: 210, max: 25 } },
  portrait: { price: { w: 640, max: 140, min: 56 }, chart: { w: 640, h: 330 }, flag: 96, rail: { w: 150, max: 22 } },
  square: { price: { w: 470, max: 100, min: 46 }, chart: { w: 470, h: 210 }, flag: 76, rail: { w: 130, max: 21, badge: 38 } },
  'h-banner': { price: { w: 330, max: 104, min: 40 }, chart: { w: 380, h: 110 }, flag: 92 },
  'v-banner': { price: { w: 196, max: 62, min: 28 }, chart: { w: 196, h: 104 }, flag: 80, rail: { w: 120, max: 22, badge: 36 } },
};

const seriesOf = (item, period) => (period !== 'none' && item.series.length ? item.series : null);

/** The mood of the screen follows the quote on stage: green for a rise, wine red for a fall, night blue for flat. The last mood fades out under the new one. */
function Backdrop({ trend }) {
  // the mood before this one, kept while the new one fades in over it (state derived while rendering, the way React asks for it)
  const [moods, setMoods] = useState({ now: trend, was: trend });
  if (moods.now !== trend) setMoods({ now: trend, was: moods.now });
  return (
    <>
      <div className={`spot__bg spot__bg--${moods.was}`} />
      <div key={trend} className={`spot__bg spot__bg--${trend} spot__bg--in`} />
      <div className="spot__orb spot__orb--a" />
      <div className="spot__orb spot__orb--b" />
    </>
  );
}

/** The big chart of the period: a glowing line over a fading area, the highest and lowest price, and a dot that pulses at "now". The SVG is static; the dot is HTML. */
function Chart({
  series, width, height, trend, locale, decimals,
}) {
  const { t } = useTranslation();
  const tone = useTone();
  const pad = 8;
  const end = lastPoint(series, width, height, pad);
  return (
    <div className="spot__chartwrap" style={{ width: rem(width) }}>
    <div className={`spot__chartbox spot__chartbox--${tone(trend)}`} style={{ width: rem(width), height: rem(height) }}>
      <Reveal>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="spot-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="spot__stop" stopOpacity="0.5" />
              <stop offset="1" className="spot__stop" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={sparkArea(series, width, height, pad)} fill="url(#spot-fill)" />
          <polyline className="spot__line" points={sparkPoints(series, width, height, pad)} fill="none" />
        </svg>
      </Reveal>
      {end && <i className="spot__dot" style={{ left: `${(end.x / width) * 100}%`, top: `${(end.y / height) * 100}%` }} />}
    </div>
    <div className="spot__range">
      <span>{`${t('Low')} ${formatPrice(Math.min(...series), decimals, locale)}`}</span>
      <span>{`${t('High')} ${formatPrice(Math.max(...series), decimals, locale)}`}</span>
    </div>
    </div>
  );
}

function Hero({
  item, quotes, locale, size,
}) {
  const { t } = useTranslation();
  const tone = useTone();
  const trend = trendOf(item.changePct);
  const series = seriesOf(item, quotes.period);
  const period = quotes.period === 'none' ? '' : t(quotes.period === '7d' ? 'Last 7 days' : 'Last 30 days');
  return (
    <div className={`spot__hero spot__hero--${tone(trend)}`}>
      <div className="spot__who">
        <Badge code={item.code} kind={item.kind} size={size.flag} className="spot__flag" />
        <div className="spot__names">
          <span className="spot__name">{item.name || item.code}</span>
          <span className="spot__code">{item.code}</span>
        </div>
      </div>
      <div className="spot__pricebox">
        <Price value={item.price} decimals={quotes.decimals} locale={locale} width={size.price.w} max={size.price.max} min={size.price.min} className="spot__price" />
        <span className="spot__unit">{quotes.mode === 'inverse' ? item.code : quotes.base}</span>
      </div>
      <div className="spot__meta">
        <Change changePct={item.changePct} locale={locale} className="spot__change" />
        <span className="spot__period">{period}</span>
      </div>
      {series && (
        <div className="spot__chart">
          <Chart series={series} width={size.chart.w} height={size.chart.h} trend={periodTrend(series)} locale={locale} decimals={quotes.decimals} />
        </div>
      )}
    </div>
  );
}

/**
 * The thin banner (1920 x 81, 1920 x 56...): one line, and still one quote at a time. The bar takes the mood of the quote on stage; each quote that takes it
 * brings its flag, code and name, its price, its change and a small chart of the period, and a counter says which one it is.
 */
function SlimHero({
  item, quotes, locale, current,
}) {
  const series = seriesOf(item, quotes.period);
  const unit = quotes.mode === 'inverse' ? item.code : quotes.base;
  return (
    <div className="spot__slim">
      <div className="spot__slimlead">
        <Badge code={quotes.base} kind="fiat" size={44} onlyFlag className="spot__basebadge" />
        <span className="spot__slimbase">{quotes.base}</span>
      </div>
      <div className="spot__slimhero" key={item.code}>
        <Badge code={item.code} kind={item.kind} size={48} className="spot__flag" />
        <span className="spot__slimcode">{item.code}</span>
        <span className="spot__slimname">{item.name}</span>
        <span className="spot__slimprice">
          <Price value={item.price} decimals={quotes.decimals} locale={locale} width={330} max={54} min={26} className="spot__price" />
          <span className="spot__slimunit">{unit}</span>
        </span>
        <Change changePct={item.changePct} locale={locale} className="spot__change" />
        {series && <div className="spot__slimspark"><Spark series={series} width={210} height={42} trend={periodTrend(series)} /></div>}
      </div>
      <span className="spot__slimcount">{`${current + 1} / ${quotes.items.length}`}</span>
    </div>
  );
}

/** Every quote of the answer in a column, the one on stage lit: the viewer always sees the whole list and where the hero is in it. */
function Rail({
  quotes, current, locale, size,
}) {
  return (
    <div className="spot__rail">
      {quotes.items.map((item, i) => (
        <div key={item.code} className={`spot__row${i === current ? ' spot__row--on' : ''}`}>
          <Badge code={item.code} kind={item.kind} size={size.rail.badge || 42} />
          <div className="spot__rowmain">
            <span className="spot__rowcode">{item.code}</span>
            <Price value={item.price} decimals={quotes.decimals} locale={locale} width={size.rail.w} max={size.rail.max} min={14} className="spot__rowprice" />
          </div>
          <Change changePct={item.changePct} locale={locale} className="spot__rowchange" />
        </div>
      ))}
    </div>
  );
}

/**
 * One quote at a time, on a full screen that takes the mood of its direction: the price huge, the change, a big glowing chart of the period with its highest
 * and lowest price, and the other quotes in a column. The media goes through the quotes (each play from where the last stopped).
 */
function Spotlight({ quotes, items }) {
  const { t, i18n } = useTranslation();
  const tone = useTone();
  const plate = usePlate();
  const locale = i18n.language;
  const kind = plate.kind;

  const current = quotes.items.findIndex((item) => item.code === items[0].code);
  const item = quotes.items[current] || items[0];
  if (kind === 'h-slim') {
    return (
      <Stage className="spot spot--h-slim">
        <Backdrop trend={tone(trendOf(item.changePct))} />
        <SlimHero item={item} quotes={quotes} locale={locale} current={current} />
      </Stage>
    );
  }
  const size = SIZES[kind];
  const title = quotes.mode === 'inverse' ? t('1 {{code}} is worth', { code: quotes.base }) : t('Price in {{code}}', { code: quotes.base });
  const hero = <Hero key={item.code} item={item} quotes={quotes} locale={locale} size={size} />;
  const lead = (
    <div className="spot__lead">
      <Badge code={quotes.base} kind="fiat" size={kind === 'v-banner' ? 40 : 52} onlyFlag className="spot__basebadge" />
      <span className="spot__base">{quotes.base}</span>
      {kind !== 'v-banner' && <span className="spot__title">{title}</span>}
    </div>
  );

  return (
    <Stage className={`spot spot--${kind}`}>
      <Backdrop trend={tone(trendOf(item.changePct))} />
      {kind === 'h-banner' || kind === 'v-banner' ? (
        <>
          {lead}
          <div className="spot__main">
            {hero}
            {kind === 'v-banner' && <Rail quotes={quotes} current={current} locale={locale} size={size} />}
          </div>
        </>
      ) : (
        <>
          <div className="spot__top">
            {lead}
            <span className="spot__updated">{quotes.date ? t('Updated {{date}}', { date: formatDate(quotes.date, locale) }) : ''}</span>
          </div>
          <div className="spot__main">
            {hero}
            <Rail quotes={quotes} current={current} locale={locale} size={size} />
          </div>
        </>
      )}
    </Stage>
  );
}

export default Spotlight;
