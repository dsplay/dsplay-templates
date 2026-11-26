import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { tempText } from '../../util/units';
import Disc from '../disc';
import Company from '../company';
import Details from '../details';
import { daysShown } from '../forecast';
import './style.sass';

// Two reductions at most, then ellipsis (spec weather-base section 5)
export const cityScale = (city) => {
  if (city.length > 26) return 0.7;
  if (city.length > 18) return 0.85;
  return 1;
};

const DISC = { land: 28, port: 28, sq: 20, wide: 16 };
const TEMP = { land: 24, port: 22, sq: 18, wide: 14 };

/** The `now` card (elevated 2): city, disc with the icon, temperature, condition, min/max and details. */
function Now() {
  const { t } = useTranslation();
  const {
    settings, theme, stage, weather,
  } = useView();
  const { set } = stage;
  const { condition } = weather;
  // portrait/square: the description gives way when the line does not fit the card (measured once after rendering)
  const sub = useRef(null);
  const [hideDescription, setHideDescription] = useState(false);
  useLayoutEffect(() => {
    const row = sub.current;
    if (!row || hideDescription) {
      return;
    }
    let total = 0;
    for (let i = 0; i < row.children.length; i += 1) {
      total += row.children[i].getBoundingClientRect().width;
    }
    if (total > row.getBoundingClientRect().width + 1) {
      setHideDescription(true);
    }
  }, [hideDescription, weather, stage.remPx]);
  const text = condition.known ? t(condition.text) : (weather.description || t(condition.text));
  const hasMinMax = settings.showMinMax && weather.min !== null && weather.max !== null;
  const card = {
    backgroundColor: theme.base,
    boxShadow: reliefShadow(theme, 'elevated2'),
  };
  const cityStyle = { fontSize: `${cityScale(weather.city) * (set === 'wide' ? 4.5 : 5.5)}rem` };

  return (
    <div className={`now ${set}${set === 'land' && daysShown(weather) === 0 ? ' alone' : ''}`} style={card}>
      <div className="head">
        <div className="where">
          {settings.showCity && weather.city && <div className="city" style={cityStyle}>{weather.city}</div>}
          <div className="marker" style={{ backgroundColor: theme.primary }} />
        </div>
        {settings.showLogo && <Company />}
      </div>
      <div className="main">
        <Disc name={condition.icon} size={DISC[set]} />
        <div className="temp" style={{ fontSize: `${TEMP[set]}rem` }}>{tempText(weather.temp, settings.unit)}</div>
        {set === 'wide' && hasMinMax && (
          <div className="range" style={{ color: theme.muted }}>
            <div>{`${t('MAX')} ${tempText(weather.max, settings.unit)}`}</div>
            <div>{`${t('MIN')} ${tempText(weather.min, settings.unit)}`}</div>
          </div>
        )}
      </div>
      {set !== 'wide' && (
        <div className="sub" ref={sub}>
          {settings.showDescription && !hideDescription && <div className="description">{text}</div>}
          {hasMinMax && (
            <div className="range" style={{ color: theme.muted }}>
              {`${t('MAX')} ${tempText(weather.max, settings.unit)} · ${t('MIN')} ${tempText(weather.min, settings.unit)}`}
            </div>
          )}
        </div>
      )}
      {settings.showDetails && set === 'land' && <Details variant="wells" />}
      {settings.showDetails && set === 'sq' && <Details variant="line" />}
    </div>
  );
}

export default Now;
