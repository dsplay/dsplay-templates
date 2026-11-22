import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Loader, useTemplateVal, useConfig } from '@dsplay/react-template-utils';
import i18n from '../../i18n';
import Clock from '../clock';
import Quotes from '../quotes';
import News from '../news';
import Weather from '../weather';
import Sponsor from '../sponsor';
import './style.sass';
import '../../entrance.css';

// c - clock
// w - weather
// q - quotes
// n - news
// s - sponsor

const mapWidgets = {
  c: <Clock key="clock" />,
  w: <Weather key="weather" />,
  q: <Quotes key="quotes" />,
  n: <News key="news" />,
  s: <Sponsor key="sponsor" />,
};

const defaultSequenceWidgets = ['s', 'w', 'q', 'n', 'c'];

const filterWidgetsSequence = (sequence) => {
  const widgetsSequence = [];

  sequence.forEach((element) => {
    if (defaultSequenceWidgets.includes(element) && !widgetsSequence.includes(element)) {
      widgetsSequence.push(element);
    }
  });

  defaultSequenceWidgets.forEach((element) => {
    if (!widgetsSequence.includes(element)) {
      widgetsSequence.push(element);
    }
  });

  return widgetsSequence;
};

function App() {
  const { locale } = useConfig();
  const [lng] = (locale || 'en').split('_');

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);

  const backgroundColor = useTemplateVal('bg_color', 'white');
  const bgImage = useTemplateVal('bg_image');
  const color = useTemplateVal('text_color', 'black');
  const widgetsSequenceQuery = useTemplateVal('widgets_sequence_query', defaultSequenceWidgets.join(','));

  const style = {
    backgroundColor,
    backgroundImage: bgImage ? `url('${bgImage}')` : undefined,
    color,
  };

  const widgetsSequence = widgetsSequenceQuery
    ? filterWidgetsSequence([...widgetsSequenceQuery.toLowerCase()])
    : defaultSequenceWidgets;
  const widgets = widgetsSequence.map((element) => mapWidgets[element]);

  return (
    <I18nextProvider i18n={i18n}>
      <Loader
        reveal
      >
        <div className="App block" style={style}>
          {widgets}
        </div>
      </Loader>
    </I18nextProvider>
  );
}

export default App;
