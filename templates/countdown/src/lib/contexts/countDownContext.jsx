import { parseISO } from 'date-fns';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import startValues from './startValues';

export const CountDownContext = createContext();

export function CountDownContextProvider({ children }) {
  const [isActiveTimerDown, setIsActiveTimerDown] = useState(false);
  const [tittle, setTittle] = useState('');
  const [finishDate, setFinishDate] = useState(new Date());
  const [backgroundColor, setBackgroundColor] = useState('');

  function finishTimer() {
    setIsActiveTimerDown(false);
  }

  function setStartValues() {
    setTittle(startValues.tittle);
    setFinishDate(new Date(parseISO(startValues.finishDate)));
    setBackgroundColor(startValues.color);

    setIsActiveTimerDown(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  return (
    <CountDownContext.Provider
      value={{
        isActiveTimerDown,
        tittle,
        finishDate,
        backgroundColor,
        setStartValues,
        finishTimer,
      }}
    >
      {children}
    </CountDownContext.Provider>
  );
}

export function useCountDownContext() {
  const context = useContext(CountDownContext);

  return context;
}
