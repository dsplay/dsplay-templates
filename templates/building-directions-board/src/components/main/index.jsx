import { useTranslation } from 'react-i18next';
import './style.sass';

function MainContainer({ mainLogo }) {
  const { t } = useTranslation();

  return (
    <div className="main-container">
      <img src={mainLogo} alt={t('Logo')} />
    </div>
  );
}

export default MainContainer;
