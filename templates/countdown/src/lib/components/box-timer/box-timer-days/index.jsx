import React from 'react';
import './styles.sass';

function BoxTimerDays({
  days,
  text,
  IsSemicolon,
}) {
  const arrayCharacteres = days.split('');

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
          <p className="box-days-text-p">{text}</p>
        </div>
      </div>
      {IsSemicolon ? <span className="box-days-semicolon">:</span> : <span className="box-days-semicolon" />}
    </div>
  );
}

export default BoxTimerDays;
