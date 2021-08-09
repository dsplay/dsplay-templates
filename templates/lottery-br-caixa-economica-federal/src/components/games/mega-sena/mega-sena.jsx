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
import './mega-sena.sass';
import './mega-sena-h.sass';
import './mega-sena-v.sass';
import './mega-sena-banner-h.sass';
import './mega-sena-banner-v.sass';
import './mega-sena-squared.sass';
import logo from '../../../images/mega-sena-branco.png';
import { screenFormat, BANNER_V } from '../../../util.js/screen';



const {
  fontRatio,
  scaledDensity,
  xdpi,
  ydpi,
  width,
  height,
} = config;

moment.locale('pt-BR');

// Create our number formatter.
var fmt = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

function MegaSena() {

  const title = screenFormat === BANNER_V ? 'MEGA SENA' : 'MEGA-SENA';

  const {
    result: {
      data: {
        megasena: {
          round: {
            number,
            numbers = [],
            prizes: {
              sena: {
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
          accumulatedMegaVirada,
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
    <div className={`${screenFormat} mega-sena`}>
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
        Acumulado para Mega da Virada:
                <strong>
          &nbsp;
          R$
          &nbsp;
                    <CountUp
            duration={5}
            start={0}
            end={accumulatedMegaVirada}
            decimals={2}
            separator="."
            decimal=","
          />
        </strong>
      </div>
    </div>
  );
}

export default MegaSena;