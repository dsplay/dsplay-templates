import {
  getHours,
  getMinutes,
  format,
} from 'date-fns';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreenInfo } from '@dsplay/react-template-utils';
import Unit from '../unit';
import { useCountUpContext } from '../../contexts/count-up-context';
import { headerSizes, pickLayout } from '../../lib/layout';
import './style.sass';
import i18n from '../../i18n';

function CountUp() {
  const {
    backgroundColor,
    backgroundImage,
    title,
    colorFont,
    startDate,
    oclock,
  } = useCountUpContext();

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
    <div className="container" style={{ background: backgroundImage || backgroundColor }}>
      <div className="header">
        <h1 style={{ color: colorFont, fontSize: `${sizes.title}px` }}>{title}</h1>
        <p style={{ color: colorFont, fontSize: `${sizes.date}px` }}>
          {format(startDate, 'P', { locale: i18n.t('locale', { returnObjects: true }) })}
          {', '}
          {String(getHours(startDate)).padStart(2, '0')}
          :
          {String(getMinutes(startDate)).padStart(2, '0')}
          h
        </p>
      </div>

      <div className="timer" style={{ fontSize: `${layout.fontSize}px` }}>
        {layout.rows.map((row) => (
          <div key={row.join('-')} className="timer-row">
            {row.map((index, position) => (
              <Fragment key={index}>
                {position > 0 && <span className="timer-colon">:</span>}
                <Unit digits={units[index].digits} label={units[index].label} color={colorFont} />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountUp;
