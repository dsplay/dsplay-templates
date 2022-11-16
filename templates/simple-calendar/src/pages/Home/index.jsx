import React from 'react';
import Calendar from '../../components/calendar';
import TodayCalendar from '../../components/today-calendar';
import './styles.sass';
import { CalendarContextProvider } from '../../contexts/calendarContext';

function Home() {
  return (
    <div className="container-home">
      <CalendarContextProvider>
        <TodayCalendar />
        <Calendar />
      </CalendarContextProvider>
    </div>

  );
}

export default Home;
