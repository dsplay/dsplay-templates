import {
  getHours,
  getMinutes,
  format,
} from 'date-fns';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreenInfo } from '@dsplay/react-template-utils';
import Unit from '../unit';
import { useCountDownContext } from '../../contexts/count-down-context';
import { headerSizes, pickLayout } from '../../lib/layout';
import './style.sass';
import i18n from '../../i18n';

function CountDown() {
  const {
    backgroundColor,
    backgroundImage,
    title,
    colorFont,
    finishDate,
    oclock,
  } = useCountDownContext();

  const { t } = useTranslation();
  const { w, h } = useScreenInfo();

  const layout = useMemo(() => pickLayout({ width: w, height: h, dayDigits: oclock.days.length }), [w, h, oclock.days.length]);
  const sizes = headerSizes(w, h);

  const units = [
    { digits: oclock.days.split(''), label: t('days') },
    { digits: oclock.hours.split(''), label: t('hours') },
    { digits: oclock.minutes.split(''), label: t('minutes') },
    { digits: oclock.seconds.split(''), label: t('seconds') },
  ];

  return (
    <div className="container-countDown" style={{ backgroundImage: backgroundImage || backgroundColor }}>
      <div className="header-countDown">
        <h1 style={{ color: colorFont, fontSize: `${sizes.title}px` }}>{title}</h1>
        <p style={{ color: colorFont, fontSize: `${sizes.date}px` }}>
          {format(finishDate, 'P', { locale: i18n.t('locale', { returnObjects: true }) })}
          {', '}
          {String(getHours(finishDate)).padStart(2, '0')}
          :
          {String(getMinutes(finishDate)).padStart(2, '0')}
          h
        </p>
      </div>

      <div className="timer-countDown" style={{ fontSize: `${layout.fontSize}px` }}>
        {layout.rows.map((row) => (
          <div key={row.join('-')} className="timer-countDown-row">
            {row.map((index, position) => (
              <Fragment key={index}>
                {position > 0 && <span className="timer-countDown-colon">:</span>}
                <Unit digits={units[index].digits} label={units[index].label} color={colorFont} />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountDown;
