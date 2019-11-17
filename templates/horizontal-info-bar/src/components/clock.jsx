import React, { useState, useEffect } from 'react';
import { tbval } from '@dsplay/template-utils';

const showClock = tbval('clock', true);

function formatTime(date) {
    var minute = String(date.getMinutes());
    var hour = String(date.getHours());
    return (hour.length <= 1 ? '0' + hour : hour) + ':' + (minute.length <= 1 ? '0' + minute : minute);
}

function ClockContent() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, [now]);

    return (
        <div className="block clock">
            {formatTime(now)}
        </div>
    );
}

function Clock() {

    if (!showClock) return null;

    return <ClockContent />;
}

export default Clock;