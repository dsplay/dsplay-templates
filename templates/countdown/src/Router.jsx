import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CountDown from './pages/CountDown';

function Router() {
  return (
    <Routes>
      <Route path="/countDown" element={<CountDown />} />

      <Route path="/*" element={<CountDown />} />
    </Routes>
  );
}

export default Router;
