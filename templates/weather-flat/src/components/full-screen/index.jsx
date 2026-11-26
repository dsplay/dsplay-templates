import { useView } from '../../hooks/view-context';
import {
  SIZES, DAYS, fullLayout, rectStyle,
} from '../../util/layout';
import detailsOf from '../../util/details';
import NowCard from '../now-card';
import StatCard from '../stat-card';
import Pill from '../pill';
import LogoTile from '../logo-tile';
import './style.sass';

/** Landscape, portrait and square: the `now` card, detail cards (landscape and portrait), the forecast pills and the logo tile. */
function FullScreen() {
  const { stage, settings, weather } = useView();
  const format = stage.format;
  const sizes = SIZES[format];
  const pills = Math.min(DAYS, weather.forecast.length);
  const d = detailsOf(weather.current, settings.windUnit, weather.locale);
  const stats = settings.showDetails && sizes.stat ? [
    d.humidity !== null && {
      key: 'humidity', label: 'Humidity', value: d.humidity, unit: '%',
    },
    d.wind && {
      key: 'wind', label: 'Wind', value: d.wind.value, unit: d.wind.label,
    },
    d.sun && {
      key: 'sun', label: 'Sun', value: d.sun, small: true,
    },
  ].filter(Boolean) : [];
  const layout = fullLayout(format, stage, { pills, stats: stats.length });
  const anim = settings.animationEnabled ? ' fade-in' : '';

  return (
    <div className={`full-screen${anim}`}>
      {settings.showLogo && (
        <div className="logo-slot" style={rectStyle(layout.logo)}>
          <LogoTile height={layout.logo.h} minWidth={layout.logo.w} inset={2.8} />
        </div>
      )}
      <NowCard rect={layout.now} sizes={sizes.now} withDescription />
      {stats.map((stat, i) => (
        <StatCard
          key={stat.key}
          rect={layout.stats[i]}
          label={stat.label}
          value={stat.value}
          unit={stat.unit}
          small={stat.small}
          sizes={sizes.stat}
        />
      ))}
      {layout.pills.map((rect, i) => (
        <Pill
           
          key={i}
          rect={rect}
          day={weather.forecast[i]}
          today={i === 0}
          horizontal={layout.horizontalPills}
          sizes={sizes.pill}
        />
      ))}
    </div>
  );
}

export default FullScreen;
