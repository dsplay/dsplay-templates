import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Medal from '../../components/medal';
import Banner from '../../components/banner';
import FittedText from '../../components/fitted-text';
import useLabels from '../../lib/use-labels';
import {
  dayOf, holidayOn, monthGrid, monthOf, yearOf, lastDay,
} from '../../lib/model';
import { NAMES, WEEK_START } from '../../lib/names';
import { isBanner } from '../../lib/layout';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }];

const ROWS = { landscape: 5, portrait: 5, square: 4 };
const MIN_LISTED = 3;

/** The month on a grid with its holidays marked, and the holidays of the month in a list; a month with none lists what comes next. */
function MonthCalendar({ view }) {
  const {
    t, lng, date, scope,
  } = useLabels();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner view={view} className="mc" />;

  const names = NAMES[lng];
  const grid = monthGrid(view.today, WEEK_START[lng]);
  const inMonth = view.holidays.filter((h) => (yearOf(h.date) === grid.year && monthOf(h.date) === grid.month) || (yearOf(lastDay(h)) === grid.year && monthOf(lastDay(h)) === grid.month));
  // a month with few holidays is filled up with the ones that come next, so the list is never nearly empty
  const rest = view.upcoming.filter((h) => !inMonth.includes(h));
  const listed = (inMonth.length >= MIN_LISTED ? inMonth : [...inMonth, ...rest]).slice(0, ROWS[kind]);
  const allInMonth = listed.every((h) => inMonth.includes(h));
  const place = view.place.city || view.place.stateName || view.place.country;
  const days = [0, 1, 2, 3, 4, 5, 6].map((i) => (i + WEEK_START[lng]) % 7);

  return (
    <Stage className={`mc mc--${kind}`}>
      <div className="mc__head">
        <div className="mc__title">{`${names.months[grid.month]} ${grid.year}`}</div>
        {place && <div className="mc__place">{place}</div>}
      </div>
      <div className="mc__grid" role="table">
        <div className="mc__row mc__row--names">
          {days.map((wd) => <div key={wd} className="mc__name">{names.weekdaysShort[wd]}</div>)}
        </div>
        {grid.weeks.map((week) => (
          <div key={week.find(Boolean).iso} className="mc__row">
            {week.map((cell, i) => {
              if (!cell) return <div key={`${week[0] ? week[0].iso : 'x'}-${i}`} className="mc__cell mc__cell--empty" />;
              const holiday = holidayOn(view.holidays, cell.iso);
              const classes = ['mc__cell'];
              if (holiday) classes.push(holiday.type === 'optional' ? 'mc__cell--optional' : 'mc__cell--holiday');
              if (cell.iso === view.today) classes.push('mc__cell--today');
              return <div key={cell.iso} className={classes.join(' ')}>{cell.day}</div>;
            })}
          </div>
        ))}
      </div>
      <div className="mc__list">
        <div className="mc__list-title">{t(allInMonth ? 'Holidays this month' : 'Holidays')}</div>
        {listed.map((h) => (
          <div key={`${h.date}-${h.name}`} className={`mc__item${h.date < view.today && lastDay(h) < view.today ? ' mc__item--past' : ''}`}>
            <Medal kind={h.kind} className="mc__item-medal" />
            <div className="mc__item-text">
              <FittedText as="b" text={h.name} max={30} min={16} lineHeight={1.15} nowrap />
              <FittedText as="span" text={`${date(h.date, { short: true })}${h.days > 1 ? ` – ${dayOf(lastDay(h))}` : ''} · ${scope(h.scope)}`} max={22} min={13} lineHeight={1.3} nowrap />
            </div>
          </div>
        ))}
      </div>
    </Stage>
  );
}

export default MonthCalendar;
