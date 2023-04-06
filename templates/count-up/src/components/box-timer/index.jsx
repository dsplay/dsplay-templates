import React from 'react';
import './styles.sass';

function BoxTimer({
  box1 = '0',
  box2 = '0',
  text,
  IsSemicolon,
}) {
  return (
    <div className="box">
      <div id="timerAndText">
        <div>
          <span className="box-timer">{box1}</span>
          <span className="box-timer">{box2}</span>
        </div>
        <div>
          <p className="text-p">{text}</p>
        </div>
      </div>
      {IsSemicolon ? <span className="box-semicolon">:</span> : <span className="box-semicolon" />}
    </div>
  );
}

export default BoxTimer;
