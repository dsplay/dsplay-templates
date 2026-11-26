import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { luminance } from '../../util/color';
import WeatherIcon from '../weather-icon';
import './style.sass';

/** No usable weather: a cloud and "Weather unavailable" on the plain base. No data panels, no error text. */
function Unavailable() {
  const { t } = useTranslation();
  const { theme } = useView();
  return (
    <div className="unavailable" style={{ color: theme.text }}>
      <WeatherIcon name="clouds" size={20} light={luminance(theme.base) > 0.4} />
      <div className="message">{t('Weather unavailable')}</div>
    </div>
  );
}

export default Unavailable;
