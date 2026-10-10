import moment from '../../../utils/moment';
import ReactCountUp from 'react-countup';
import { useMedia } from '@dsplay/react-template-utils';
import Logo from '../../logo';
import Match from '../../match';
import './loteca.sass';
import './loteca-h.sass';
import './loteca-v.sass';
import './loteca-banner-h.sass';
import './loteca-banner-v.sass';
import './loteca-squared.sass';
import { screenFormat } from '../../../utils/screen';

const CountUp = ReactCountUp.default || ReactCountUp;

function Loteca() {

  const title = 'LOTECA';

  const media = useMedia();

  const {
    result: {
      data: {
        loteca: {
          round: {
            number,
            matches = [],
            prizes: {
              hits_14: {
                winners,
                amount,
              },
            },
            accumulated,
            isAccumulated,
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
  } else if (isAccumulated) {
    winnersText = 'ACUMULOU';
    lastPrize = accumulated;
  } else {
    winnersText = 'NÃO HOUVE GANHADORES (14 ACERTOS)';
  }

  const nextDateUTC = moment.utc(nextDate);

  return (
    <div className={`${screenFormat} loteca`}>
      <div className="header">
        <div className="logo">
          <Logo primaryColor="#FFF" secondColor="#FDBDB4" />
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
          <div className="matches">
            {matches.map((match) => <Match key={match.game} match={match} />)}
          </div>
          <div>
            <div className="result">
              <span className="winner">{winnersText}</span>
              {lastPrize !== undefined && (
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
              )}
            </div>
          </div>
        </div>
        <div className="info">
          Concurso nº <strong>{number}</strong>, realizado em {moment(date).format('L')}
        </div>
      </div>
      <div className="spacer3" />
      <div className="special-prizes">
      </div>
    </div>
  );
}

export default Loteca;