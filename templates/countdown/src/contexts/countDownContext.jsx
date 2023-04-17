import {
  differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isAfter, parseISO,
} from 'date-fns';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useMedia,
  useTemplateVal,
} from '@dsplay/react-template-utils';

function toConvertDate({ finishDate, dateFromNow }) {
  const hoursInDay = 24;
  const minutesInDay = 1440;
  const minutesInHours = 60;
  const secondsInMinutes = 60;

  const daysDiference = differenceInDays(
    finishDate,
    dateFromNow,
  );
  const hoursDiference = differenceInHours(
    finishDate,
    dateFromNow,
  ) - (daysDiference * hoursInDay);
  const minutesDiference = differenceInMinutes(
    finishDate,
    dateFromNow,
  ) - (daysDiference * minutesInDay) - (hoursDiference * minutesInHours);
  const secondsDiference = differenceInSeconds(
    finishDate,
    dateFromNow,
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

export const CountDownContext = createContext();

export function CountDownContextProvider({ children }) {
  // configuration variables
  const media = useMedia();
  const bgColor1 = useTemplateVal('bg_color_1', '');
  const bgColor2 = useTemplateVal('bg_color_2', '');
  const bgImage = useTemplateVal('bg_image', '');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const finishDate = new Date(parseISO(media.finishDate));
  const [isActiveTimerDown, setIsActiveTimerDown] = useState(false);
  const [dateFromNow, setDateFromNow] = useState(new Date());

  // display variables
  const [title, setTitle] = useState('');
  const [oclock, setOclock] = useState(toConvertDate({
    finishDate, dateFromNow,
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

  function finishTimer() {
    setIsActiveTimerDown(false);
    setOclock({
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    });
  }

  function countingTime() {
    const isAfterDate = isAfter(finishDate, dateFromNow);

    if (!isAfterDate) {
      finishTimer();
    }

    if (isActiveTimerDown) {
      setTimeout(() => {
        setOclock(toConvertDate({ finishDate, dateFromNow }));
        setDateFromNow(new Date());
      }, 1000);
    }
  }

  function setStartValues() {
    setTitle(media.title);
    setBackgroundColor(bgColor);
    setBackgroundImage(bgFinalImage);

    setIsActiveTimerDown(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  useEffect(() => {
    countingTime();
  }, [oclock, isActiveTimerDown]);

  return (
    <CountDownContext.Provider
      value={{
        isActiveTimerDown,
        title,
        finishDate,
        backgroundColor,
        backgroundImage,
        oclock,
        setStartValues,
        setOclock,
        // finishTimer,
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
