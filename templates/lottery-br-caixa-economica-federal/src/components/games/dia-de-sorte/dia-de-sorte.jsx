import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import CountUp from 'react-countup';
import { media } from '@dsplay/template-utils';
import Ball from '../../ball';
import './dia-de-sorte.sass';
import './dia-de-sorte-h.sass';
import './dia-de-sorte-v.sass';
import './dia-de-sorte-banner-h.sass';
import './dia-de-sorte-banner-v.sass';
import './dia-de-sorte-squared.sass';
import logo from '../../../images/dia-de-sorte-branco.png';
import { screenFormat } from '../../../util.js/screen';

moment.locale('pt-BR');

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function DiaDeSorte() {

  const title = 'DIA DE SORTE';

  const {
    result: {
      data: {
        diadesorte: {
          round: {
            number,
            numbers = [],
            prizes: {
              hits_7: {
                winners,
                amount,
              },
              luck_month: {
                month,
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
    winnersText = `ACUMULOU`;
    lastPrize = accumulated;
  }

  const nextDateUTC = moment.utc(nextDate);

  return (
    <div className={`${screenFormat} dia-de-sorte`}>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Dia de Sorte" />
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
          <div className="numbers">
            <span>
              {numbers.slice(0, 4).map(number => <Ball key={number} value={number} />)}
            </span>
            <span>
              {numbers.slice(4).map(number => <Ball key={number} value={number} />)}
            </span>
          </div>
          <div>
            <div className="extra-result">
              <span className="label">Mês da Sorte:</span>
              <span className="value">{months[month - 1]}</span>
            </div>
            <div className="result">
              <span className="winner">{winnersText}</span>
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
            </div>
          </div>
        </div>
        <div className="info">
          Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}. Local: {city}
        </div>
      </div>
      <div className="spacer3" />
      <div className="special-prizes">
      </div>
    </div>
  );
}

export default DiaDeSorte;