import { useContext, useEffect, useState } from 'react';
import { IoAirplane } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { useMedia, useInterval, LoaderContext } from '@dsplay/react-template-utils';
import { ThemeContext } from '../../contexts/themeContext';
import useLanguage from '../../hooks/use-language';
import i18n from '../../i18n';
import hourFormat from '../../hooks/use-hour';
import airports from '../../util/airports.json';
import { useFlightsInfoFromPromise } from '../../hooks/use-flights-info';
import './style.sass';

const hour12Format = hourFormat();
const formattedUpdateTime = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};
const dateOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: hour12Format,
};
function Main({ startTime }) {
  const loaderContext = useContext(LoaderContext);

  const { globalTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [updateTime, setUpdateTime] = useState(startTime);
  const [flightsView, setFlightsView] = useState([]);
  const language = useLanguage();
  const formattedLanguage = language.replace(/_/g, '-');
  const [currentPage, setCurrentPage] = useState(1);
  const media = useMedia();
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;
  const iataAirpot = media.iataCode;
  const airpoirtName = airports.find((a) => a.codeIataAirport === iataAirpot);
  const { t } = useTranslation();
  const departureArrival = media.arrivalDeparture;
  const [pageCount, setPageCount] = useState(1);
  const [pageTime, setPageTime] = useState(media.duration);

  let itemsPerPage = 20;

  if (viewHeight <= 720) {
    itemsPerPage = 11;
  } else if (viewHeight <= 1080) {
    itemsPerPage = 14;
  } else if (viewHeight <= 1280 && viewWidth <= 720) {
    itemsPerPage = 30;
  } else if (viewHeight <= 1280 && viewWidth > 720) {
    itemsPerPage = 21;
  } else if (viewHeight <= 1920 && viewWidth <= 1080) {
    itemsPerPage = 39;
  } else {
    itemsPerPage = 33;
  }
  console.log(itemsPerPage);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  const { tasksResults: [initialFlights] } = loaderContext;
  const [fetchingAllFligts, allFlights = initialFlights] = useFlightsInfoFromPromise(updateTime);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    if (allFlights) {
      const currentFlights = allFlights.slice(startIndex, endIndex);
      setFlightsView(currentFlights);
    }
  }, [currentPage, allFlights]);

  useEffect(() => {
    if (!fetchingAllFligts) {
      setPageCount(Math.ceil(allFlights.length / itemsPerPage));
      setPageTime(Math.min(media.duration / pageCount, media.maxPageDurationSeconds * 1000));
    }
  }, [fetchingAllFligts, allFlights]);

  useInterval(() => {
    setCurrentPage(((currentPage) % pageCount) + 1);
  }, pageTime);

  useEffect(() => {
    const updateCurrentTime = async () => {
      setUpdateTime(new Date());
    };

    const updateInterval = setInterval(updateCurrentTime, 15 * 60 * 1000);
    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const planePicture = departureArrival === 'arrival' ? 'down' : 'up';

  return (
    <div className="main">
      <header style={{ backgroundColor: globalTheme.primaryColor }}>
        {
          viewWidth < 700 ? (
            <>
              <section id="sectionHeader">
                <div>
                  <h1>{departureArrival === 'arrival' ? t('arrivals') : t('departures')}</h1>
                  <img src={`./assets/${planePicture}.png`} alt="" />
                </div>
                <div>
                  <div>
                    <h1>{currentTime.toLocaleTimeString(undefined, dateOptions)}</h1>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <div>
                  <h1>{departureArrival === 'arrival' ? t('arrivals') : t('departures')}</h1>
                  <img src={`./assets/${planePicture}.png`} alt="" />
                </div>
              </section>
              <section className="dateArea">
                <span className="hour">
                  <IoAirplane size={35} />
                  <h1>{currentTime.toLocaleTimeString(undefined, dateOptions)}</h1>
                </span>
                <span className="date">{currentTime.toLocaleDateString(formattedLanguage)}</span>
              </section>
            </>
          )
        }
      </header>
      <section className="table">
        <table>
          <thead>
            <tr style={{ backgroundColor: globalTheme.secondaryColor }}>
              <th style={{ width: '40%' }}>{departureArrival === 'arrival' ? t('origin') : t('destination')}</th>
              <th style={{ width: '10%', textAlign: 'center' }}>{t('flight')}</th>
              <th>{t('airline')}</th>
              <th style={{ width: '10%', textAlign: 'center' }}>{t('time')}</th>
              <th style={{ width: '10%', textAlign: 'center' }}>{t('gate')}</th>
              <th style={{ width: '10%', textAlign: 'center' }}>{t('terminal')}</th>
            </tr>
          </thead>
          <tbody>
            {
              flightsView.map((flight, index) => {
                const lineColor = (viewWidth < 700 || index % 2 !== 0) ? globalTheme.lineColor : '';
                const arrival = departureArrival === 'arrival';
                const arrivalTime = flight.arrival.scheduledTime;
                const departureTime = flight.departure.scheduledTime;
                const varDate = arrival ? arrivalTime : departureTime;
                const flightDate = new Date(varDate);
                const { iataCode } = arrival ? flight.departure : flight.arrival;
                const destination = airports.find((a) => a.codeIataAirport === iataCode);
                const gate = arrival ? flight.arrival.gate : flight.departure.gate;
                const terminal = arrival ? flight.arrival.terminal : flight.departure.terminal;
                return (
                  <tr
                    key={flight.flight.number + flight.flight.iataNumber}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                    className="flightData"
                  >
                    <td>{destination.nameAirport}</td>
                    <td style={{ textAlign: 'center', backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight.number}</td>
                    <td>{flight.airline.name}</td>
                    <td style={{ width: '10%', textAlign: 'center', backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {flightDate.toLocaleString(undefined, dateOptions)}
                    </td>
                    <td style={{ textAlign: 'center' }}>{gate}</td>
                    <td style={{ textAlign: 'center' }}>{terminal}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
      <footer className="updateTime" style={{ backgroundColor: globalTheme.secondaryColor }}>
        <p>{airpoirtName.nameAirport}</p>
        <p>{updateTime.toLocaleString(formattedLanguage, formattedUpdateTime).replace(/,|às/g, '')}</p>
      </footer>
    </div>

  );
}

export default Main;
