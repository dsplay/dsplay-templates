import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { screen, useMedia, useScreenInfo } from '@dsplay/react-template-utils';
import {
  BANNER_LABELS,
  SEVERITY_CLASS,
  SEVERITY_LABELS,
  ALERT_CARDS_PER_PAGE,
  bannerFeed,
  bannerItems,
  cardsPerPage,
  panelsOf,
  riversShown,
  rainingStations,
  riverProgress,
  attributions,
  riverStatusClass,
  shortRegionName,
  sourceNames,
} from './model';
import usePager from './use-pager';
import './style.sass';

function formatTime(date, lng) {
  return date.toLocaleTimeString(lng, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatDateTime(date, lng) {
  return date.toLocaleString(lng, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Header({ clock, sources }) {
  const { t, i18n } = useTranslation();
  return (
    <header className="dashboard__header">
      <div className="dashboard__title">
        <span className="dashboard__title-main">{t('Weather monitoring')}</span>
        <span className="dashboard__title-sub">{sourceNames(sources).join(' / ')}</span>
      </div>
      <div className="dashboard__clock">{formatTime(clock, i18n.language)}</div>
    </header>
  );
}

function AlertBanner({ items }) {
  const { t } = useTranslation();
  return (
    <div className="alert-banner">
      <span className="alert-banner__icon">⚠</span>
      <div className="alert-banner__list">
        {items.map((item) => (
          <span key={item.key} className={`alert-banner__item alert-banner__item--${item.status}`}>
            {item.river
              ? `${t(BANNER_LABELS[item.status])} — ${item.river.name} (${item.river.levelCm.toFixed(1)} cm)`
              : `${item.alert.event}${item.alert.area ? ` (${item.alert.area}${item.alert.more > 0 ? ` ${t('and {{count}} more', { count: item.alert.more })}` : ''})` : ''}`}
          </span>
        ))}
      </div>
    </div>
  );
}

function StationCard({ station }) {
  const { t, i18n } = useTranslation();
  const severity = SEVERITY_CLASS[station.intensity];
  const label = t(SEVERITY_LABELS[severity]);
  const time = formatTime(new Date(station.observedAt), i18n.language).slice(0, 5);

  return (
    <div className={`station-card station-card--${severity}`}>
      <div className="station-card__bar" />
      <div className="station-card__body">
        <div className="station-card__rain">
          {station.last1hMm.toFixed(1)}
          <span className="station-card__unit">mm</span>
        </div>
        <div className="station-card__label">{label}</div>
        <div className="station-card__name" title={station.name}>{station.name}</div>
        <div className="station-card__meta">
          {station.city && (
            <span className="station-card__city">{station.city}</span>
          )}
          <span className="station-card__org">{station.operator}</span>
          <span className="station-card__time">{time}</span>
        </div>
      </div>
    </div>
  );
}

function RainfallSection({ stations, summary, alone }) {
  const { t } = useTranslation();
  return (
    <div className={`rain-section${alone ? ' rain-section--alone' : ''}`}>
      <div className="section-header">
        <span className="section-header__title">{t('Rainfall')}</span>
        <span className="section-header__meta">
          {summary.stationsReporting}
          {' '}
          {t('stations')}
          {' · '}
          {summary.maxLast1hMm > 0 ? t('max {{value}} mm', { value: summary.maxLast1hMm.toFixed(1) }) : t('no rain')}
        </span>
      </div>
      <div className={`rain-section__grid${stations.length === 0 ? ' rain-section__grid--empty' : ''}`}>
        {stations.length > 0
          ? stations.map((s) => <StationCard key={s.id} station={s} />)
          : <div className="section-empty">{t('No rain right now')}</div>}
      </div>
    </div>
  );
}

function RiverCard({ river }) {
  return (
    <div className={`river-card river-card--${riverStatusClass(river.status)}`}>
      <div className="river-card__info">
        <span className="river-card__name" title={river.name}>{river.name}</span>
        {river.river && <span className="river-card__rio">{river.river}</span>}
      </div>
      <div className="river-card__right">
        <span className="river-card__nivel">
          {river.levelCm.toFixed(1)}
          <span className="river-card__unit">cm</span>
        </span>
        <div className="river-card__bar-track">
          <div
            className="river-card__bar-fill"
            style={{ width: `${riverProgress(river)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RiversSection({ rivers, total }) {
  const { t } = useTranslation();
  return (
    <div className="rivers-section">
      <div className="section-header">
        <span className="section-header__title">{t('River levels')}</span>
        <span className="section-header__meta">
          {total}
          {' '}
          {t('stations')}
        </span>
      </div>
      <div className={`rivers-section__list${rivers.length === 0 ? ' rivers-section__list--empty' : ''}`}>
        {rivers.length > 0
          ? rivers.map((r) => <RiverCard key={r.id} river={r} />)
          : <div className="section-empty">{t('No hydrological data')}</div>}
      </div>
    </div>
  );
}

function ConditionCard({ item }) {
  return (
    <div className="meteo-card">
      <div className="meteo-card__name" title={item.name}>{item.name}</div>
      <div className="meteo-card__data">
        <span className="meteo-card__temp">
          {item.temperatureC.toFixed(1)}
          <span className="meteo-card__unit">°C</span>
        </span>
        {item.humidityPct !== null && (
          <span className="meteo-card__umid">
            {Math.round(item.humidityPct)}
            <span className="meteo-card__unit">%</span>
          </span>
        )}
        {item.windKmh > 0 && (
          <span className="meteo-card__vento">
            {item.windKmh.toFixed(1)}
            <span className="meteo-card__unit">km/h</span>
          </span>
        )}
      </div>
    </div>
  );
}

function ConditionsSection({ conditions, summary }) {
  const { t } = useTranslation();
  return (
    <div className="meteo-section">
      <div className="section-header">
        <span className="section-header__title">{t('Weather conditions')}</span>
        <span className="section-header__meta">
          {summary.stations}
          {' '}
          {t('stations')}
        </span>
      </div>
      <div className={`meteo-section__grid${conditions.length === 0 ? ' meteo-section__grid--empty' : ''}`}>
        {conditions.length > 0
          ? conditions.map((c) => <ConditionCard key={c.id} item={c} />)
          : <div className="section-empty">{t('No weather data')}</div>}
      </div>
    </div>
  );
}

function RegionCard({ region }) {
  const { t } = useTranslation();
  const hasTempRange = region.temperatureMinC !== null && region.temperatureMaxC !== null;
  const hasRain = region.rainMm !== null && region.rainMm > 0.05;
  const hasEto = region.etoMm !== null && region.etoMm > 0.05;

  return (
    <div className="meso-card">
      <div className="meso-card__header">
        <span className="meso-card__name">{shortRegionName(region.name)}</span>
        <span className="meso-card__stations">
          {region.stations}
          {' '}
          {t('st.')}
        </span>
      </div>
      <div className="meso-card__temp">
        {region.temperatureNowC !== null ? region.temperatureNowC.toFixed(1) : '—'}
        <span className="meso-card__unit">°C</span>
      </div>
      {hasTempRange && (
        <div className="meso-card__range">
          {region.temperatureMinC.toFixed(1)}
          {'° – '}
          {region.temperatureMaxC.toFixed(1)}
          °
        </div>
      )}
      <div className="meso-card__metrics">
        {region.humidityPct !== null && (
          <span className="meso-card__metric meso-card__metric--rh">
            {t('{{value}}% RH', { value: Math.round(region.humidityPct) })}
          </span>
        )}
        {hasRain && (
          <span className="meso-card__metric meso-card__metric--rain">
            {region.rainMm.toFixed(1)}
            {' mm'}
          </span>
        )}
        {hasEto && (
          <span className="meso-card__metric meso-card__metric--etos">
            {'ETo '}
            {region.etoMm.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

function ClimateBar({ climate }) {
  const { t } = useTranslation();
  if (climate.length === 0) return null;
  return (
    <div className="climate-bar">
      <span className="climate-bar__label">{t('Region')}</span>
      <div className="climate-bar__cards">
        {climate.map((r) => <RegionCard key={r.id} region={r} />)}
      </div>
    </div>
  );
}

function Footer({
  summary, generatedAt, partial, page, totalPages, credits, rain,
}) {
  const { t, i18n } = useTranslation();
  return (
    <footer className="dashboard__footer">
      <div className="dashboard__legend">
        {rain && Object.entries(SEVERITY_LABELS).map(([key, lbl]) => (
          <span key={key} className={`dashboard__legend-item dashboard__legend-item--${key}`}>
            <span className={`dashboard__legend-dot dashboard__legend-dot--${key}`} />
            <span className="dashboard__legend-label">{t(lbl)}</span>
          </span>
        ))}
      </div>
      <div className="dashboard__footer-center">
        <span className="dashboard__last-update">
          {partial || !generatedAt ? t('Partial update') : formatDateTime(new Date(generatedAt), i18n.language)}
        </span>
        {summary.rainfall && (
          <span className="dashboard__stations-count">
            {t('{{rain}} raining of {{total}}', { rain: summary.rainfall.stationsRaining, total: summary.rainfall.stationsReporting })}
          </span>
        )}
        {credits.length > 0 && (
          <span className="dashboard__attribution">
            {t('Source:')}
            {' '}
            {credits.join(' · ')}
          </span>
        )}
      </div>
      {totalPages > 1 && (
        <div className="dashboard__pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span key={i} className={`dashboard__dot${i === page ? ' dashboard__dot--active' : ''}`} />
          ))}
        </div>
      )}
    </footer>
  );
}

const EMPTY_SUMMARY = { stationsReporting: 0, stationsRaining: 0, maxLast1hMm: null };
const SEVERITY_BY_CAP = { minor: 'pre-alerta', moderate: 'alerta', severe: 'enchente', extreme: 'enchente', unknown: 'pre-alerta' };

function AlertCard({ alert }) {
  const { t, i18n } = useTranslation();
  const status = SEVERITY_BY_CAP[alert.severity] || 'pre-alerta';
  const places = alert.areas.slice(0, 3).join(', ');
  const more = Math.max(0, alert.areaCount - Math.min(alert.areas.length, 3));
  return (
    <div className={`alert-card alert-card--${status}`}>
      <div className="alert-card__bar" />
      <div className="alert-card__body">
        <div className="alert-card__event">{alert.event}</div>
        {places && (
          <div className="alert-card__places">
            {places}
            {more > 0 ? ` ${t('and {{count}} more', { count: more })}` : ''}
          </div>
        )}
        {alert.description && <div className="alert-card__text">{alert.description}</div>}
        <div className="alert-card__until">{t('Until {{time}}', { time: formatDateTime(new Date(alert.expires), i18n.language) })}</div>
      </div>
    </div>
  );
}

function AlertsSection({ alerts, shown }) {
  const { t } = useTranslation();
  return (
    <div className="alerts-section">
      <div className="section-header">
        <span className="section-header__title">{t('Weather alerts')}</span>
        <span className="section-header__meta">{alerts.length}</span>
      </div>
      <div className={`alerts-section__grid${alerts.length === 0 ? ' alerts-section__grid--empty' : ''}`}>
        {alerts.length > 0
          ? shown.map((a) => <AlertCard key={a.id} alert={a} />)
          : <div className="section-empty">{t('No active alerts')}</div>}
      </div>
    </div>
  );
}

function useClock() {
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return clock;
}

/** The thin strip and the narrow column: what is most urgent, a few items at a time. */
function Banner({ vertical }) {
  const { t, i18n } = useTranslation();
  const { duration, result } = useMedia();
  const data = result || {};
  const clock = useClock();
  const feed = bannerFeed(data);
  const pager = usePager(feed.length, vertical ? 5 : 3, duration);

  return (
    <div className={`banner ${vertical ? 'banner--v' : 'banner--h'}`}>
      <div className="banner__brand">
        <span className="banner__title">{t('Weather monitoring')}</span>
        <span className="banner__clock">{formatTime(clock, i18n.language).slice(0, 5)}</span>
      </div>
      <div className="banner__items">
        {feed.length === 0 && panelsOf(data).any && <span className="banner__none">{t('No rain right now')}</span>}
        {pager.slice(feed).map((item) => (
          <div key={item.key} className={`banner-item banner-item--${item.status}`}>
            <span className="banner-item__bar" />
            <span className="banner-item__text">
              <span className="banner-item__title">{item.title}</span>
              {(item.label || item.detail) && <span className="banner-item__detail">{item.label ? t(item.label) : item.detail}</span>}
            </span>
            {item.value && (
              <span className="banner-item__value">
                {item.value}
                <span className="banner-item__unit">{item.unit}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ format }) {
  const { t } = useTranslation();
  const { duration, result } = useMedia();
  const data = result || {};
  const panels = panelsOf(data);
  const clock = useClock();

  const stacked = format === 'portrait' || format === 'square';
  const raining = rainingStations(data.rainfall);
  const alerts = data.alerts || [];
  // What turns the pages: the rain cards, or the warnings when they are all the place has.
  const rainPager = usePager(raining.length, cardsPerPage(format), duration);
  const alertPager = usePager(alerts.length, ALERT_CARDS_PER_PAGE, duration);
  const pager = panels.alertsPanel ? alertPager : rainPager;

  const summary = data.summary || {};
  const banner = bannerItems(data.rivers, panels.alertsPanel ? [] : data.alerts);
  const left = panels.rain || panels.rivers;
  const right = panels.conditions || panels.alertsPanel;

  return (
    <div className={`dashboard${stacked ? ' dashboard--stacked' : ''}${format === 'square' ? ' dashboard--square' : ''}`}>
      <Header clock={clock} sources={data.sources} />
      {banner.length > 0 && <AlertBanner items={banner} />}
      {panels.any ? (
        <div className="dashboard__body">
          {left && (
            <div className={`dashboard__left${right ? '' : ' dashboard__left--alone'}`}>
              {panels.rain && <RainfallSection stations={rainPager.slice(raining)} summary={summary.rainfall || EMPTY_SUMMARY} alone={!panels.rivers} />}
              {panels.rivers && <RiversSection rivers={data.rivers.slice(0, riversShown(format))} total={data.rivers.length} />}
            </div>
          )}
          {right && (
            <div className={`dashboard__right${left ? '' : ' dashboard__right--alone'}`}>
              {panels.conditions && <ConditionsSection conditions={data.conditions} summary={summary.conditions || { stations: data.conditions.length }} />}
              {panels.alertsPanel && <AlertsSection alerts={alerts} shown={alertPager.slice(alerts)} />}
            </div>
          )}
        </div>
      ) : (
        <div className="dashboard__body"><div className="section-empty">{t('No information for this place')}</div></div>
      )}
      <ClimateBar climate={panels.climate ? data.climate : []} />
      <Footer
        summary={summary}
        generatedAt={data.generatedAt}
        partial={(data.unavailable || []).length > 0}
        page={pager.page}
        totalPages={pager.pages}
        credits={attributions(data.sources)}
        rain={panels.rain}
      />
    </div>
  );
}

/**
 * Shows `media.result`, the `environment/1` answer of the DSPLAY player gateway; nothing is fetched here, and nothing is configured: a panel is drawn only for
 * the information the answer brings, the cards per page come from the grid, and every page lasts the media's duration divided by the number of pages. The
 * banner formats show the most urgent items instead of the panels.
 */
function Main() {
  const { screenFormat } = useScreenInfo();
  if (screenFormat === screen.H_BANNER) return <Banner />;
  if (screenFormat === screen.V_BANNER) return <Banner vertical />;
  return <Dashboard format={screenFormat} />;
}

export default Main;
