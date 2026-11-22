import Stage from '../stage';
import usePlate from '../stage/use-plate';
import FittedText from '../fitted-text';
import Medal from '../medal';
import useLabels from '../../lib/use-labels';
import { daysAway } from '../../lib/model';
import './style.sass';

/**
 * The strip formats of every style: the holiday that is on, or else the next one, in a row (horizontal strip) or a column (vertical strip). The style around it only sets the
 * colours (`.banner__medal`, `.banner__label`, `.banner__when`), so the five styles share one strip layout.
 */
function Banner({ view, className = '' }) {
  const { t, date, when } = useLabels();
  const plate = usePlate();
  const vertical = plate.kind === 'v-banner';
  const today = view.current.length > 0;
  const holiday = today ? view.current[0] : view.next;
  const away = today ? 0 : daysAway(view.today, holiday.date);
  const box = vertical ? { w: 204, h: plate.h - 460, max: 36, min: 14 } : { w: plate.w - 420, h: 112, max: 70, min: 16 };

  return (
    <Stage className={`banner-stage ${className}`}>
      <div className={`banner banner--${vertical ? 'v' : 'h'}`}>
        <Medal kind={holiday.kind} className="banner__medal" />
        <div className="banner__text">
          <div className="banner__label">{t(today ? 'Holiday today' : 'Next holiday')}</div>
          <FittedText as="div" text={holiday.name} width={box.w} height={box.h} max={box.max} min={box.min} lineHeight={1.05} wholeWords={vertical} className="banner__name" />
          <div className="banner__when">{today ? date(holiday.date, { short: true }) : `${when(away)} · ${date(holiday.date, { short: true })}`}</div>
        </div>
      </div>
    </Stage>
  );
}

export default Banner;
