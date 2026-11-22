import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import Medal from '../../components/medal';
import Icon from '../../components/icon';
import Banner from '../../components/banner';
import useLabels from '../../lib/use-labels';
import {
  addDays, daysAway, dayOf, holidayOn, isWeekend, weekdayOf,
} from '../../lib/model';
import { NAMES } from '../../lib/names';
import { isBanner, rem } from '../../lib/layout';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Fredoka', weight: 500 }, { family: 'Fredoka', weight: 600 }, { family: 'Fredoka', weight: 700 }];

const MAX_TILES = 7;

/** The days of a run: from the first to the last, at most seven (a Carnival is five). */
function runOf(from, to) {
  const days = [];
  for (let day = from; day <= to && days.length < MAX_TILES; day = addDays(day, 1)) days.push(day);
  return days;
}

/**
 * The next long weekend as one tile per day (weekend days and holidays). With none ahead it shows the holiday that is on, or the next one, as a single tile, so the screen
 * never says "nothing".
 */
function LongWeekend({ view }) {
  const {
    t, lng, date, when,
  } = useLabels();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner view={view} className="lw" />;

  const run = view.longWeekend;
  const single = view.current[0] || view.next;
  const from = run ? run.from : single.date;
  const to = run ? run.to : single.date;
  const days = runOf(from, to);
  const names = NAMES[lng];
  const started = view.today >= from;
  const vertical = kind !== 'landscape';
  const tileW = vertical ? 0 : Math.floor((1152 - (days.length - 1) * 20) / days.length);

  return (
    <Stage className={`lw lw--${kind}`}>
      <div className="lw__head">
        <div className="lw__label">{t(run ? 'Long weekend' : 'Next holiday')}</div>
        {run && <div className="lw__big">{t('{{count}} days off', { count: run.days })}</div>}
        {!run && <div className="lw__big">{single.name}</div>}
        <div className="lw__when">{`${started ? t('on now') : when(daysAway(view.today, from))} · ${date(from, { short: true })}${to !== from ? ` – ${date(to, { short: true })}` : ''}`}</div>
      </div>
      <div className="lw__tiles">
        {days.map((day) => {
          const holiday = holidayOn(view.holidays, day);
          const classes = ['lw__tile'];
          if (holiday) classes.push('lw__tile--holiday');
          if (day === view.today) classes.push('lw__tile--today');
          return (
            <div key={day} className={classes.join(' ')} style={vertical ? undefined : { width: rem(tileW) }}>
              <div className="lw__wd">{names.weekdaysShort[weekdayOf(day)]}</div>
              <div className="lw__num">{dayOf(day)}</div>
              {holiday ? (
                <div className="lw__what">
                  <Medal kind={holiday.kind} className="lw__medal" />
                  {vertical
                    ? <span className="lw__name">{holiday.name}</span>
                    : <FittedText as="span" text={holiday.name} width={tileW - 28} height={96} max={26} min={13} lineHeight={1.1} wholeWords className="lw__name" />}
                </div>
              ) : (
                <div className="lw__what lw__what--off">
                  <Icon kind="generic" className="lw__sun" />
                  <span className="lw__name">{t(isWeekend(day) ? 'Weekend' : 'Day off')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

export default LongWeekend;
