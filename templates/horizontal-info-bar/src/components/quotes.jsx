import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tval } from '@dsplay/template-utils';

const { locale } = window.config;
// const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const CORS_PROXY = 'https://api.allorigins.win/get';
const KEY_VERSION = 'currency_version';
const VERSION = '1.0';

const formatMoney = function (n, c, d, t) {
  var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d === undefined ? "." : d,
    t = t === undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function getNumberSeparator(locale) {

  const separators = {
    pt_br: [',', '.'],
  };

  if (separators[locale]) {
    return separators[locale];
  }

  return ['.', ','];
}

const separators = getNumberSeparator(locale);

const from_1 = tval('source_currency_1');
const from_2 = tval('source_currency_2');
const target_currency = tval('target_currency');
const key = tval('currency_api_key');

const pair1 = `${from_1}_${target_currency}`;
const pair2 = `${from_2}_${target_currency}`;
const storageKey = `quotes_${pair1}_${pair2}`;

function QuotesContent() {
  const [result, setResult] = useState({});
  const [error, setError] = useState();

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCounter(counter + 1), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    let quotes = undefined;
    const storedQuotes = localStorage.getItem(storageKey);
    const storedVersion = localStorage.getItem(KEY_VERSION);

    console.log('Getting quotes');

    if (storedQuotes) {
      try {
        quotes = JSON.parse(storedQuotes);
      } catch (e) {
        localStorage.removeItem(storageKey);
        console.error('Error parsing stored value: ' + storedQuotes);
      }
    }

    if (storedVersion !== VERSION || !quotes || (new Date().getTime() - quotes.timestamp > 1000 * 60 * 50)) {
      (async () => {
        try {
          const res = await axios(CORS_PROXY, {
            params: {
              url: `https://free.currencyconverterapi.com/api/v6/convert?q=${pair1},${pair2}&compact=ultra&apiKey=${key}`
            },
          });
          const value = JSON.parse(res.data.contents);

          setResult(value);
          localStorage.setItem(storageKey, JSON.stringify({
            timestamp: new Date().getTime(),
            value,
          }));
          localStorage.setItem(KEY_VERSION, VERSION.toString());
        } catch (e) {
          console.error(e);
          setError(e);
          localStorage.removeItem(storageKey);
        }
      })();
    } else {
      setResult(quotes.value);
    }
  }, [counter]);

  console.log(error, result);

  if (error || !result[pair1]) {
    return null;
  }

  const currencyValueBoxStyle = {
    backgroundColor: tval('currency_box_color', 'black'),
    color: tval('currency_text_color', 'white'),
  };

  console.log("Hello");

  return (
    <div className="block quotes">
      <div className="block vertical">
        <div className="id">{from_1}</div>
        <div className="value" style={currencyValueBoxStyle}>{formatMoney(result[pair1], 2, separators[0], separators[1])}</div>
      </div>
      <div className="block vertical">
        <div className="id">{from_2}</div>
        <div className="value" style={currencyValueBoxStyle}>{formatMoney(result[pair2], 2, separators[0], separators[1])}</div>
      </div>
    </div>
  );
}


function Quotes() {

  if (!key) {
    return null;
  }

  return <QuotesContent />;
}

export default Quotes;