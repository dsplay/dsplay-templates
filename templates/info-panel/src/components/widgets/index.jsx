import { useEffect, useState } from 'react';
import { FittedText } from '@dsplay/react-template-utils';
import { formatTemp } from '../../lib/model';

// The widgets of the panel, markup and class names as in the approved design (Claude Design canvas, ADR 0070). Sizes are em, set by the format in style.sass.

const pad = (n) => (n < 10 ? `0${n}` : String(n));

/** The date and the time, ticking every 10 s (the minutes are all it shows). */
export function Clock({ hour12, timezone, lng }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);
  let date = '';
  let time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  try {
    const zone = timezone ? { timeZone: timezone } : {};
    date = now.toLocaleDateString(lng, { day: '2-digit', month: 'short', ...zone }).replace(/\./g, '').replace(/\s+de\s+/i, ' ').toUpperCase();
    time = now.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit', hour12, ...zone });
  } catch {
    date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}`;
  }
  const [hours, minutes] = time.split(':');
  return (
    <div className="clock">
      <span className="date">{date}</span>
      <span className="sep">|</span>
      <span className="time">{hours}<span className="blink">:</span>{minutes}</span>
    </div>
  );
}

/** The drawing of the weather: a sun, a cloud, both, and the drops or flakes that go with the cloud. */
function WeatherIcon({ kind }) {
  const sun = kind === 'sun' || kind === 'partly';
  const cloud = kind !== 'sun';
  return (
    <div className={`wx wx-${kind}`}>
      {sun && (
        <i className="sun">
          <i className="spin">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <i key={n} className={`ray r${n}`} />)}</i>
          <i className="core" />
        </i>
      )}
      {cloud && (
        <i className="cloud">
          <i className="b" />
          <i className="c1" />
          <i className="c2" />
        </i>
      )}
      {(kind === 'rain' || kind === 'storm' || kind === 'snow') && <i className="drops"><i /><i /><i /></i>}
    </div>
  );
}

export function Weather({ weather, tiles }) {
  return (
    <>
      <WeatherIcon kind={weather.kind} />
      <span className="wx-t">{formatTemp(weather.temp, weather.unit, true)}</span>
      {tiles && weather.city && <span className="wx-p">{weather.city}</span>}
    </>
  );
}

export function Quotes({ quotes, boxStyle }) {
  return (
    <div className="quotes">
      {quotes.map((q) => (
        <div className="q" key={q.code}>
          <div className="q-cv">
            <span className="q-c">{q.code}</span>
            <span className="q-v" style={boxStyle}>{q.value}</span>
          </div>
          {q.arrow && (
            <span className={`q-d ${q.dir}`}>
              <span className="ar">{q.arrow}</span>
              <span className="pc">{` ${q.pct}`}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function Logo({ url, boxStyle }) {
  return (
    <div className="logo" style={boxStyle}>
      <img src={url} alt="" />
    </div>
  );
}

/** One slide of the rotating area: the icon and the tag, then the text, which is fitted to the room it has (a joke shows the question, then the answer). */
export function Slide({
  slide, fit, lines = 1, newsBoxStyle, active, phase,
}) {
  // `fit` is null on the tall banner, where a long text wraps over several lines at one size instead of shrinking; `lines` is how many lines a text may take before it shrinks no more and is cut (a joke gets one more, for the question and the answer are long)
  // the slide stays hidden until its texts are at their final size: while they are being fitted the room they take changes, and everything laid out around them (the tag, the description,
  // the bar, all centered together) would move under the eye
  const [settled, setSettled] = useState(0);
  const waitFor = fit ? (slide.alt ? 2 : 1) : 0;
  // a slide may open its line with a lead (the horoscope's sign): the tag says it in the formats that show the tag, and the strip, which has none, draws the lead in front of the text
  const lead = (value) => (slide.lead && value === slide.headline ? <><b className="lead">{slide.lead}</b>{' \u00b7 '}</> : null);
  const headline = (value, className, style) => (fit
    ? <FittedText className={className} style={style} text={slide.lead && value === slide.headline ? `${slide.lead} \u00b7 ${value}` : value} max={fit.max} min={fit.min} lines={slide.alt ? lines + 1 : lines} onReady={() => setSettled((n) => n + 1)}>{lead(value)}{value}</FittedText>
    : <span className={className} style={style}>{lead(value)}{value}</span>);
  return (
    <div className={`ri ${settled >= waitFor ? '' : 'unfit'} ${slide.alt ? 'dbl' : ''} ${slide.sev ? `sev-${slide.sev}` : ''} ${active ? 'on' : ''} ${active && phase === 1 ? 'ph1' : ''}`}>
      <div className="rtop">
        {slide.ico && <span className={`ico ${slide.logo ? 'logo' : ''}`} style={newsBoxStyle}>{slide.logo ? <img src={slide.logo} alt="" /> : 'N'}</span>}
        {slide.tile && (
          <span className="tile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={slide.tile} /></svg>
          </span>
        )}
        <span className="tag">{slide.tag}</span>
      </div>
      <div className="rbody">
        {slide.big && <span className="big">{slide.big}</span>}
        {slide.alt ? (
          <div className="swap">
            {headline(slide.headline, 'headline sw-q')}
            {headline(slide.alt, 'headline sw-a')}
          </div>
        ) : headline(slide.headline, 'headline')}
        {slide.sub && <span className="sub">{slide.sub}</span>}
        <div className="bar" style={{ width: '5em' }} />
      </div>
    </div>
  );
}
