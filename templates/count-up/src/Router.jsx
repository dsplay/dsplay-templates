import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CountUp from './pages/CountUp';

function Router() {
  return (
    <Routes>
      <Route path="/countUp" element={<CountUp />} />

      <Route path="/*" element={<CountUp />} />
    </Routes>
  );
}

export default Router;
