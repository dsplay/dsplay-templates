import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import Logo from '../logo';
import Footer from '../footer';
import './style.sass';

/** No news: the logo and "No news" centered; the footer stays (spec M-001b section 3). */
function Empty() {
  const { t } = useTranslation();
  const { theme } = useView();
  return (
    <div className="empty">
      <div className="empty-center">
        <Logo height={14} maxWidth={40} />
        <div className="empty-text" style={{ color: theme.text }}>{t('No news')}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Empty;
