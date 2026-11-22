import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { screen, useMedia, useScreenInfo } from '@dsplay/react-template-utils';
import FireMap from '../fire-map';
import {
  attributions,
  formatCount,
  panelsOf,
  regionName,
  regionsShown,
  scopeLabel,
  trend,
} from './model';
import './style.sass';

const DASH = '—';

function formatTime(date, lng) {
  return date.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(date, lng) {
  return date.toLocaleString(lng, {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

function useClock() {
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return clock;
}

/** The change against the 24 hours before, as an arrow and a sentence. */
function TrendLine({ summary }) {
  const { t } = useTranslation();
  const { direction, percent } = trend(summary);
  let text = t('Same as the previous 24 hours');
  if (direction === 'new') text = t('None in the previous 24 hours');
  if (direction === 'up') text = t('{{percent}}% more than the previous 24 hours', { percent });
  if (direction === 'down') text = t('{{percent}}% fewer than the previous 24 hours', { percent });
  const arrow = { up: '▲', new: '▲', down: '▼', flat: '■' }[direction];
  return (
    <div className={`trend trend--${direction}`}>
      <span className="trend__arrow">{arrow}</span>
      <span className="trend__text">{text}</span>
    </div>
  );
}

function Header({ data, clock }) {
  const { t, i18n } = useTranslation();
  const credits = (data.sources || []).map((s) => s.text.split(' ')[0]);
  return (
    <header className="dashboard__header">
      <div className="dashboard__title">
        <span className="dashboard__title-main">{t('Wildfire monitor')}</span>
        <span className="dashboard__title-sub">
          {scopeLabel(data.scope, i18n.language, t)}
          {credits.length > 0 ? ` · ${credits.join(' / ')}` : ''}
        </span>
      </div>
      <div className="dashboard__clock">{formatTime(clock, i18n.language)}</div>
    </header>
  );
}

function StatCard({ summary }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="stat">
      <span className="stat__label">{t('Fire detections')}</span>
      <span className="stat__period">{t('Last 24 hours')}</span>
      <span className="stat__value">{formatCount(summary.last24h, i18n.language)}</span>
      <TrendLine summary={summary} />
      <span className="stat__before">
        {t('Previous 24 hours')}
        {': '}
        {formatCount(summary.previous24h, i18n.language)}
      </span>
    </div>
  );
}

function RegionsPanel({ data, shown }) {
  const { t, i18n } = useTranslation();
  const rows = (data.regions || []).slice(0, shown);
  const top = rows.reduce((m, r) => Math.max(m, r.detections), 0) || 1;
  const title = data.regionLevel === 'subdivision' ? t('States and regions with most detections') : t('Countries with most detections');
  return (
    <div className="regions">
      <div className="section-header">
        <span className="section-header__title">{title}</span>
        <span className="section-header__meta">{t('Detections')}</span>
      </div>
      <ol className="regions__list">
        {rows.map((region, index) => {
          const { direction } = trend({ last24h: region.detections, previous24h: region.previous });
          return (
            <li key={region.code} className="region-row">
              <span className="region-row__rank">{index + 1}</span>
              <span className="region-row__name" title={regionName(region.code, i18n.language)}>{regionName(region.code, i18n.language)}</span>
              <span className="region-row__bar">
                <span className="region-row__fill" style={{ width: `${Math.max(2, Math.round((region.detections / top) * 100))}%` }} />
              </span>
              <span className={`region-row__trend trend--${direction}`}>{{ up: '▲', new: '▲', down: '▼', flat: '■' }[direction]}</span>
              <span className="region-row__count">{formatCount(region.detections, i18n.language)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Footer({ data }) {
  const { t, i18n } = useTranslation();
  const summary = data.summary || {};
  const last = summary.observedAt ? t('Last detection {{time}}', { time: formatDateTime(new Date(summary.observedAt), i18n.language) }) : DASH;
  const credits = attributions(data.sources);
  return (
    <footer className="dashboard__footer">
      <span className="footer__last">{last}</span>
      <span className="footer__note">{t('Satellite detections show heat, not a confirmed fire.')}</span>
      <span className="footer__credits">
        {credits.length > 0 ? `${t('Source:')} ${credits.join(' · ')}` : ''}
      </span>
    </footer>
  );
}

/** The thin strip and the narrow column: the headline number and the top of the ranking. */
function Banner({ data, vertical }) {
  const { t, i18n } = useTranslation();
  const summary = data.summary || {};
  const rows = (data.regions || []).slice(0, vertical ? 5 : 3);
  return (
    <div className={`banner ${vertical ? 'banner--v' : 'banner--h'}`}>
      <div className="banner__brand">
        <span className="banner__title">{t('Wildfire monitor')}</span>
        <span className="banner__scope">{scopeLabel(data.scope, i18n.language, t)}</span>
      </div>
      <div className="banner__headline">
        <span className="banner__value">{formatCount(summary.last24h, i18n.language)}</span>
        <span className="banner__label">{t('Fire detections')}</span>
        <span className="banner__period">{t('Last 24 hours')}</span>
        <TrendLine summary={summary} />
      </div>
      <div className="banner__rows">
        {rows.map((region) => (
          <div key={region.code} className="banner-row">
            <span className="banner-row__name">{regionName(region.code, i18n.language)}</span>
            <span className="banner-row__count">{formatCount(region.detections, i18n.language)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ data, format }) {
  const { t, i18n } = useTranslation();
  const clock = useClock();
  const panels = panelsOf(data);
  const stacked = format === 'portrait' || format === 'square';
  // the cap of the biggest dot of the map, in pixels: small, so that a world full of detections is not a world on fire (the map scales it down on a small box)
  const dot = format === 'square' ? 5 : 6;

  return (
    <div className={`dashboard${stacked ? ' dashboard--stacked' : ''}${format === 'square' ? ' dashboard--square' : ''}`}>
      <Header data={data} clock={clock} />
      {panels.any ? (
        <div className="dashboard__body">
          {panels.map && (
            <div className="dashboard__map">
              <FireMap data={data} dot={dot} language={i18n.language} />
            </div>
          )}
          <div className="dashboard__side">
            <StatCard summary={data.summary} />
            {panels.regions
              ? <RegionsPanel data={data} shown={regionsShown(format)} />
              : <div className="section-empty">{t('No detections in this area')}</div>}
          </div>
        </div>
      ) : (
        <div className="dashboard__body"><div className="section-empty">{t('No information for this place')}</div></div>
      )}
      <Footer data={data} />
    </div>
  );
}

/**
 * Shows `media.result`, the `wildfire/1` answer of the DSPLAY player gateway; nothing is fetched here and nothing is configured: the place and the area (a
 * radius, a country or the world) are the media's, the panels are drawn for the information the answer brings, and the banner formats show the headline
 * number and the top of the ranking instead of the panels.
 */
function Main() {
  const { t } = useTranslation();
  const { screenFormat } = useScreenInfo();
  const { result } = useMedia();
  const data = result || {};
  const banner = screenFormat === screen.H_BANNER || screenFormat === screen.V_BANNER;
  if (banner && !panelsOf(data).any) return <div className="banner banner--none"><span className="section-empty">{t('No information for this place')}</span></div>;
  if (screenFormat === screen.H_BANNER) return <Banner data={data} />;
  if (screenFormat === screen.V_BANNER) return <Banner data={data} vertical />;
  return <Dashboard data={data} format={screenFormat} />;
}

export default Main;
