import { parseISO } from 'date-fns';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import startValues from './startValues';

export const CountUpContext = createContext();

export function CountUpContextProvider({ children }) {
  const [isActiveTimerUp, setIsActiveTimerUp] = useState(false);
  const [tittle, setTittle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [backgroundColor, setBackgroundColor] = useState('');

  function finishTimer() {
    setIsActiveTimerUp(false);
  }

  function setStartValues() {
    setTittle(startValues.tittle);
    setStartDate(new Date(parseISO(startValues.startDate)));
    setBackgroundColor(startValues.color);

    setIsActiveTimerUp(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  return (
    <CountUpContext.Provider
      value={{
        isActiveTimerUp,
        tittle,
        startDate,
        backgroundColor,
        setStartValues,
        finishTimer,
      }}
    >
      {children}
    </CountUpContext.Provider>
  );
}

export function useCountUpContext() {
  const context = useContext(CountUpContext);

  return context;
}
