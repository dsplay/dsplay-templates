import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import LoaderCalendar from '../components/loaderCalendar';

export const CalendarContext = createContext();

export function CalendarContextProvider({ children }) {
  const [showLoader, setShowLoader] = useState(true);
  const [loadedCalendar, setLoadedCalendar] = useState(false);
  const [loadedToday, setLoadedToday] = useState(false);

  function LoadedToday(boolean) {
    setLoadedToday(boolean);
  }
  function LoadedCalendar(boolean) {
    setLoadedCalendar(boolean);
  }
  function loader() {
    if (showLoader) {
      return (
        <LoaderCalendar />
      );
    }

    return <></>;
  }

  useEffect(() => {
    setTimeout(() => {
      if (loadedCalendar && loadedToday) {
        setShowLoader(false);
      }
    }, 1000);
  }, [loadedCalendar, loadedToday]);

  return (
    <CalendarContext.Provider value={{
      LoadedToday,
      LoadedCalendar,
    }}
    >
      {loader()}
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);

  return context;
}
