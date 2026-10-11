import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  LoaderContext,
  useTemplateVal,
  useConfig,
  useInterval,
  useScreenInfo,
  screen,
} from '@dsplay/react-template-utils';
import City from '../city';
import './style.sass';
import clockOffset from '../../utils/clock-offset';
import { LOCAL_CITY } from '../../utils/constants';

function Main() {
  const context = useContext(LoaderContext);
  const {
    tasksResults: [
      cities,
    ],
  } = context;
  const { t } = useTranslation();

  const brandImage = useTemplateVal('brand');
  const background = useTemplateVal('background');
  const { screenFormat } = useScreenInfo();

  let maxCities = brandImage ? 7 : 8;
  if (screenFormat === screen.SQUARE) {
    maxCities -= 4;
  } else if (screenFormat === screen.V_BANNER || screenFormat === screen.H_BANNER) {
    maxCities += 1;
  }

  // The player says what time it is (the server's), so a device with a wrong clock still shows the right hour.
  const { timestamp } = useConfig();
  const [offset] = useState(() => clockOffset(timestamp));
  const now = () => moment(Date.now() + offset);

  const [date, setDate] = useState(now);

  useInterval(() => setDate(now()), 1000);

  return (

    <div
      className={`main ${useTemplateVal('theme')}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="ds-container">
        {
          brandImage
          && (
            <div className="ds-grid-item brand-box ds-center hsidden-square">
              <div className="brand " style={{ backgroundImage: `url(${brandImage})` }} />
            </div>
          )
        }

        {
           

          cities.slice(0, maxCities).map((city, i) => (

            <City
              key={`${city.name}:${i}`}
              {...city}
              date={date}
              clockClassName={city.name === LOCAL_CITY ? 'local-timezone' : ''}
              name={city.name === LOCAL_CITY ? t('Local Time') : city.name}
            />
          ))

        }

      </div>
    </div>
  );
}

export default Main;
