import Stage from '../../components/stage';
import usePlate from '../../components/stage/use-plate';
import FittedText from '../../components/fitted-text';
import Medal from '../../components/medal';
import Banner from '../../components/banner';
import useLabels from '../../lib/use-labels';
import { daysAway } from '../../lib/model';
import { isBanner } from '../../lib/layout';
import './fonts.sass';
import './style.sass';

export const FONTS = [{ family: 'Poppins', weight: 600 }, { family: 'Poppins', weight: 700 }, { family: 'Poppins', weight: 800 }];

const NAME = {
  landscape: [900, 300, 150, 34],
  portrait: [600, 470, 140, 34],
  square: [720, 360, 130, 30],
};

/** A poster: an orange one on a holiday ("today"), a teal one when the holiday is still ahead. The name is the picture: as big as it fits. */
function HolidayPoster({ view }) {
  const {
    t, date, when, scope,
  } = useLabels();
  const { kind } = usePlate();
  const today = view.current.length > 0;
  if (isBanner(kind)) return <Banner view={view} className={`hp ${today ? 'hp--today' : 'hp--ahead'}`} />;

  const holiday = today ? view.current[0] : view.next;
  const away = today ? 0 : daysAway(view.today, holiday.date);
  const [w, h, max, min] = NAME[kind];

  return (
    <Stage className={`hp hp--${kind} ${today ? 'hp--today' : 'hp--ahead'}`}>
      <div className="hp__top">
        <div className="hp__label">{t(today ? 'Holiday today' : 'Next holiday')}</div>
        <Medal kind={holiday.kind} className="hp__medal" />
      </div>
      <FittedText as="h2" text={holiday.name} width={w} height={h} max={max} min={min} lineHeight={0.98} wholeWords className="hp__name" />
      <div className="hp__foot">
        <div className="hp__date">{date(holiday.date)}</div>
        <div className="hp__chips">
          {!today && <span className="hp__chip hp__chip--when">{when(away)}</span>}
          <span className="hp__chip">{scope(holiday.scope)}</span>
        </div>
      </div>
    </Stage>
  );
}

export default HolidayPoster;
