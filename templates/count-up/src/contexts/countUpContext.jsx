import { parseISO } from 'date-fns';
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

export const CountUpContext = createContext();

export function CountUpContextProvider({ children }) {
  const [isActiveTimerUp, setIsActiveTimerUp] = useState(false);
  const [tittle, setTittle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [backgroundColor, setBackgroundColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const media = useMedia();
  const bgColor1 = useTemplateVal('bg_color_1', '');
  const bgColor2 = useTemplateVal('bg_color_2', '');
  const bgImage = useTemplateVal('bg_image', '');

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
    setIsActiveTimerUp(false);
  }

  function setStartValues() {
    setTittle(media.tittle);
    setStartDate(new Date(parseISO(media.startDate)));
    setBackgroundColor(bgColor);
    setBackgroundImage(bgFinalImage);

    setIsActiveTimerUp(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  return (
    <CountUpContext.Provider
      value={{
        isActiveTimerUp,
        tittle,
        startDate,
        backgroundColor,
        backgroundImage,
        setStartValues,
        finishTimer,
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
