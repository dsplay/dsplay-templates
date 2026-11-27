import {
  useState, useContext, useEffect, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  LoaderContext,
  useConfig,
  useInterval,
} from '@dsplay/react-template-utils';
import City from '../city';
import Logo from '../logo';
import WorldMap from '../world-map';
import './style.sass';
import clockOffset from '../../utils/clock-offset';
import layoutFor, { maxCities, bottomHeight } from '../../utils/layout';
import paginate, { PAGE_FADE_MS } from '../../utils/paginate';
import mapColor from '../../utils/map-color';
import citiesMap from '../../services/cities-map';
import useSettings from '../../hooks/use-settings';
import useLogo from '../../hooks/use-logo';
import useWindowSize from '../../hooks/use-window-size';
import { remSize } from '../../hooks/use-format';
import { LOCAL_CITY } from '../../utils/constants';

const STRIPS = ['strip-h', 'strip-v'];

function Main({ format }) {
  const { ready } = useContext(LoaderContext);
  const { t } = useTranslation();
  const settings = useSettings();
  const { look } = settings;
  const companyLogo = useLogo(settings.logo, settings.logoUrl);

  // the cities as the clocks need them: a name and its IANA zone (`Local` and unknown names show the device's own)
  const loaded = useMemo(() => settings.cities.map((name) => ({
    name, timeZone: name === LOCAL_CITY ? undefined : citiesMap[name],
  })), [settings.cities]);
  const size = useWindowSize();
  const pxRem = remSize(format, size.w, size.h);

  // The player says what time it is (the server's), so a device with a wrong clock still shows the right hour.
  const { timestamp } = useConfig();
  const [offset] = useState(() => clockOffset(timestamp));
  const now = () => moment(Date.now() + offset);

  const [date, setDate] = useState(now);

  // the entrance (src/entrance.sass) plays once, on the first page, from the moment the Loader reveals the template; pages that
  // mount later (the page turns) must not replay it, so the class is dropped when it is over
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setEntered(true), 900);
    return () => clearTimeout(id);
  }, [ready]);

  useInterval(() => setDate(now()), 1000);

  const strip = STRIPS.includes(format);
  const hasLogo = settings.showLogo && !strip && format !== 'wide';
  const shown = useMemo(() => loaded.slice(0, maxCities(format)), [loaded, format]);
  const pages = useMemo(() => paginate(shown, settings.zonesPerPage), [shown, settings.zonesPerPage]);
  const paged = pages.length > 1;
  const { animationEnabled, pageInterval } = settings;

  // M-011 §0.10: one page at a time, the next one after `page_interval` s (counted from the end of the cross-fade).
  // `leaving` is the page that is fading out on top of the new one for PAGE_FADE_MS.
  const [turn, setTurn] = useState({
    page: 0, leaving: null, cities: shown, perPage: settings.zonesPerPage,
  });
  // a new set of cities (or page size) starts again from the first page
  if (turn.cities !== shown || turn.perPage !== settings.zonesPerPage) {
    setTurn({
      page: 0, leaving: null, cities: shown, perPage: settings.zonesPerPage,
    });
  }
  const page = Math.min(turn.page, pages.length - 1);

  // the clock for the next turn starts once the cross-fade has ended (`leaving` goes back to null)
  useEffect(() => {
    if (!paged || turn.leaving !== null) return undefined;
    const id = setTimeout(() => {
      setTurn((cur) => ({ ...cur, page: (cur.page + 1) % pages.length, leaving: animationEnabled ? cur.page : null }));
    }, pageInterval * 1000);
    return () => clearTimeout(id);
  }, [paged, pages.length, pageInterval, animationEnabled, turn.page, turn.leaving]);

  useEffect(() => {
    if (turn.leaving === null) return undefined;
    const id = setTimeout(() => setTurn((cur) => ({ ...cur, leaving: null })), PAGE_FADE_MS);
    return () => clearTimeout(id);
  }, [turn.leaving, turn.page]);

  // every page has its own layout (D follows how many clocks it holds); the frame (logo, map, height of the bottom
  // band) comes from the biggest one, the first, so nothing jumps when the page changes
  const layoutOf = (list) => layoutFor(format, list.length, hasLogo);
  const frame = layoutOf(pages[0]);

  // no map on the bars or with show_map off
  const showMap = settings.showMap && !strip;
  const mapTone = mapColor(look.base);

  const cityOf = (city, layout, count, leaving) => (
    <City
      key={city.key}
      name={city.name === LOCAL_CITY ? t('Local Time') : city.name}
      timeZone={city.timeZone}
      local={city.name === LOCAL_CITY}
      date={date}
      diameter={layout.d}
      variant={format === 'strip-h' || format === 'strip-v' ? format : 'cell'}
      height={format === 'strip-v' ? 192 / count : undefined}
      settings={settings}
      dense={format === 'strip-h' && count > 5}
      pxRem={pxRem}
      well={layout.well}
      bare={leaving}
    />
  );

  // one page: its rows of cells (keys carry the page, so a new page mounts its hands already in place)
  const pageView = (index, leaving) => {
    const list = pages[index];
    if (!list) return null;
    const layout = layoutOf(list);
    const items = list.map((city, i) => ({ ...city, key: `${index}:${city.name}:${i}` }));
    return (
      <div className={`page${leaving ? ' page-leaving' : ''}`} key={`${leaving ? 'out' : 'in'}:${index}`}>
        {layout.rows.map((count, r) => {
          const start = layout.rows.slice(0, r).reduce((sum, c) => sum + c, 0);
          const row = items.slice(start, start + count);
          return (
            <div className="row" key={row.map((city) => city.key).join('|')}>
              {row.map((city) => (
                <div className="cell" key={city.key} style={strip ? undefined : { width: `${layout.d}rem` }}>
                  {cityOf(city, layout, list.length, leaving)}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // the new page is below, already at 100%; the old one is on top and fades out (opacity only): never an empty screen
  const stack = (
    <>
      {pageView(page, false)}
      {turn.leaving !== null && turn.leaving !== page && pageView(turn.leaving, true)}
    </>
  );
  const dots = paged && settings.showPageIndicator && !strip && (
    <div className="page-dots" aria-hidden="true">
      {pages.map((p, i) => (
        <span key={i} className={`page-dot${i === page ? ' active' : ''}`} style={{ backgroundColor: look.text }} />
      ))}
    </div>
  );

  const mapView = (mode) => frame.map && frame.map.mode === mode;
  const flatMap = <WorldMap color={mapTone} scale={frame.map ? frame.map.scale : 0} basis={frame.map ? frame.map.basis : 0} />;

  return (
    <div className={`main fmt-${format}${entered ? '' : ' entering'}`} style={{ color: look.text }}>
      {strip ? (
        <div className="stage"><div className="rows rows-strip">{stack}</div></div>
      ) : (
        <div className="stage">
          {frame.logo.band > 0 && (
            <div className="logo-band" style={{ height: `${frame.logo.band}rem` }}>
              <Logo logo={companyLogo} look={look} background={settings.logoBackground} />
            </div>
          )}
          <div className="body">
            {showMap && mapView('flat') && <div className="map-band">{flatMap}</div>}
            {showMap && mapView('behind') && <div className="map-behind">{flatMap}</div>}
            <div className="rows" style={{ height: `${bottomHeight(frame.rows, frame.d)}rem` }}>
              {dots}
              {stack}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
