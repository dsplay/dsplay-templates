import { useView } from '../../hooks/view-context';
import Now from '../now';
import Stats, { statsOf } from '../stats';
import Day from '../days';
import Panel from '../panel';
import CompanyTile from '../company-tile';

const SIZES = {
  city: 6, temp: 22, icon: 24, minmax: 5, desc: 4.5, padding: 3,
};
const DAY = {
  day: 4.5, date: 3, icon: 11, max: 5.5, min: 4.6,
};

/** Portrait: `now` on top, 3 detail cards, the 5 days as tall pills at the bottom. */
function Portrait() {
  const {
    stage, settings, data, locale,
  } = useView();
  const items = settings.showDetails ? statsOf(data, settings, locale) : [];
  const hasDays = data.days.length > 0;
  let bottom = stage.h - 4;
  const daysTop = bottom - 54;
  if (hasDays) {
    bottom = daysTop - 4;
  }
  const statsTop = bottom - 26;
  if (items.length) {
    bottom = statsTop - 4;
  }
  const width = stage.w - 8;
  return (
    <>
      <Now box={{ left: '4rem', top: '16rem', width: `${width}rem`, height: `${bottom - 16}rem` }} s={SIZES} />
      {items.length > 0 && (
        <Stats
          items={items}
          box={{ left: '4rem', top: `${statsTop}rem`, width: `${width}rem`, height: '26rem' }}
          s={{
            width: 31, height: 26, radius: 2.8, value: 7, sun: 4,
          }}
        />
      )}
      {hasDays && (
        <Panel blur group className="days-group" style={{ left: '4rem', top: `${daysTop}rem`, width: `${width}rem`, height: '54rem' }}>
          <div className="days-row">
            {data.days.map((d, i) => (
              <Day key={d.date + String(i)} day={d} today={i === 0} variant="col" sizes={DAY} style={{ width: '18rem', height: '54rem', margin: '0 1.25rem', borderRadius: '4rem' }} />
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

export default Portrait;
