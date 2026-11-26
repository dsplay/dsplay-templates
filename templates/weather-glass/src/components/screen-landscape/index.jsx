import { useView } from '../../hooks/view-context';
import Now from '../now';
import Stats, { statsOf } from '../stats';
import Day from '../days';
import Panel from '../panel';
import CompanyTile from '../company-tile';

const SIZES = {
  city: 5.5, temp: 24, icon: 26, minmax: 4.5, desc: 4.5, padding: 3,
};
const DAY = {
  day: 4.5, date: 3, icon: 9, max: 5.5, min: 4.4,
};

/** Landscape (spec weather-glass 4): `now` and the details at the left, the 5 days as pills at the right, the logo at the top right. */
function Landscape() {
  const {
    stage, settings, data, locale,
  } = useView();
  const items = settings.showDetails ? statsOf(data, settings, locale) : [];
  const hasDays = data.days.length > 0;
  const rx = stage.w - 76;
  const lw = rx - 8;
  const bottom = stage.h - 4;
  const statsTop = bottom - 31;
  const nowH = (items.length ? statsTop - 3 : bottom) - 4;
  const cardW = (lw - 2 * 3) / 3;
  return (
    <>
      <Now box={{ left: '4rem', top: '4rem', width: `${lw}rem`, height: `${nowH}rem` }} s={SIZES} />
      {items.length > 0 && (
        <Stats
          items={items}
          box={{ left: '4rem', top: `${statsTop}rem`, width: `${lw}rem`, height: '31rem' }}
          s={{
            width: cardW, height: 31, radius: 2.8, value: 8, sun: 4.4,
          }}
        />
      )}
      {hasDays && (
        <Panel
          blur
          group
          className="days-group"
          style={{
            left: `${rx}rem`, top: '16rem', width: '72rem', height: `${stage.h - 20}rem`,
          }}
        >
          <div className="days-col">
            {data.days.map((d, i) => (
              <Day key={d.date + String(i)} day={d} today={i === 0} variant="row" sizes={DAY} style={{ borderRadius: '4rem' }} />
            ))}
          </div>
        </Panel>
      )}
      <div className="logo-slot" style={{ right: '4rem', top: '4rem' }}>
        <CompanyTile width={18} height={8} />
      </div>
    </>
  );
}

export default Landscape;
