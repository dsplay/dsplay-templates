import { useView } from '../../hooks/view-context';
import Now from '../now';
import Day from '../days';
import Panel from '../panel';
import CompanyTile from '../company-tile';

const SIZES = {
  city: 5, temp: 18, icon: 16, minmax: 4.2, desc: 4.5, line: 3.6, padding: 2.5,
};
const DAY = {
  day: 3.6, icon: 8, max: 4.5, min: 3.8,
};

/** Square: `now` with one line of details, then ONE glass panel of 100 x 32 rem with the 5 days in columns of 20 rem. */
function Square() {
  const { stage, data } = useView();
  const hasDays = data.days.length > 0;
  const daysTop = stage.h - 4 - 32;
  const nowBottom = hasDays ? daysTop - 4 : stage.h - 4;
  const width = stage.w - 8;
  return (
    <>
      <Now box={{ left: '4rem', top: '14rem', width: `${width}rem`, height: `${nowBottom - 14}rem` }} s={SIZES} />
      {hasDays && (
        <Panel blur radius={3.2} className="days-group" style={{ left: '4rem', top: `${daysTop}rem`, width: `${width}rem`, height: '32rem' }}>
          <div className="days-row">
            {data.days.map((d, i) => (
              <Day
                key={d.date + String(i)}
                bare
                day={d}
                today={i === 0}
                variant="col"
                sizes={DAY}
                style={{ width: '20rem', height: '32rem', borderRadius: '3.2rem' }}
              />
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

export default Square;
