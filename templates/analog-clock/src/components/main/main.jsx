import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  useTemplateVal,
  useInterval,
} from '@dsplay/react-template-utils';
import City from '../city/city';
import useLanguage from '../../hooks/use-language';
import './main.sass';

function Main() {
  const { t, i18n } = useTranslation();
  const language = useLanguage();
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const background = useTemplateVal('background');
  const clockTheme = useTemplateVal('clock_theme', 'dark');

  const [date, setDate] = useState(moment());

  useInterval(() => setDate(moment()), 1000);

  return (

    <div
      className={`main ${useTemplateVal('background_theme', 'light')}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="ds-container">
        <City
          date={date}
          clockClassName={clockTheme === 'light' ? '' : 'local-timezone'}
          name={t('Local Time')}
        />
      </div>
    </div>
  );
}

export default Main;
