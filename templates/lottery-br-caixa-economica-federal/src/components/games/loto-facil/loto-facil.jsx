import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import CountUp from 'react-countup';
import { media } from '@dsplay/template-utils';
import Ball from '../../ball';
import './loto-facil.sass';
import './loto-facil-h.sass';
import './loto-facil-v.sass';
import './loto-facil-banner-h.sass';
import './loto-facil-banner-v.sass';
import './loto-facil-squared.sass';
import logo from '../../../images/loto-facil-branco.png';
import { screenFormat } from '../../../util.js/screen';

moment.locale('pt-BR');

function LotoFacil() {

  const title = 'LOTO FÁCIL';

  const {
    result: {
      data: {
        lotofacil: {
          round: {
            number,
            numbers = [],
            prizes: {
              hits_15: {
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
    <div className={`${screenFormat} loto-facil`}>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Loto Fácil" />
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
                {numbers.slice(10).map(number => <Ball key={number} value={number} />)}
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
          Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}. Local: {city}
        </div>
      </div>
      <div className="spacer3" />
      <div className="special-prizes">
        Acumulado para Sorteio Especial da Independência:
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

export default LotoFacil;