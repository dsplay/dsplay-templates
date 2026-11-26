import { useTranslation } from 'react-i18next';
import './style.sass';

/** The channel never stays blank: a still message while there is nothing to roll. */
function Empty({ vertical }) {
  const { t } = useTranslation();
  return <div className={`empty${vertical ? ' vertical' : ''}`}>{t('No information at the moment')}</div>;
}

export default Empty;
