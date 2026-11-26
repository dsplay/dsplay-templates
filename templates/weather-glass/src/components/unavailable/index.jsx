import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import Icon from '../icon';
import Panel from '../panel';
import './style.sass';

/** No data (or outdated with showOutdated=false): a cloud and "Weather unavailable"; no data panels, no error. */
function Unavailable() {
  const { t } = useTranslation();
  const { theme, stage } = useView();
  const w = Math.min(70, stage.w - 8);
  return (
    <Panel blur shadow radius={3.2} className="unavailable" style={{ width: `${w}rem`, height: '36rem', left: `${(stage.w - w) / 2}rem`, top: `${(stage.h - 36) / 2}rem`, color: theme.text }}>
      <div className="unavailable-body">
        <Icon name="clouds" size={16} />
        <div className="msg">{t('Weather unavailable')}</div>
      </div>
    </Panel>
  );
}

export default Unavailable;
