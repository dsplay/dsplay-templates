import moment from '../../../utils/moment';
import ReactCountUp from 'react-countup';
import { useMedia } from '@dsplay/react-template-utils';
import Ball from '../../ball';
import Logo from '../../logo';
import './super-sete.sass';
import './super-sete-h.sass';
import './super-sete-v.sass';
import './super-sete-banner-h.sass';
import './super-sete-banner-v.sass';
import './super-sete-squared.sass';
import { screenFormat, BANNER_V } from '../../../utils/screen';

const CountUp = ReactCountUp.default || ReactCountUp;

function SuperSete() {

  const title = screenFormat === BANNER_V ? 'SUPER SETE' : 'SUPER-SETE';

  const media = useMedia();

  const {
    result: {
      data: {
        supersete: {
          round: {
            number,
            numbers = [],
            prizes: {
              hits_7: {
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
    <div className={`${screenFormat} super-sete`}>
      <div className="header">
        <div className="logo">
          <Logo primaryColor="#D8EBA9" secondColor="#EFFFE1" />
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
              {numbers.slice(0, 3).map((number, index) => <Ball key={`${index}-${number}`} value={number} />)}
            </span>
            <span>
              {numbers.slice(3).map((number, index) => <Ball key={`${index + 3}-${number}`} value={number} />)}
            </span>
          </div>
          <div>
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

export default SuperSete;