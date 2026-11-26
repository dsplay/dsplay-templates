import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import Icon from '../icon';
import './style.sass';

/** The "visor": a round notch with the condition icon on the plain base inside. */
function Disc({ name, size }) {
  const { theme } = useView();
  const style = {
    width: `${size}rem`,
    height: `${size}rem`,
    backgroundColor: theme.base,
    boxShadow: reliefShadow(theme, 'inset'),
  };
  return (
    <div className="disc" style={style}>
      <Icon name={name} size={size * 0.78} />
    </div>
  );
}

export default Disc;
