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
import './quina.sass';
import './quina-h.sass';
import './quina-v.sass';
import './quina-banner-h.sass';
import './quina-banner-v.sass';
import './quina-squared.sass';
import logo from '../../../images/quina-branco.png';
import { screenFormat, BANNER_V } from '../../../util.js/screen';



moment.locale('pt-BR');

// Create our number formatter.
var fmt = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function Quina() {

  const title = 'QUINA';

  const {
    result: {
      data: {
        quina: {
          round: {
            number,
            numbers = [],
            prizes: {
              quina: {
                winners,
                amount,
              },
            },
            accumulated,
            city,
            date,
          },
          next: {
            date: nextDate,
            estimatedPrize,
          },
          accumulatedSaintJohnSpecialPrize: nextSpecialPrizeAccumulated,
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
    winnersText = `Acumulou`;
    lastPrize = accumulated;
  }

  const nextDateUTC = moment.utc(nextDate);

  return (
    <div className={`${screenFormat} quina`}>
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
        <div className="numbers">
          <span>
            {numbers.slice(0, 3).map(number => <Ball key={number} value={number} />)}
          </span>
          <span>
            {numbers.slice(3).map(number => <Ball key={number} value={number} />)}
          </span>
        </div>
        <div className="result">
          <span className="winner">{winnersText}</span> (R$
                        <CountUp
            duration={3}
            start={0}
            end={lastPrize}
            decimals={2}
            separator="."
            decimal=","
          />
                    )
                </div>
        <div className="info">
          Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}. Local: {city}
        </div>
      </div>
      <div className="spacer3" />
      <div className="special-prizes">
        Acumulado para Sorteio Especial de São João:
                <strong>
          &nbsp;
          R$
          &nbsp;
                    <CountUp
            duration={5}
            start={0}
            end={nextSpecialPrizeAccumulated}
            decimals={2}
            separator="."
            decimal=","
          />
        </strong>
      </div>
    </div>
  );
}

export default Quina;