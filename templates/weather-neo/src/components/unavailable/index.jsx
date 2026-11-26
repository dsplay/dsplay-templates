import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import Icon from '../icon';
import './style.sass';

/** media.result missing or invalid: a plain cloud and the text, no data panels. */
function Unavailable() {
  const { t } = useTranslation();
  const { theme } = useView();
  return (
    <div className="unavailable" role="status">
      <Icon name="clouds" size={20} />
      <div className="message" style={{ color: theme.muted }}>{t('Weather unavailable')}</div>
    </div>
  );
}

export default Unavailable;
