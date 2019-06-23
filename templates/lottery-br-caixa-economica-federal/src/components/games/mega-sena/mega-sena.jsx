import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/pt';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import CountUp from 'react-countup';
import {
    media, // current media
    config, // player configuration
    template, // custom template values
} from '@dsplay/template-utils';
import Ball from '../../ball';
import './mega-sena.sass';

const {
    result: {
        data: {
            round: {
                numbers = [],
                prizes: {
                    sena: {
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
            }
        },
    },
} = media;

const { locale } = config;

moment.locale('en');
if (locale) {
    moment.locale(locale);
}

function MegaSena() {

    let lastPrize;
    let winnersText;
    if (winners > 0) {
        winnersText = `${winners} ganhadores`;
        lastPrize = amount;
    } else {
        winnersText = `Acumulou`;
        lastPrize = accumulated;
    }

    const nextDateUTC = moment.utc(nextDate);

    return (
        <div className="mega-sena grow flex v">
            <img className="logo" src="https://logodownload.org/wp-content/uploads/2018/10/mega-sena-logo.png" />

            <div className="grow" />

            <div className="next-round flex v">
                <div className="title">Próximo Sorteio</div>
                <div className="date">{nextDateUTC.format('dddd')}, {nextDateUTC.format('LL')}</div>
                <div className="estimated-prize flex h">
                    <span className="currency-symbol">R$ </span>
                    <span className="value-container">
                        <span className="value">
                            <CountUp
                                start={0}
                                end={556200000}
                                decimals={2}
                                separator="."
                                decimal=","
                            />
                        </span>
                        <span className="value-placeholder">{estimatedPrize}</span>
                    </span>
                </div>
            </div>

            <div className="grow" />

            <div className="last-round flex v">
                <div className="title">Último Resultado</div>
                <div className="numbers">
                    {numbers.map(number => <Ball value={number} />)}
                </div>
                <div className="result">
                    <span className="winner">{winnersText}</span> (R$ {lastPrize})
                </div>
                <div className="info">
                    Sorteio realizado em {moment(date).format('L')}, em {place}, {city}
                </div>
            </div>
        </div>
    );
}

export default MegaSena;