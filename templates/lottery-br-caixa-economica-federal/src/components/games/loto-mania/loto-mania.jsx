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
import './loto-mania.sass';
import './loto-mania-h.sass';
import './loto-mania-v.sass';
import './loto-mania-banner-h.sass';
import './loto-mania-banner-v.sass';
import './loto-mania-squared.sass';
import logo from '../../../images/loto-mania-branco.png';
import { screenFormat, BANNER_H, BANNER_V } from '../../../util.js/screen';



moment.locale('pt-BR');

// Create our number formatter.
var fmt = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function LotoMania() {

  const title = 'LOTO MANIA';

  const {
    result: {
      data: {
        lotomania: {
          round: {
            number,
            numbers = [],
            prizes: {
              hits_20: {
                winners,
                amount,
              },
            },
            accumulated,
            city,
            place,
            date,
          },
          next: {
            date: nextDate,
            estimatedPrize,
          },
          accumulatedIndependenceDaySpecialPrize: nextSpecialPrizeAccumulated,
        },
      },
    },
  } = media;

  let lastPrize;
  let winnersText;

  if (winners > 0) {
    winnersText = `${winners} ganhador${winners === 1 ? '' : 'es'}`;
    lastPrize = amount;
  } else {
    winnersText = `Não houve ganhadores`;
    lastPrize = accumulated;
  }

  const nextDateUTC = moment.utc(nextDate);

  return (
    <div className={`${screenFormat} loto-mania`}>
      <div className="header">
        <div className="logo">
          <img src={logo} />
          <span>{title}</span>
        </div>
      </div>

      <div className="spacer1" />

      <div className="next-round flex v">
        <div className="text">
          <div className="title">Próximo Prêmio</div>
          <div className="date">{nextDateUTC.format('dddd')}, {nextDateUTC.format('LL')}</div>
        </div>
        <div className="estimated-prize flex h">
          <span className="currency-symbol">R$ </span>
          <span className="value-container">
            <span className="value">
              <CountUp
                start={0}
                duration={2}
                end={estimatedPrize}
                decimals={2}
                separator="."
                decimal=","
              />
            </span>
          </span>
        </div>
      </div>
      <div className="spacer2" />

      <div className="last-round flex v">
        <div className="title">Último Resultado</div>
        <div className="results">
          <div>
            <div className="numbers">
              <span>
                {numbers.slice(0, 5).map(number => <Ball key={number} value={number} />)}
              </span>
              <span>
                {numbers.slice(5, 10).map(number => <Ball key={number} value={number} />)}
              </span>
              <span>
                {numbers.slice(10, 15).map(number => <Ball key={number} value={number} />)}
              </span>
              <span>
                {numbers.slice(15).map(number => <Ball key={number} value={number} />)}
              </span>
            </div>
            <div className="result">
              <span className="winner">{winnersText}</span>
              {
                (winners > 0) &&
                <>
                  &nbsp;(R$&nbsp;
                                    <CountUp
                    duration={3}
                    start={0}
                    end={lastPrize}
                    decimals={2}
                    separator="."
                    decimal=","
                  />
                                    )
                                </>
              }
            </div>
          </div>

        </div>
        <div className="info">
          Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}. Local: {place}, {city}
        </div>
      </div>
      <div className="spacer3" />
      <div className="special-prizes">
      </div>
    </div>
  );
}

export default LotoMania;