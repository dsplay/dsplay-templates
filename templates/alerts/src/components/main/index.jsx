import {
  FitText,
  useTemplateVal,
} from '@dsplay/react-template-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import './style.sass';
import Icon from '../icon';

function Main() {
  const iconName = useTemplateVal('icon');
  const alertMessage = useTemplateVal('alert_message');
  return (
    <div className="main">
      <div className="flex-container">
        <div className="item1">
          <Icon name={iconName} />
        </div>
        <div className="item2">
          <div className="alert-text">
            <FitText>
              <h1>{alertMessage}</h1>
            </FitText>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Main;
