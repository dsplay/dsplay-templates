import { parseISO } from 'date-fns';
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

export const CountDownContext = createContext();

export function CountDownContextProvider({ children }) {
  const [isActiveTimerDown, setIsActiveTimerDown] = useState(false);
  const [title, setTitle] = useState('');
  const [finishDate, setFinishDate] = useState(new Date());
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
    setIsActiveTimerDown(false);
  }

  function setStartValues() {
    setTitle(media.title);
    setFinishDate(new Date(parseISO(media.finishDate)));
    setBackgroundColor(bgColor);
    setBackgroundImage(bgFinalImage);

    setIsActiveTimerDown(true);
  }

  useEffect(() => {
    setStartValues();
  }, []);

  return (
    <CountDownContext.Provider
      value={{
        isActiveTimerDown,
        title,
        finishDate,
        backgroundColor,
        backgroundImage,
        setStartValues,
        finishTimer,
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
