import { useView } from '../../hooks/view-context';
import Now from '../now';
import Day from '../days';
import CompanyTile from '../company-tile';

const SIZES = {
  city: 4.5, temp: 14, icon: 16, minmax: 4, line: 3.4, padding: 2.5,
};
const DAY = {
  day: 3.6, icon: 8, max: 4.5, min: 3.8,
};

/** Wide: `now` at the left (no description), the 5 days as pills of 14.5 x 40 rem, the logo at the right (16 x 7, centered vertically). */
function Wide() {
  const { stage, settings, data } = useView();
  const h = stage.h - 8;
  const hasDays = data.days.length > 0;
  return (
    <>
      <Now box={{ left: '4rem', top: '4rem', width: '78rem', height: `${h}rem` }} s={SIZES} />
      {hasDays && (
        <div className="wide-days" style={{ left: '86rem', top: '4rem', height: `${h}rem` }}>
          {data.days.map((d, i) => (
            <Day
              key={d.date + String(i)}
              day={d}
              today={i === 0}
              variant="col"
              sizes={DAY}
              style={{ width: '14.5rem', height: `${h}rem`, margin: '0 1.1rem', borderRadius: '4rem' }}
            />
          ))}
        </div>
      )}
      {settings.showLogo && (
        <div className="logo-slot" style={{ right: '4rem', top: `${(stage.h - 7) / 2}rem` }}>
          <CompanyTile width={16} height={7} />
        </div>
      )}
    </>
  );
}

export default Wide;
