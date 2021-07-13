import React, { useState, useEffect, useMemo } from 'react';
import { tbval, config } from '@dsplay/template-utils';

const showClock = tbval('clock', true);
const { locale = 'en_US' } = config || {};
const [language] = locale.split('_');

function formatTime(date) {
  var minute = String(date.getMinutes());
  var hour = String(date.getHours());
  return (hour.length <= 1 ? '0' + hour : hour) + ':' + (minute.length <= 1 ? '0' + minute : minute);
}

function formatDate(date) {
  const e = date.getMonth() + 1
  var date = String(date.getDate());
  var month = String(e);
  return (date.length <= 1 ? '0' + date : date) + '-' + (month.length <= 1 ? '0' + month : month);
}

const date = new Date();
date.getMonth

function ClockContent() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [now]);

  const dateText = useMemo(() => new Date().toLocaleString(language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }), [language]);

  return (
    <div className="block clock">
      <div className="time">
        {formatDate(now)} | {formatTime(now)}
      </div>
    </div>
  );
}

function Clock() {

  if (!showClock) return null;

  return <ClockContent />;
}

export default Clock;