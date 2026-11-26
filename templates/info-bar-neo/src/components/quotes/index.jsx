import { useView } from '../../hooks/view-context';
import useRemote from '../../hooks/use-remote';
import getJson from '../../util/http';
import { formatMoney, rateOf } from '../../util/money';
import { barShadow } from '../../util/theme';
import './style.sass';

const REFRESH = 60 * 60 * 1000;

function Quotes({ drop }) {
  const { settings, locale, stage } = useView();
  const { sources, target, theme } = settings;
  const key = sources.length && target ? `quotes:${target}:${sources.join(',')}` : '';

  // 1 unit of each source in the target currency; a pair without answer is left out (never "0,00")
  const rates = useRemote(key, () => getJson(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${target.toLowerCase()}.json`,
  ).then((table) => {
    const out = {};
    sources.forEach((source) => {
      const rate = rateOf(table, target, source);
      if (rate > 0) {
        out[source.toUpperCase()] = rate;
      }
    });
    return Object.keys(out).length ? out : null;
  }), REFRESH);

  if (!rates) {
    return null;
  }
  const pairs = sources
    .map((source) => ({ code: source.toUpperCase(), value: formatMoney(rates[source.toUpperCase()], locale) }))
    .filter((pair) => pair.value)
    .slice(0, 2)
    // under pressure the 2nd quote falls first, then the 1st
    .filter((pair, i) => !(drop && drop.indexOf(i === 0 ? 'quote1' : 'quote2') >= 0));
  if (!pairs.length) {
    return null;
  }
  const well = {
    backgroundColor: theme.base,
    boxShadow: barShadow(theme, 'inset', stage.set),
    borderRadius: settings.rounded ? '4rem' : '0.4rem',
  };

  return (
    <div className="widget quotes" data-w="quotes">
      {pairs.map((pair) => (
        <div className={`quote${pair.value.length > 7 ? ' long' : ''}`} key={pair.code} style={well}>
          <span className="code" style={{ color: theme.muted }}>{pair.code}</span>
          <span className="value">{pair.value}</span>
        </div>
      ))}
    </div>
  );
}

export default Quotes;
