import { useTranslation } from 'react-i18next';
import './style.sass';

const DIRECTION_ANGLES = {
  left: 0,
  down_right: 45,
  down: 90,
  down_left: 135,
  right: 180,
  up_left: 225,
  up: 270,
  up_right: 315,
};

function SecondaryContainer({
  logo, direction, name, place, floor, seta,
}) {
  const { t } = useTranslation();
  const angle = DIRECTION_ANGLES[direction] || 0;

  return (
    <div className="secondary-container">
      <div className="left-content">
        <img src={logo} alt={t('Logo')} />
      </div>
      <div className="center-content">
        <p>{name}</p>
        <p className="description">{floor}</p>
      </div>
      <div className="right-content">
        <p>{place}</p>
        <img
          src={seta}
          alt={t('Direction')}
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        />
      </div>
    </div>
  );
}

export default SecondaryContainer;
