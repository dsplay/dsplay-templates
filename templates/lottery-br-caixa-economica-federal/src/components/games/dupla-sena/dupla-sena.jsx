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
import './dupla-sena.sass';
import './dupla-sena-h.sass';
import './dupla-sena-v.sass';
import './dupla-sena-banner-h.sass';
import './dupla-sena-banner-v.sass';
import './dupla-sena-squared.sass';
import logo from '../../../images/dupla-sena-branco.png';
import { screenFormat, BANNER_H, BANNER_V } from '../../../util.js/screen';

const {
    result: {
        data: {
            duplasena: {
                round: {
                    number,
                    numbers1 = [],
                    numbers2 = [],
                    prizes1: {
                        sena: {
                            winners: winners1,
                            amount: amount1,
                        },
                    },
                    prizes2: {
                        sena: {
                            winners: winners2,
                            amount: amount2,
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
                accumulatedEasterSpecialPrize: nextSpecialPrizeAccumulated,
            },
        },
    },
} = media;

moment.locale('pt-BR');

// Create our number formatter.
var fmt = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

function DuplaSena() {

    const title = 'DUPLA SENA';

    let lastPrize1;
    let winnersText1;
    let lastPrize2;
    let winnersText2;
    if (winners1 > 0) {
        winnersText1 = `${winners1} ganhador${winners1 === 1 ? '' : 'es'}`;
        lastPrize1 = amount1;
    } else {
        winnersText1 = `Não houve ganhadores`;
        lastPrize1 = accumulated;
    }

    if (winners2 > 0) {
        winnersText2 = `${winners2} ganhador${winners2 === 1 ? '' : 'es'}`;
        lastPrize2 = amount2;
    } else {
        winnersText2 = `Não houve ganhadores`;
        lastPrize2 = accumulated;
    }

    const nextDateUTC = moment.utc(nextDate);

    return (
        <div className={`${screenFormat} dupla-sena`}>
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
                                {numbers1.slice(0, 3).map(number => <Ball key={number} value={number} />)}
                            </span>
                            <span>
                                {numbers1.slice(3).map(number => <Ball key={number} value={number} />)}
                            </span>
                        </div>
                        <div className="result">
                            <span className="winner">{winnersText1}</span>
                            {
                                (winners1 > 0) &&
                                <>
                                    &nbsp;(R$&nbsp;
                                    <CountUp
                                        duration={3}
                                        start={0}
                                        end={lastPrize1}
                                        decimals={2}
                                        separator="."
                                        decimal=","
                                    />
                                    )
                                </>
                            }
                        </div>
                    </div>
                    {(screenFormat !== BANNER_H) && <hr width="90%" />}
                    {(screenFormat !== BANNER_V) && <span className="h-divider" />}
                    <div>
                        <div className="numbers">
                            <span>
                                {numbers2.slice(0, 3).map(number => <Ball key={number} value={number} />)}
                            </span>
                            <span>
                                {numbers2.slice(3).map(number => <Ball key={number} value={number} />)}
                            </span>
                        </div>
                        <div className="result">
                            <span className="winner">{winnersText2}</span>
                            {
                                (winners2 > 0) &&
                                <>
                                    &nbsp;(R$&nbsp;
                                    <CountUp
                                        duration={3}
                                        start={0}
                                        end={lastPrize2}
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
                Acumulado para Sorteio Especial de Páscoa:
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

export default DuplaSena;