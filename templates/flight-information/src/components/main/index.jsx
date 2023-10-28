import { useContext, useEffect, useState } from 'react';
import './style.sass';
import { IoAirplane } from 'react-icons/io5';
import axios from 'axios';
import { useMedia } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../contexts/themeContext';
import Intro from '../intro';
import useLanguage from '../../hooks/use-language';
import i18n from '../../i18n';
import hourFormat from '../../hooks/use-hour';

const hour12Format = hourFormat();
const formattedUpdateTime = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
};
const dateOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: hour12Format,
};
function Main({ data, airports }) {
  const { globalTheme } = useContext(ThemeContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState(new Date());
  const [flights, setFlights] = useState([]);
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
  const API_KEY = media.apiKey;
  const offset = media.offsetTime * 60000;
  const airportIATA = media.iataCode;
  const departureArrival = media.arrivalDeparture;
  const timePage = media.intervalPages;
  let itemsPerPage = 20;

  if (viewHeight <= 720) {
    itemsPerPage = 11;
  } else if (viewHeight <= 1080) {
    itemsPerPage = 17;
  } else if (viewHeight <= 1280) {
    itemsPerPage = 23;
  } else {
    itemsPerPage = 39;
  }
  async function fetchFlightsData() {
    const response = await axios.get(`https://aviation-edge.com/v2/public/timetable?key=${API_KEY}&iataCode=${airportIATA}&type=${departureArrival}`);
    return response.data;
  }
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);
  useEffect(() => {
    let currentFlights;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    if (flights.length === 0) {
      const flightsReduced = data.filter((flight) => {
        const arrival = departureArrival === 'arrival';
        const time = arrival ? flight.arrival.scheduledTime : flight.departure.scheduledTime;
        const flightTime = new Date(time);
        const codesharedIsNotNull = flight.codeshared === null;
        const timeLimit = new Date(currentTime.getTime() - (offset)); // Tempo atual - 40 minutos
        return flightTime >= timeLimit && codesharedIsNotNull;
      });
      flightsReduced.sort((a, b) => {
        const arrival = departureArrival === 'arrival';
        const timeA = arrival ? a.arrival.scheduledTime : a.departure.scheduledTime;
        const timeB = arrival ? b.arrival.scheduledTime : b.departure.scheduledTime;
        const scheduledTimeA = new Date(timeA);
        const scheduledTimeB = new Date(timeB);
        return scheduledTimeA - scheduledTimeB;
      });
      setFlights(flightsReduced);
      currentFlights = flightsReduced.slice(startIndex, endIndex);
    } else {
      currentFlights = flights.slice(startIndex, endIndex);
    }
    setFlightsView(currentFlights);
    const timer = setTimeout(() => {
      if (endIndex < flights.length) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(1);
      }
    }, timePage);
    return () => clearTimeout(timer);
  }, [data, currentPage]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateCurrentTime = async () => {
      setUpdateTime(new Date());
      let flightsUpdated = await fetchFlightsData();
      flightsUpdated = flightsUpdated.filter((flight) => {
        const arrival = departureArrival === 'arrival';
        const time = arrival ? flight.arrival.scheduledTime : flight.departure.scheduledTime;
        const flightTime = new Date(time);
        const codesharedIsNotNull = flight.codeshared === null;
        const timeLimit = new Date(currentTime.getTime() - (offset)); // Tempo atual - 40 minutos
        return flightTime >= timeLimit && codesharedIsNotNull;
      });
      flightsUpdated.sort((a, b) => {
        const arrival = departureArrival === 'arrival';
        const timeA = arrival ? a.arrival.scheduledTime : a.departure.scheduledTime;
        const timeB = arrival ? b.arrival.scheduledTime : b.departure.scheduledTime;
        const scheduledTimeA = new Date(timeA);
        const scheduledTimeB = new Date(timeB);
        return scheduledTimeA - scheduledTimeB;
      });
      setFlights(flightsUpdated);
    };
    const initialUpdateTimeout = setTimeout(updateCurrentTime, 15 * 60 * 1000);
    const updateInterval = setInterval(updateCurrentTime, 15 * 60 * 1000);
    return () => {
      clearTimeout(initialUpdateTimeout);
      clearInterval(updateInterval);
    };
  }, []);
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, []);
  let planePicture = 'up';
  if (departureArrival === 'arrival') {
    planePicture = 'down';
  }
  if (loading) {
    return (
      <Intro />
    );
  }
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
              <th>{departureArrival === 'arrival' ? t('origin') : t('destination')}</th>
              <th>{t('flight')}</th>
              <th>{t('airline')}</th>
              <th>{t('time')}</th>
              <th>{t('gate')}</th>
              <th>{t('terminal')}</th>
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
                    key={flight.flight.number}
                    style={{ backgroundColor: viewWidth > 700 ? lineColor : '' }}
                    className="flightData"
                  >
                    <td>{destination.nameAirport}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>{flight.flight.number}</td>
                    <td>{flight.airline.name}</td>
                    <td style={{ backgroundColor: viewWidth < 700 ? lineColor : '' }}>
                      {flightDate.toLocaleString(undefined, dateOptions)}
                    </td>
                    <td>{gate}</td>
                    <td>{terminal}</td>
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
