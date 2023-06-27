import React from 'react';
import './styles.sass';
import { useCountUpContext } from '../../contexts/countUpContext';

function BoxTimerDays({
  days,
  text,
  IsSemicolon,
}) {
  const arrayCharacteres = days.split('');

  const {
    colorFont,
  } = useCountUpContext();

  return (
    <div className="box-days">
      <div id="timerAndText-box-days">
        <div>
          {
            arrayCharacteres.map((value, indice) => {
              const key = `${indice}k${value}`;
              return (
                <span
                  key={key}
                  className="box-days-timer"
                >
                  {value}
                </span>
              );
            })
          }
        </div>
        <div>
          <p className="box-days-text-p" style={{ color: colorFont }}>{text}</p>
        </div>
      </div>
      {IsSemicolon ? <span className="box-days-semicolon">:</span> : <span className="box-days-semicolon" />}
    </div>
  );
}

export default BoxTimerDays;
