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

// The box of the holiday's name per plate, in design px: [width, height, biggest size, smallest size].
const NAME = {
  landscape: { next: [660, 210, 96, 26], today: [800, 260, 128, 30] },
  portrait: { next: [600, 230, 92, 26], today: [600, 300, 112, 30] },
  square: { next: [700, 190, 84, 24], today: [700, 250, 100, 28] },
};

/** The next holiday as a big count of days; on the day of a holiday, that holiday is big and the next one sits in a smaller box under it. */
function NextHoliday({ view }) {
  const { t, date, when, scope } = useLabels();
  const { kind } = usePlate();
  if (isBanner(kind)) return <Banner view={view} className="nh" />;

  const today = view.current.length > 0;
  const main = today ? view.current[0] : view.next;
  const away = today ? 0 : daysAway(view.today, main.date);
  const next = today ? view.next : null;
  const [w, h, max, min] = NAME[kind][today ? 'today' : 'next'];

  return (
    <Stage className={`nh nh--${kind}${today ? ' nh--today' : ''}`}>
      <Medal kind={main.kind} className="nh__medal" />
      <div className="nh__label">{t(today ? 'Holiday today' : 'Next holiday')}</div>
      <div className="nh__body">
        {!today && (
          <div className="nh__count">
            <b>{away}</b>
            <i>{t(away === 1 ? 'day' : 'days')}</i>
          </div>
        )}
        <div className="nh__text">
          <FittedText as="h2" text={main.name} width={w} height={h} max={max} min={min} lineHeight={1.02} wholeWords className="nh__name" />
          <div className="nh__date">{date(main.date)}</div>
          <span className="nh__tag">{scope(main.scope)}</span>
        </div>
      </div>
      {next && (
        <div className="nh__next">
          <Medal kind={next.kind} className="nh__next-medal" />
          <div className="nh__next-text">
            <small>{t('Next holiday')}</small>
            <FittedText as="b" text={next.name} max={40} min={20} lineHeight={1.15} nowrap />
            <FittedText as="span" text={`${when(daysAway(view.today, next.date))} · ${date(next.date, { short: true })}`} max={26} min={15} lineHeight={1.3} nowrap />
          </div>
        </div>
      )}
    </Stage>
  );
}

export default NextHoliday;
