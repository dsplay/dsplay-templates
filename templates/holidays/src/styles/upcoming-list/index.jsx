import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import Medal from '../../components/medal';
import Banner from '../../components/banner';
import FittedText from '../../components/fitted-text';
import useLabels from '../../lib/use-labels';
import { daysAway, lastDay } from '../../lib/model';
import { isBanner } from '../../lib/layout';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Inter', weight: 500 }, { family: 'Inter', weight: 600 }, { family: 'Inter', weight: 700 }];

const ROWS = { landscape: 4, portrait: 7, square: 5 };

/** The holidays that are on and the ones to come, one row each: icon, name, date, where it applies and how far away it is. */
function UpcomingList({ view }) {
  const {
    t, date, when, scope,
  } = useLabels();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner view={view} className="ul" />;

  const rows = [...view.current, ...view.upcoming].slice(0, ROWS[kind]);
  const place = view.place.city || view.place.stateName || view.place.country;
  // beside the name there is room for "in N days" on a wide plate only; on a narrow one it goes on the line under the name, so the name keeps the width
  const wide = kind === 'landscape';

  return (
    <Stage className={`ul ul--${kind}`}>
      <div className="ul__head">
        <div className="ul__title">{t('Upcoming holidays')}</div>
        {place && <div className="ul__place">{place}</div>}
      </div>
      <div className="ul__rows">
        {rows.map((h) => {
          const on = h.date <= view.today && lastDay(h) >= view.today;
          return (
            <div key={`${h.date}-${h.name}`} className={`ul__row${on ? ' ul__row--on' : ''}`}>
              <Medal kind={h.kind} className="ul__medal" />
              <div className="ul__text">
                <FittedText as="b" text={h.name} max={wide ? 38 : 34} min={18} lineHeight={1.15} nowrap />
                <FittedText as="span" text={`${date(h.date, { short: true })} · ${scope(h.scope)}${h.type === 'optional' ? ` · ${t('Optional')}` : ''}${wide ? '' : ` · ${on ? t('today') : when(daysAway(view.today, h.date))}`}`} max={24} min={14} lineHeight={1.3} nowrap />
              </div>
              {wide && <div className="ul__when">{on ? t('today') : when(daysAway(view.today, h.date))}</div>}
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

export default UpcomingList;
