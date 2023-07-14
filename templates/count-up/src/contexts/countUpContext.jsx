import {
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isBefore,
} from 'date-fns';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';

function toConvertDate({ dateFromNow, startDate }) {
  const hoursInDay = 24;
  const minutesInDay = 1440;
  const minutesInHours = 60;
  const secondsInMinutes = 60;

  const daysDiference = differenceInDays(
    dateFromNow,
    startDate,
  );
  const hoursDiference = differenceInHours(
    dateFromNow,
    startDate,
  ) - (daysDiference * hoursInDay);
  const minutesDiference = differenceInMinutes(
    dateFromNow,
    startDate,
  ) - (daysDiference * minutesInDay) - (hoursDiference * minutesInHours);
  const secondsDiference = differenceInSeconds(
    dateFromNow,
    startDate,
  ) - (daysDiference * (minutesInDay * secondsInMinutes))
    - (hoursDiference * (minutesInHours * secondsInMinutes))
    - (minutesDiference * secondsInMinutes);

  return {
    days: String(daysDiference).padStart(2, '0'),
    hours: String(hoursDiference).padStart(2, '0'),
    minutes: String(minutesDiference).padStart(2, '0'),
    seconds: String(secondsDiference).padStart(2, '0'),
  };
}

export const CountUpContext = createContext();

export function CountUpContextProvider({ children }) {
  // configuration variables
  const media = useMedia();
  const bgImage = useTemplateVal('bg_image', '');
  const bgColor1 = useTemplateVal('bg_color_1', '');
  const bgColor2 = useTemplateVal('bg_color_2', '');
  const fontColor = useTemplateVal('bg_font_color', '');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [colorFont, setColorFont] = useState('');

  const dateFromNow = new Date();
  const [isActiveTimerUp, setIsActiveTimerUp] = useState(false);
  const startDate = new Date(parseISO(media.startDate));

  // display variables
  const [title, setTitle] = useState('');
  const [oclock, setOclock] = useState(toConvertDate({
    startDate, dateFromNow,
  }));

  let bgColor = '';

  if (bgColor1 && bgColor2) {
    bgColor = `linear-gradient(to bottom, ${bgColor1}, ${bgColor2})`;
  } else {
    bgColor = bgColor1 || bgColor2;
  }

  let bgFinalImage = '';
  if (bgImage) {
    bgFinalImage = `url("${bgImage}")`;
  }

  let textColor = '';
  if (fontColor) {
    textColor = fontColor;
  }

  function finishTimer() {
    setIsActiveTimerUp(false);
    setOclock({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
  }

  function countingTime() {
    const isBeforeDate = isBefore(startDate, dateFromNow);

    if (!isBeforeDate) {
      finishTimer();
    }

    if (isActiveTimerUp) {
      setTimeout(() => {
        setOclock(toConvertDate({ startDate, dateFromNow }));
      }, 1000);
    }
  }

  function setStartValues() {
    setTitle(media.title);
    setBackgroundColor(bgColor);
    setBackgroundImage(bgFinalImage);
    setColorFont(textColor);

    setIsActiveTimerUp(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  useEffect(() => {
    countingTime();
  }, [oclock, isActiveTimerUp]);

  return (
    <CountUpContext.Provider
      value={{
        isActiveTimerUp,
        title,
        startDate,
        colorFont,
        backgroundColor,
        backgroundImage,
        oclock,
        setStartValues,
        setOclock,
        // finishTimer,
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
