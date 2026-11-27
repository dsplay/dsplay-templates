import { useTemplateVal, useTemplateBoolVal } from '@dsplay/react-template-utils';
import Icon from '../icon';
import FitBox from '../fit-box';
import { LONG_MESSAGE_LENGTH, getFitRange } from '../../utils/layout';
import { INK } from '../../utils/color';
import './style.sass';

function Main({
  layout, plate, ink, remPx,
}) {
  const iconName = useTemplateVal('icon', 'warning');
  const alertMessage = String(useTemplateVal('alert_message', '') || '').trim();
  const showHoles = useTemplateBoolVal('show_holes', true);

  const hasMessage = alertMessage.length > 0;
  const isLong = alertMessage.length > LONG_MESSAGE_LENGTH;
  const className = `alert ${layout}${isLong ? ' long-text' : ''}${hasMessage ? '' : ' no-message'}`;
  const [min, max] = getFitRange(layout);

  return (
    <div className={className} style={{ backgroundColor: plate }}>
      <div className="plate-field">
        {/* Layers, bottom to top: plate / perforation / frame / ink. The holes sit BELOW all the ink (symbol and text). */}
        {showHoles && <div className="plate-holes" />}
        <div className="alert-icon">
          <Icon name={iconName} ink={ink} />
        </div>
        {hasMessage && (
          <div className="alert-panel" role="alert">
            {layout === 'strip-h' ? (
              <h1 className="one-line" style={{ color: ink }}>{alertMessage}</h1>
            ) : (
              <FitBox text={alertMessage} min={min} max={max} remPx={remPx} color={INK} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
