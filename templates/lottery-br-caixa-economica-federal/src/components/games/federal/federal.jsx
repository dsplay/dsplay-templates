import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import CountUp from 'react-countup';
import {
  media, // current media
  config, // player configuration
  template, // custom template values
} from '@dsplay/template-utils';
import Ball from '../../ball';
import './federal.sass';
import './federal-h.sass';
import './federal-v.sass';
import './federal-banner-h.sass';
import './federal-banner-v.sass';
import './federal-squared.sass';
import logo from '../../../images/federal-branco.png';
import { screenFormat, BANNER_H, BANNER_V } from '../../../util.js/screen';



moment.locale('pt-BR');

// Create our number formatter.
var fmt = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function Prize({
  number,
  ticket,
  amount,
}) {
  return (
    <div className={`prize prize-${number}`}>
      <span className="id">
        <span className="number">{number}º Prêmio</span>
        <span className="ticket">{ticket}</span>
      </span>
      <span className="amount">
        R$&nbsp;
                <CountUp
          duration={3}
          start={0}
          end={amount}
          decimals={2}
          separator="."
          decimal=","
        />

      </span>
    </div>
  )
}

function Federal() {

  const {
    result: {
      data: {
        federal
      },
    },
  } = media;

  if (!federal) return null;

  const title = 'FEDERAL';
  const {
    round: {
      number,
      prizes,
      city,
      place,
      date,
    },
  } = federal;

  return (
    <div className={`${screenFormat} federal`}>
      <div className="header">
        <div className="logo">
          <img src={logo} />
          <span>{title}</span>
        </div>
      </div>

      <div className="spacer1" />

      <div className="last-round flex v">
        <div className="title">Último Resultado</div>
        <div className="results">
          <div className="prizes">
            <span>
              {prizes.slice(0, 1).map(prize => <Prize key={prize.ticket} {...prize} number={1} />)}
            </span>
            <span>
              {prizes.slice(1, 3).map((prize, i) => <Prize key={prize.ticket} {...prize} number={i + 2} />)}
            </span>
            <span>
              {prizes.slice(3).map((prize, i) => <Prize key={prize.ticket} {...prize} number={i + 4} />)}
            </span>
          </div>
        </div>
        <div className="info">

        </div>
      </div>
      <div className="spacer2" />
      <div className="special-prizes">
        Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}. Local: {place}, {city}
      </div>
    </div>
  );
}

export default Federal;