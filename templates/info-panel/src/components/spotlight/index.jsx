import { useEffect, useState } from 'react';
import { FittedText } from '@dsplay/react-template-utils';
import { useRotation } from '../../lib/rotation';

// The spotlight family (Claude Design canvas, ADR 0070): one widget at a time, with its detail. Markup and class names as in the approved design; style.sass's sibling spotlight.sass has the looks.

const pad = (n) => (n < 10 ? `0${n}` : String(n));
const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

const Icon = ({ path, width = 1.9 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
);

const Thermometer = ({ kind }) => (
  <i className={`th ${kind}`}><i className="tube"><i className="mer" /></i><i className="bulb" /></i>
);

/** The clock of the top bar (when the template pins it): the date and the time, ticking every 10 s. */
function PinnedClock({ hour12, timezone, lng }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);
  let date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}`;
  let time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  try {
    const zone = timezone ? { timeZone: timezone } : {};
    date = now.toLocaleDateString(lng, { day: '2-digit', month: 'short', ...zone }).replace(/\./g, '').replace(/\s+de\s+/i, ' ').toUpperCase();
    time = now.toLocaleTimeString(lng, { hour: '2-digit', minute: '2-digit', hour12, ...zone });
  } catch {
    // keeps the numeric date and the plain time
  }
  const [hours, minutes] = time.split(':');
  return <div className="sclock"><span className="sdate">{date}</span><span className="stime">{hours}<span className="blink">:</span>{minutes}</span></div>;
}

/** The little icon of a forecast day, drawn with HTML boxes so it can move (no animation on SVG on Android 4.4): the sun's rays turn, the cloud drifts, the drops fall. */
const DayIcon = ({ day }) => (
  <div className="dwx">
    {day.sun && <i className="dsun"><i className="dspin">{RAYS.map((deg) => <i key={deg} className="dray" style={{ transform: `rotate(${deg}deg)` }} />)}</i><i className="dcore" /></i>}
    {day.cloud && <i className="dcloud"><i className="b" /><i className="c1" /><i className="c2" /></i>}
    {day.drops && <i className="ddrops"><i /><i /><i /></i>}
  </div>
);

// the biggest size of the clock's digits by format, in em of the hero's type size (what the format's CSS draws)
const BIGTIME_MAX = {
  'sf-landscape': 9.5, 'sf-square': 7.4, 'sf-portrait': 8.6, 'sf-tall': 4.6, 'sf-band': 2.5,
};

// the strip draws one line a slide: its little icon goes before it (the channel's logo for the news, else the icon of the widget; the sign for the horoscope)
function SlimIcon({ s, size }) {
  // the weather is the animated icon of its kind (sun, partly cloudy, cloud, rain...), the same as the forecast days draw
  if (s.isWeather && s.dayIcon) return <span className="sicon wx" style={{ fontSize: `${size}em` }}><DayIcon day={s.dayIcon} /></span>;
  if (s.isNews && s.logo) return <span className="sicon logo" style={{ fontSize: `${size}em` }}><img src={s.logo} alt="" /></span>;
  return s.icon ? <span className="sicon" style={{ fontSize: `${size}em` }}><Icon path={s.icon} /></span> : null;
}

function Hero({ s, format }) {
  if (s.isNews) {
    return (
      <div className={`photo ${s.image ? 'real' : ''}`} style={s.image ? { backgroundImage: `url('${s.image}')` } : undefined}>
        <i className="sun" /><i className="h1" /><i className="h2" /><i className="h3" />
      </div>
    );
  }
  if (s.isWeather) {
    return (
      <div className="bigwx">
        {s.wx !== 'cloud' && s.wx !== 'rain' && s.wx !== 'storm' && s.wx !== 'snow' && s.wx !== 'fog' && (
          <i className="bsun"><i className="spin">{RAYS.map((deg) => <i key={deg} className="ray" style={{ transform: `rotate(${deg}deg)` }} />)}</i><i className="core" /></i>
        )}
        {s.wx !== 'sun' && <i className="bcloud"><i className="cb" /><i className="c1" /><i className="c2" /></i>}
      </div>
    );
  }
  if (s.isQuotes2) {
    // the base currency is a ball of its own, apart and named, then the currencies quoted in it: the screen says which is which
    return (
      <div className="flags2 a-pop">
        {s.base && (
          <>
            <div className="fgroup fbase">
              {s.baseFlag ? <img className="flag" src={s.baseFlag} alt="" /> : <span className="flag nof">{s.base}</span>}
              <span className="flabel">{`${s.labelBase} · ${s.base}`}</span>
            </div>
            <span className="fsep" />
          </>
        )}
        <div className="fgroup">
          <div className="fpair">{s.flag1 && <img className="flag f1" src={s.flag1} alt="" />}{s.flag2 && <img className="flag f2" src={s.flag2} alt="" />}</div>
          {s.base && <span className="flabel">{s.labelVs}</span>}
        </div>
      </div>
    );
  }
  if (s.isHol) return <div className="cal a-pop"><div className="mon">{s.mon}</div><div className="day2">{s.dayNum}</div></div>;
  if (s.isBig) return <div className="bignum a-pop">{s.big}</div>;
  if (s.isClock) {
    // the digits are as wide as the hero allows: fitted, not a size that overflows a narrow region
    return (
      <FittedText className="bigtime a-pop" text={`${s.hours}:${s.minutes}`} max={BIGTIME_MAX[String(format).split(' ')[0]] || 9.5} min={1.5} style={{ width: '100%', textAlign: 'center' }}>
        {s.hours}<span className="blink">:</span>{s.minutes}
      </FittedText>
    );
  }
  if (s.isLogo) return <div className="slogo biglogo a-pop"><img src={s.url} alt="" /></div>;
  if (s.isHoro) return <div className="signbox"><div className="sign a-pop"><Icon path={s.icon} /></div><div className="signname a-rise">{s.signName}</div></div>;
  if (s.isJoke) return <div className="bigic a-pop"><Icon path={s.icon} width={1.5} /></div>;
  if (s.isAlert) return <div className="bigic alertic a-pop"><Icon path={s.icon} width={1.6} /></div>;
  return null;
}

function Info({ s, boost }) {
  return (
    <div className="info" style={boost > 1.02 ? { fontSize: `${boost}em` } : undefined}>
      {s.isQuotes2 && (
        <div className="q2row">
          {s.items.map((it) => (
            <div className="q2" key={it.tagText}>
              <div className="q2m">
                <div className="q2h">{it.flag && <img className="flag" src={it.flag} alt="" />}{it.tagText}{it.full && <span className="q2n">{it.full}</span>}</div>
                <div className="q2p">{it.b}{it.delta && <span className="delta">{it.delta}</span>}</div>
                {it.lo && <div className="q2f">{`Mín ${it.lo} · Máx ${it.hi}`}</div>}
              </div>
              {it.series && (
                <div className={`q2chart ${it.dir}`}>
                  <div className="bars"><svg viewBox="0 0 290 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={it.series} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" /></svg></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {s.hasTag && <div className="tag"><Icon path={s.icon} /><span>{s.tagText}</span></div>}
      {s.isTitled && (
        <>
          <div className="title a-rise">{s.title}</div>
          {s.text && <div className="text a-rise">{s.text}</div>}
        </>
      )}
      {s.isWeather && (
        <>
          <div className="temp">{s.temp}</div>
          {s.text && <div className="text">{s.text}</div>}
        </>
      )}
      {s.hasFacts && (
        <div className="facts" style={{ margin: '0.8em 0 0.5em 0' }}>
          {s.facts.map((f) => <div className="fact a-rise" key={f.k}><small>{f.k}</small>{f.v}</div>)}
        </div>
      )}
      {s.isWeather && s.days.length > 0 && (
        <div className="days">
          {s.days.map((d) => (
            <div className="day a-rise" style={{ animationDelay: d.delay }} key={d.d + d.hi}>
              <small>{d.d}</small>
              <DayIcon day={d} />
              <span className="trow tmax"><Thermometer kind="hi" />{d.hi}</span>
              <span className="trow tmin"><Thermometer kind="lo" />{d.lo}</span>
            </div>
          ))}
        </div>
      )}
      {s.isHol && s.rows.map((r) => (
        <div className="hrow a-rise" style={{ animationDelay: r.delay }} key={r.d + r.m + r.n}>
          <div className="hd">{r.d}<small>{r.m}</small></div><div className="hn">{r.n}</div><div className="hw">{r.w}</div>
        </div>
      ))}
      {s.isJoke && (
        <div className="jsw">
          <div className="title jq">{s.q}</div>
          <div className="title ja">{s.a}</div>
        </div>
      )}
    </div>
  );
}

const LAYOUT = { poster: 'lay-overlay', night: 'lay-overlay', cards: 'lay-side', split: 'lay-side', minimal: 'lay-side' };

/** @param {{spotlight: {slides: object[], pinned: object}, style: string, format: string, lng: string}} props */
export default function Spotlight({
  spotlight, style, format, lng, backgroundStyle, textColor, logoBoxStyle, duration, boost = 1, height = 0, max, hold = false,
}) {
  const { slides, pinned } = spotlight;
  // the strip draws one line per slide, fitted to its width instead of cut
  const slim = /sf-slim/.test(format);
  // the strip's line takes the height it has (23px is the strip's type size), and may wrap over two lines: a 120px strip draws it at about 41px, a 56px one at 23px
  const slimMax = Math.min(2.2, Math.max(0.9, ((Number(height) || 0) * 0.34) / 23));
  const { active, phase } = useRotation({ phases: slides.map((s) => (s.isJoke ? 2 : 1)), duration, max, hold });
  const hasHead = Boolean(pinned.clock || pinned.logo);
  // on the strip a joke's line is its question, then its answer, as in the other formats
  const lineOf = (s, i) => (s.isJoke && i === active && phase === 1 ? s.a : s.line);
  // a slide may open its line with a lead in bold (the horoscope's sign), never cut whatever the rest does
  const withLead = (s, line) => (s.lead ? `${s.lead} \u00b7 ${line}` : line);
  return (
    <div className={`sp ${format} st-${style} ${LAYOUT[style]} ${hasHead ? 'withhead' : 'nohead'}`} style={{ width: '100%', height: '100%', color: textColor || undefined }}>
      <div className="sbg" style={backgroundStyle} />
      <div className="head">
        {pinned.clock ? <PinnedClock lng={lng} {...pinned.clock} /> : <div />}
        {pinned.logo && <div className="slogo" style={logoBoxStyle}><img src={pinned.logo.url} alt="" /></div>}
      </div>
      <div className="stage">
        {slides.map((s, i) => (
          <div className={`slide sl-${s.kind} ${i === active ? 'on' : ''} ${i === active && phase === 1 ? 'ph1' : ''}`} key={s.key}>
            <div className="hero"><Hero s={s} format={format} /></div>
            <Info s={s} boost={LAYOUT[style] === 'lay-overlay' ? Math.min(boost, 1.15) : boost} />
            {slim && <SlimIcon s={s} size={slimMax} />}
            {slim ? (
              <FittedText className="sline" text={withLead(s, lineOf(s, i))} max={slimMax} min={0.45} lines={2}>
                {s.lead ? <><b className="lead">{s.lead}</b>{` \u00b7 ${lineOf(s, i)}`}</> : undefined}
              </FittedText>
            ) : <span className="sline">{s.line}</span>}
          </div>
        ))}
      </div>
      <div className="foot">
        {slides.map((s, i) => <i key={s.key} className={`dot ${i === active ? 'on' : ''}`} />)}
      </div>
    </div>
  );
}
