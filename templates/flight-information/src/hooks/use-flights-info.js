import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useMedia } from '@dsplay/react-template-utils';

const SERVICE_API_URL = 'https://aviation-edge.com/v2/public/timetable';

export function useFlightsInfoPromise(currentTime) {
  const media = useMedia();

  const API_KEY = media.apiKey;
  const airportIATA = media.iataCode;
  const departureArrival = media.arrivalDeparture;
  const offset = -1 * (media.offsetTimeMinutes || 0) * 60000;

  // console.log('requesting promise', currentTime);

  const result = useMemo(() => {
    async function fetch() {
      const response = await axios.get(SERVICE_API_URL, {
        params: {
          key: API_KEY,
          iataCode: airportIATA,
          type: departureArrival,
        },
      });

      if (!Array.isArray(response.data)) {
        // e.g. aviation-edge.com replies 200 with { error, success: false } for a bad/rate-limited
        // key - reject so callers (Loader's tasksErrors, useFlightsInfoFromPromise below) see it
        // as a real failure instead of silently treating it as an empty flights array
        throw new Error(`Unexpected aviation-edge.com response: ${JSON.stringify(response.data)}`);
      }

      const flightsUpdated = response.data.filter((flight) => {
        const arrival = departureArrival === 'arrival';
        const time = arrival ? flight.arrival.scheduledTime : flight.departure.scheduledTime;
        const flightTime = new Date(time);
        const codesharedIsNotNull = flight.codeshared === null;
        const timeLimit = new Date(currentTime.getTime() - (offset));
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

      return flightsUpdated;
    }

    // console.log('fetching', currentTime);
    return fetch();
  }, [currentTime]);

  return result;
}

export function useFlightsInfoFromPromise(currentTime) {
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const promise = useFlightsInfoPromise(currentTime);

  // console.log('get from promise', currentTime);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);

        const response = await promise;
        // console.log(json);
        setResult(response);
        setError(undefined);
      } catch (fetchError) {
        console.error(fetchError);
        setError(fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, [currentTime]);

  return [loading, result, error];
}
