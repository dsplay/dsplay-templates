import React from 'react';
import Calendar from '../../lib/components/calendar';
import TodayCalendar from '../../lib/components/today-calendar';
import './styles.sass';
import { CalendarContextProvider } from '../../lib/contexts/calendarContext';

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
